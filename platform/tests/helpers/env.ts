export function setTestEnv(values: Record<string, string | undefined>) {
  for (const [key, value] of Object.entries(values)) {
    if (value === undefined) {
      delete (process.env as Record<string, string | undefined>)[key]
    } else {
      ;(process.env as Record<string, string>)[key] = value
    }
  }
}
