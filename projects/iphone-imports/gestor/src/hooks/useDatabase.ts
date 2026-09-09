import { loadDatabase } from '@/services/database'
import type { OrgDatabase } from '@/types'

export function useDatabase(): OrgDatabase {
  const db = loadDatabase()
  if (!db) throw new Error('Database not loaded')
  return db
}
