import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.quran.app',
  appName: 'القرآن الكريم',
  webDir: 'dist/quran_light',
  server: {
    androidScheme: 'https'
  }
};

export default config;
