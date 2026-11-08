/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider } from './context/AppContext';
import { AndroidFrame } from './components/AndroidFrame';

export default function App() {
  return (
    <AppProvider>
      <AndroidFrame />
    </AppProvider>
  );
}

