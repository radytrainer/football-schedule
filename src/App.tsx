import { useState } from 'react'
import type { Match, FilterOption } from './types'
import { useSchedules } from './useSchedules'
import { isConfigured } from './firebase'
import ScheduleForm from './components/ScheduleForm'
import ScheduleList from './components/ScheduleList'
import CalendarView from './components/CalendarView'

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'All',              label: 'All' },
  { value: 'Volleyball Boys',  label: '🏐 Volleyball Boys' },
  { value: 'Volleyball Girls', label: '🏐 Volleyball Girls' },
  { value: 'Football Boys',    label: '⚽ Football Boys' },
  { value: 'Football Girls',   label: '⚽ Football Girls' },
]

export default function App() {
  const { matches, ready, syncing, addMatch, updateMatch, deleteMatch } = useSchedules()
  const [mainView, setMainView]         = useState<'list' | 'calendar'>('list')
  const [formOpen, setFormOpen]         = useState(false)
  const [editingMatch, setEditingMatch] = useState<Match | null>(null)
  const [search, setSearch]             = useState('')
  const [filter, setFilter]             = useState<FilterOption>('All')

  const today = new Date().toISOString().split('T')[0]

  const stats = {
    total:      matches.length,
    volleyball: matches.filter(m => m.sport === 'Volleyball').length,
    football:   matches.filter(m => m.sport === 'Football').length,
    today:      matches.filter(m => m.date === today).length,
  }

  const filtered = matches.filter(m => {
    const byFilter = filter === 'All' || `${m.sport} ${m.category}` === filter
    const q = search.toLowerCase().trim()
    const bySearch =
      !q ||
      m.teamA.toLowerCase().includes(q) ||
      m.teamB.toLowerCase().includes(q) ||
      m.sport.toLowerCase().includes(q) ||
      m.date.includes(q) ||
      m.place.toLowerCase().includes(q)
    return byFilter && bySearch
  })

  function openAdd() {
    setEditingMatch(null)
    setFormOpen(true)
  }

  function openEdit(match: Match) {
    setEditingMatch(match)
    setFormOpen(true)
  }

  function handleFormSubmit(data: Omit<Match, 'id'>) {
    if (editingMatch) {
      updateMatch({ ...data, id: editingMatch.id })
    } else {
      addMatch(data)
    }
    setEditingMatch(null)
    setFormOpen(false)
  }

  function handleFormCancel() {
    setEditingMatch(null)
    setFormOpen(false)
  }

  function switchTab(tab: 'list' | 'calendar') {
    setMainView(tab)
    setFormOpen(false)
    setEditingMatch(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">

          {/* Top row */}
          <div className="flex items-center justify-between py-3 gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-lg shadow-sm shrink-0">
                🏆
              </div>
              <div className="min-w-0">
                <h1 className="font-bold text-gray-900 text-base leading-tight truncate">
                  Sports Tournament Schedule
                </h1>
                <p className="text-gray-400 text-xs">School &amp; Event Match Manager</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Live / Syncing / Local badge */}
              {isConfigured ? (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full transition-colors ${
                  syncing
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {syncing ? '⟳ Syncing…' : '● Live'}
                </span>
              ) : (
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 text-gray-400">
                  Local only
                </span>
              )}

              {/* Stats — desktop */}
              {ready && matches.length > 0 && (
                <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500 border-l border-gray-200 pl-3">
                  <span>{stats.total} matches</span>
                  <span>🏐 {stats.volleyball}</span>
                  <span>⚽ {stats.football}</span>
                  {stats.today > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-bold">
                      {stats.today} today
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tab nav + Add */}
          <div className="flex items-center justify-between -mb-px">
            <div className="flex">
              {(['list', 'calendar'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => switchTab(tab)}
                  className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                    !formOpen && mainView === tab
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                  }`}
                >
                  {tab === 'list' ? 'Schedule List' : 'Calendar View'}
                </button>
              ))}
            </div>
            <button
              onClick={openAdd}
              className="my-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
            >
              + Add Schedule
            </button>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">

        {!ready ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500 text-sm">
                {isConfigured ? 'Connecting to live database…' : 'Loading schedules…'}
              </p>
            </div>
          </div>

        ) : formOpen ? (
          <ScheduleForm
            initial={editingMatch}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />

        ) : (
          <>
            {/* Search + Filter */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-5">
              <input
                type="text"
                placeholder="Search by team, sport, venue, or date…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent mb-3"
              />
              <div className="flex flex-wrap gap-2">
                {FILTER_OPTIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setFilter(value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                      filter === value
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Showing{' '}
                <span className="font-bold text-gray-700">{filtered.length}</span>
                {(filter !== 'All' || search) ? ` of ${matches.length}` : ''}{' '}
                match{filtered.length !== 1 ? 'es' : ''}
              </p>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-xl transition-colors"
              >
                Print
              </button>
            </div>

            {mainView === 'list' ? (
              <ScheduleList
                matches={filtered}
                onEdit={openEdit}
                onDelete={deleteMatch}
                onAddNew={openAdd}
              />
            ) : (
              <CalendarView matches={filtered} onAddNew={openAdd} />
            )}
          </>
        )}
      </main>

      <footer className="text-center text-gray-400 text-xs py-5 border-t border-gray-100">
        Sports Tournament Schedule Manager &mdash;{' '}
        {isConfigured ? 'Powered by Firebase Realtime Database' : 'Data saved in your browser'}
      </footer>
    </div>
  )
}
