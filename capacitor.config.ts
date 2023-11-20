import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nanodata.email',
  appName: '1 sec email',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
