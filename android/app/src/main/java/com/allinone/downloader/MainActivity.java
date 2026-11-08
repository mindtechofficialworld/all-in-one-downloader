package com.allinone.downloader;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.ConsoleMessage;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.webkit.WebViewAssetLoader;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class MainActivity extends AppCompatActivity {

    private WebView mWebView;
    private WebViewAssetLoader mAssetLoader;
    // Uses AndroidX secure virtual HTTPS origin to allow ES modules, fetch, and local storage without CORS or file:// limitations
    private static final String APP_URL = "https://appassets.androidplatform.net/assets/public/index.html";
    private static final String TAG = "AllInOneDownloader";

    @Override
    @SuppressLint({"SetJavaScriptEnabled", "RequiresFeature"})
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Customize system bars to dark theme
        setupSystemBars();

        // Configure WebViewAssetLoader for modern AndroidX WebKit
        mAssetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        // Initialize WebView
        mWebView = new WebView(this);
        setContentView(mWebView);

        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);

        mWebView.setBackgroundColor(Color.parseColor("#111114"));

        mWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onConsoleMessage(ConsoleMessage consoleMessage) {
                Log.d(TAG, "JS: " + consoleMessage.message() + " (" + consoleMessage.sourceId() + ":" + consoleMessage.lineNumber() + ")");
                return true;
            }
        });

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                if (mAssetLoader != null && request.getUrl() != null) {
                    WebResourceResponse response = mAssetLoader.shouldInterceptRequest(request.getUrl());
                    if (response != null) {
                        return response;
                    }
                }
                return super.shouldInterceptRequest(view, request);
            }

            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                Log.e(TAG, "WebView error: " + description + " for URL: " + failingUrl);
            }
        });

        // Handle initial incoming Intent
        handleIncomingIntent(getIntent());
    }

    @Override
    protected void onNewIntent(@NonNull Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIncomingIntent(intent);
    }

    /**
     * Extracts shared URL from Android ACTION_SEND intent and passes it to the web app
     */
    private void handleIncomingIntent(Intent intent) {
        if (intent == null) {
            loadDefaultUrl();
            return;
        }

        String action = intent.getAction();
        String type = intent.getType();

        if (Intent.ACTION_SEND.equals(action) && type != null && "text/plain".equals(type)) {
            String sharedText = intent.getStringExtra(Intent.EXTRA_TEXT);
            if (sharedText != null && !sharedText.trim().isEmpty()) {
                String extractedUrl = extractUrl(sharedText);
                if (extractedUrl != null) {
                    loadUrlWithParameter(extractedUrl);
                    return;
                }
            }
        } else if (Intent.ACTION_VIEW.equals(action)) {
            Uri data = intent.getData();
            if (data != null) {
                String targetUrl = data.getQueryParameter("url");
                if (targetUrl != null) {
                    loadUrlWithParameter(targetUrl);
                    return;
                }
            }
        }

        loadDefaultUrl();
    }

    private void loadDefaultUrl() {
        if (mWebView != null && mWebView.getUrl() == null) {
            mWebView.loadUrl(APP_URL);
        }
    }

    private void loadUrlWithParameter(String targetUrl) {
        try {
            String encoded = URLEncoder.encode(targetUrl, "UTF-8");
            String fullUrl = APP_URL + "?url=" + encoded;
            if (mWebView != null) {
                mWebView.loadUrl(fullUrl);
            }
        } catch (UnsupportedEncodingException e) {
            loadDefaultUrl();
        }
    }

    private String extractUrl(String text) {
        Pattern pattern = Pattern.compile("https?://[^\\s]+", Pattern.CASE_INSENSITIVE);
        Matcher matcher = pattern.matcher(text);
        if (matcher.find()) {
            String url = matcher.group(0);
            return url.replaceAll("[.,;:!?)]+$", "");
        }
        return text.trim();
    }

    private void setupSystemBars() {
        Window window = getWindow();
        window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
        window.setStatusBarColor(Color.parseColor("#111114"));
        window.setNavigationBarColor(Color.parseColor("#09090b"));

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            window.setDecorFitsSystemWindows(true);
        } else {
            window.getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            );
        }
    }

    @Override
    public void onBackPressed() {
        if (mWebView != null && mWebView.canGoBack()) {
            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
