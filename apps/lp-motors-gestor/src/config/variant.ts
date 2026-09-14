/** Variante de build: `x` = versão interativa publicada em /lp-motors-x/ */
export const isInteractive = import.meta.env.VITE_INTERACTIVE === '1'

/** Sufixo de storage para não misturar sessão/dados com a versão estável. */
export const storageSuffix = isInteractive ? '_x' : ''

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'LP Motors Gestor'
export const APP_SHORT = import.meta.env.VITE_APP_SHORT || 'LP Motors'
export const APP_DESCRIPTION =
  import.meta.env.VITE_APP_DESCRIPTION ||
  'LP Motors Gestor — Sistema profissional de gestão de estoque e operação para lojas de veículos'

/** Pré-preenche o código da loja no login (ex.: build Pucci → pucci-motors). */
export const DEFAULT_STORE_SLUG = import.meta.env.VITE_DEFAULT_STORE_SLUG || ''
