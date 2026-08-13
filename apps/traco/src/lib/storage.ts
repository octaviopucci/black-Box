import type { DocumentMeta, PersistedDocument } from '@/types'

const INDEX_KEY = 'traco.docs.index'
const DOC_PREFIX = 'traco.doc.'

function readIndex(): DocumentMeta[] {
  try {
    const raw = localStorage.getItem(INDEX_KEY)
    return raw ? (JSON.parse(raw) as DocumentMeta[]) : []
  } catch {
    return []
  }
}

function writeIndex(list: DocumentMeta[]) {
  localStorage.setItem(INDEX_KEY, JSON.stringify(list))
}

export function listDocuments(): DocumentMeta[] {
  return readIndex().sort((a, b) => b.updatedAt - a.updatedAt)
}

export function loadDocument(id: string): PersistedDocument | null {
  try {
    const raw = localStorage.getItem(DOC_PREFIX + id)
    return raw ? (JSON.parse(raw) as PersistedDocument) : null
  } catch {
    return null
  }
}

export function saveDocument(doc: PersistedDocument) {
  localStorage.setItem(DOC_PREFIX + doc.meta.id, JSON.stringify(doc))
  const index = readIndex().filter((d) => d.id !== doc.meta.id)
  index.unshift(doc.meta)
  writeIndex(index.slice(0, 40))
}

export function deleteDocument(id: string) {
  localStorage.removeItem(DOC_PREFIX + id)
  writeIndex(readIndex().filter((d) => d.id !== id))
}

export function renameDocument(id: string, name: string) {
  const doc = loadDocument(id)
  if (!doc) return
  doc.meta.name = name
  doc.meta.updatedAt = Date.now()
  saveDocument(doc)
}
