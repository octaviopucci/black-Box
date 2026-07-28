/** Variante de build: `x` = versão interativa publicada em /maciel-motors-x/ */
export const isInteractive = import.meta.env.VITE_INTERACTIVE === '1'

/** Sufixo de storage para não misturar sessão/dados com a versão estável. */
export const storageSuffix = isInteractive ? '_x' : ''
