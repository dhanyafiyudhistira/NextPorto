export interface RecordMeta {
  id: string
  name: string
  size: number
  duration: number
  createdAt: number
  mimeType: string
  thumbnail?: string
  blob?: Blob
}

const DB_NAME = 'recorder-db'
const STORE = 'records-v1'

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)
    request.onupgradeneeded = () => {
      const db = request.result
      db.createObjectStore(STORE, { keyPath: 'id' })
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function save(meta: RecordMeta) {
  const db = await open()
  const tx = db.transaction(STORE, 'readwrite')
  tx.objectStore(STORE).put(meta)
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function getAll(): Promise<RecordMeta[]> {
  const db = await open()
  const tx = db.transaction(STORE, 'readonly')
  const store = tx.objectStore(STORE)
  return new Promise((resolve, reject) => {
    const request = store.getAll()
    request.onsuccess = () => resolve(request.result as RecordMeta[])
    request.onerror = () => reject(request.error)
  })
}

export async function remove(id: string) {
  const db = await open()
  const tx = db.transaction(STORE, 'readwrite')
  tx.objectStore(STORE).delete(id)
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function rename(id: string, name: string) {
  const db = await open()
  const tx = db.transaction(STORE, 'readwrite')
  const store = tx.objectStore(STORE)
  const itemReq = store.get(id)
  itemReq.onsuccess = () => {
    const item = itemReq.result as RecordMeta
    item.name = name
    store.put(item)
  }
}
