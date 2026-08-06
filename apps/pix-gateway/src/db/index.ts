export { JsonDatabase as openDatabaseAsync, resolveDatabasePath, type Db, type JsonDatabase } from './json-store.js'

/** Sync open only for tests that already have a file — prefer openDatabaseAsync. */
export async function openDatabase(databasePath: string) {
  const { JsonDatabase, resolveDatabasePath } = await import('./json-store.js')
  return JsonDatabase.open(resolveDatabasePath(databasePath))
}
