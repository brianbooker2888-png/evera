import type { CapacitorConfig } from '@capacitor/cli';

const config:CapacitorConfig={
  appId:'com.evera.game',
  appName:'EVERA',
  webDir:'dist',
  bundledWebRuntime:false,
  server:{androidScheme:'https'}
};

export default config;
