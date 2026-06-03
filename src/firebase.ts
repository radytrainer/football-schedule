import { initializeApp } from 'firebase/app'
import { getDatabase, type Database } from 'firebase/database'

// Firebase is active only when env vars are provided.
// Set VITE_FIREBASE_API_KEY + VITE_FIREBASE_DATABASE_URL to enable live sharing.
export const isConfigured: boolean = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_DATABASE_URL
)

let _db: Database | null = null

if (isConfigured) {
  const app = initializeApp({
    apiKey:      import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:  import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
    projectId:   import.meta.env.VITE_FIREBASE_PROJECT_ID,
    appId:       import.meta.env.VITE_FIREBASE_APP_ID,
  })
  _db = getDatabase(app)
}

export const db = _db
