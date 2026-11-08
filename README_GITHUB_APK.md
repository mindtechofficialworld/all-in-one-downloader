# ALL IN ONE DOWNLOADER — GitHub Actions APK Build Guide (हिंदी & English)

यह रिपॉजिटरी **GitHub Actions CI/CD** के साथ पूरी तरह से कॉन्फ़िगर की गई है। जब भी आप इस कोड को GitHub पर पुश करेंगे, GitHub Actions अपने आप **All in One Downloader** का Android APK (`.apk`) जनरेट करके आपको डाउनलोड के लिए देगा।

---

## 📁 प्रोडक्शन प्रोजेक्ट स्ट्रक्चर (Production Structure)

```
.
├── .github/
│   └── workflows/
│       └── build-apk.yml        <-- स्वचालित GitHub Actions APK बिल्डर
├── android/                     <-- नेटिव एंड्रॉइड प्रोजेक्ट
│   ├── app/
│   │   ├── build.gradle         <-- SDK 34, Android 14 रेडी
│   │   └── src/main/
│   │       ├── AndroidManifest.xml <-- Share Sheet (ACTION_SEND) और स्टोरेज परमिशन्स
│   │       ├── assets/public/   <-- कंपाइल की गई प्रोडक्शन वेब फ़ाइलें
│   │       ├── java/com/allinone/downloader/MainActivity.java
│   │       └── res/             <-- ऐप आइकॉन और स्टाइल
│   ├── build.gradle
│   ├── settings.gradle
│   ├── gradle.properties
│   └── gradlew
├── scripts/
│   └── prepare-android-assets.js
├── src/                         <-- React + TypeScript + Tailwind UI
├── package.json
└── vite.config.ts
```

---

## 🚀 GitHub से APK बिल्ड करने के 3 आसान स्टेप्स (3 Simple Steps)

### स्टेप 1: कोड को GitHub पर पुश करें (Push to GitHub)
अपने टर्मिनल / कमांड प्रॉम्प्ट में यह कमांड्स चलाएं:

```bash
# 1. गिट इनिशियलाइज़ करें
git init

# 2. सभी फाइल्स जोड़ें
git add .

# 3. कमिट करें
git commit -m "feat: complete All in One Downloader with GitHub Actions APK build"

# 4. मेन ब्रांच सेट करें
git branch -M main

# 5. अपना GitHub रिपॉजिटरी लिंक जोड़ें (YOUR_USERNAME और REPO_NAME बदलें)
git remote add origin https://github.com/<YOUR_USERNAME>/<REPO_NAME>.git

# 6. पुश करें
git push -u origin main
```

---

### स्टेप 2: GitHub Actions में बिल्ड देखें (Watch the Build)
1. अपने GitHub रिपॉजिटरी पेज पर जाएं।
2. ऊपर मेन्यू में **"Actions"** टैब पर क्लिक करें।
3. आपको **"Build Android APK"** वर्कफ़्लो चलता हुआ दिखेगा (पीला निशान घूमता दिखेगा)।
4. लगभग 2 से 3 मिनट में यह सफलतापूर्वक पूरा होकर हरा टिक (✅) बन जाएगा।

*(नोट: आप कभी भी "Actions" टैब में जाकर **"Run workflow"** बटन दबाकर मैन्युअल रूप से भी नया APK जनरेट कर सकते हैं)*

---

### स्टेप 3: तैयार APK डाउनलोड और इनस्टॉल करें (Download APK)
1. सफल बिल्ड (Green Checkmark) पर क्लिक करें।
2. पेज के सबसे नीचे स्क्रॉल करें जहां **"Artifacts"** सेक्शन है।
3. वहां आपको **`AllInOneDownloader-Debug-APK`** दिखाई देगा।
4. उस पर क्लिक करके ज़िप फ़ाइल डाउनलोड करें।
5. ज़िप को अनज़िप (Extract) करें — अंदर आपको आपका **`app-debug.apk`** मिल जाएगा!
6. इसे अपने Android फ़ोन में ट्रांसफर करके इंस्टॉल करें।

---

## ✨ ऐप के मुख्य फीचर्स (Included in this APK)

1. **Android Share Sheet इंटीग्रेशन**:
   - जब भी कोई यूजर YouTube, TikTok, Facebook, Instagram या Twitter/X पर "Share" दबाएगा, तो शेयर मेन्यू में **All in One Downloader** का विकल्प अपने आप दिखेगा।
   - ऐप लिंक को सीधे कैप्चर करके तुरंत फॉर्मेट सिलेक्शन बॉटम-शीट खोलेगा।

2. **फॉर्मेट सिलेक्शन बॉटम-शीट (Screenshot 4 अनुरूप)**:
   - म्यूजिक: Fast (7.0 MB), Classic MP3 (7.6 MB)
   - वीडियो: Fast 360p (22.7 MB), High Quality 720p (61.0 MB), 1080p Full HD, 4K Ultra HD
   - एक-क्लिक पीला/गोल्डन डाउनलोड बटन।

3. **डाउनलोड्स मैनेजर (Screenshot 2 अनुरूप)**:
   - 4 श्रेणियां: All, Videos, Music, Downloading
   - लाइव स्पीड (MB/s), प्रोग्रेस बार, रिमेनिंग टाइम, पॉज़, रेज़्युम, कैंसल, डिलीट।

4. **बिल्ट-इन मीडिया प्लेयर्स**:
   - वीडियो प्लेयर: फुलस्क्रीन, रोटेशन, 10s सीक, ब्राइटनेस, वॉल्यूम, प्लेबैक स्पीड (0.5x - 2.0x), सबटाइटल्स।
   - ऑडियो प्लेयर: वेवफॉर्म, एल्बम आर्ट, लूप, टाइमलाइन स्क्रबर।

5. **नोटिफिकेशन्स (Screenshot 1 अनुरूप)**:
   - प्रोग्रेस और कम्प्लीशन नोटिफिकेशन टॉगल्स।
