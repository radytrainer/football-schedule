import { useState, useEffect } from 'react'
import { ref as dbRef, onValue, set as dbSet } from 'firebase/database'
import type { Match } from './types'
import { db, isConfigured } from './firebase'

const STORAGE_KEY = 'sport_schedules'
const DB_PATH = 'schedules'

export function useSchedules() {
  const [matches, setMatches] = useState<Match[]>([])
  const [ready, setReady] = useState(false)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    // ── Firebase mode: real-time listener ────────────────────────────────────
    if (isConfigured && db) {
      const schedulesRef = dbRef(db, DB_PATH)
      const unsubscribe = onValue(
        schedulesRef,
        snapshot => {
          const val = snapshot.val() as Record<string, Match> | null
          const loaded = val
            ? (Object.values(val) as Match[]).sort((a, b) => a.id - b.id)
            : []
          setMatches(loaded)
          localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded))
          setReady(true)
        },
        () => loadLocal(),   // Firebase error → fall back to local data
      )
      return unsubscribe
    }

    // ── Offline mode: localStorage → public/data.json ─────────────────────
    function loadLocal() {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        try {
          setMatches(JSON.parse(stored) as Match[])
          setReady(true)
          return
        } catch { /* corrupt data, fall through */ }
      }
      fetch('/data.json')
        .then(async r => {
          if (!r.ok) return
          const data = (await r.json()) as unknown
          if (Array.isArray(data) && data.length > 0) {
            const loaded = data as Match[]
            setMatches(loaded)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(loaded))
          }
        })
        .catch(() => {})
        .finally(() => setReady(true))
    }

    loadLocal()
  }, [])

  // Persist to localStorage always; also write to Firebase when configured.
  async function persist(data: Match[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    if (!isConfigured || !db) return

    setSyncing(true)
    try {
      const schedulesRef = dbRef(db, DB_PATH)
      if (data.length === 0) {
        await dbSet(schedulesRef, null)
      } else {
        const obj = data.reduce<Record<string, Match>>((acc, m) => {
          acc[String(m.id)] = m
          return acc
        }, {})
        await dbSet(schedulesRef, obj)
      }
    } catch (err) {
      console.error('Firebase sync failed:', err)
    } finally {
      setSyncing(false)
    }
  }

  function addMatch(match: Omit<Match, 'id'>) {
    const created = { ...match, id: Date.now() }
    const updated = [...matches, created]
    setMatches(updated)
    persist(updated)
  }

  function updateMatch(updated: Match) {
    const next = matches.map(m => m.id === updated.id ? updated : m)
    setMatches(next)
    persist(next)
  }

  function deleteMatch(id: number) {
    const next = matches.filter(m => m.id !== id)
    setMatches(next)
    persist(next)
  }

  return { matches, ready, syncing, addMatch, updateMatch, deleteMatch }
}
