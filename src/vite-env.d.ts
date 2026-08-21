/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE?: string
  readonly VITE_INTERACTIVE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
