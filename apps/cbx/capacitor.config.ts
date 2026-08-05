import type { CapacitorConfig } from '@capacitor/cli'

/**
 * CBX native shell (Android / iOS).
 * webDir = Next.js static export (`out/`).
 * Native builds must use empty basePath — see `npm run build:native`.
 */
const config: CapacitorConfig = {
  appId: 'br.com.cbx.marketplace',
  appName: 'CBX',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      backgroundColor: '#000000',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#000000',
    },
  },
}

export default config
