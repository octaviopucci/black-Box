'use client'

/**
 * Optional native boot hooks (Capacitor).
 * Call from AppProviders when ready to polish status bar / splash / AdMob init.
 */
export async function bootNativeShell() {
  if (typeof window === 'undefined') return
  const Cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor
  if (!Cap?.isNativePlatform?.()) return

  try {
    const { StatusBar, Style } = await import('@capacitor/status-bar')
    await StatusBar.setStyle({ style: Style.Dark })
    await StatusBar.setBackgroundColor({ color: '#000000' })
  } catch {
    // Plugin may be unavailable on web
  }

  try {
    const { SplashScreen } = await import('@capacitor/splash-screen')
    await SplashScreen.hide()
  } catch {
    // ignore
  }

  // Future: AdMob.initialize({ ... })
}
