import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quran.app',
  appName: 'quran-light',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
