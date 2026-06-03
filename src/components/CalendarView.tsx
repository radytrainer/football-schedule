import type { Match } from '../types'

interface Props {
  matches: Match[]
  onAddNew: () => void
  adminMode: boolean
}

const SPORT_ICONS: Record<string, string> = {
  Volleyball: '🏐',
  Football:   '⚽',
}

const SPORT_BORDER: Record<string, string> = {
  Volleyball: 'border-l-blue-400',
  Football:   'border-l-emerald-400',
}

const CATEGORY_PILL: Record<string, string> = {
  Male:   'bg-sky-50 text-sky-700',
  Female: 'bg-pink-50 text-pink-700',
}

function formatTime(time: string) {
  if (!time) return ''
  const [h, m] = time.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
}

function formatDayHeader(dateStr: string) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })
}

export default function CalendarView({ matches, onAddNew, adminMode }: Props) {
  if (matches.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-20 text-center">
        <div className="text-5xl mb-4">📅</div>
        <p className="text-gray-700 font-bold text-lg">No schedules to display</p>
        <p className="text-gray-400 text-sm mt-1 mb-5">Try a different filter or search</p>
        {adminMode && (
          <button
            onClick={onAddNew}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
          >
            + Add Your First Match
          </button>
        )}
      </div>
    )
  }

  const today = new Date().toISOString().split('T')[0]

  const grouped = matches.reduce<Record<string, Match[]>>((acc, m) => {
    ;(acc[m.date] ??= []).push(m)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort()

  return (
    <div className="space-y-5">
      {sortedDates.map(date => {
        const dayMatches = [...grouped[date]].sort((a, b) => a.time.localeCompare(b.time))
        const isToday = date === today

        return (
          <div key={date} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Day header */}
            <div className={`px-5 py-3 flex items-center gap-3 ${isToday ? 'bg-indigo-600' : 'bg-gray-700'}`}>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">{formatDayHeader(date)}</p>
              </div>
              {isToday && (
                <span className="shrink-0 text-xs bg-amber-400 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                  TODAY
                </span>
              )}
              <span className="shrink-0 text-xs bg-white/20 text-white font-bold px-2.5 py-0.5 rounded-full">
                {dayMatches.length} match{dayMatches.length !== 1 ? 'es' : ''}
              </span>
            </div>

            {/* Match rows */}
            <div className="divide-y divide-gray-100">
              {dayMatches.map(m => (
                <div
                  key={m.id}
                  className={`flex gap-4 px-4 sm:px-5 py-4 border-l-4 hover:bg-gray-50 transition-colors ${SPORT_BORDER[m.sport]}`}
                >
                  {/* Time */}
                  <div className="w-16 sm:w-20 shrink-0 text-right pt-0.5">
                    <p className="text-sm font-bold text-gray-700">{formatTime(m.time)}</p>
                  </div>

                  <div className="w-px bg-gray-200 shrink-0" />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="text-sm font-bold text-gray-600">
                        {SPORT_ICONS[m.sport]} {m.sport}
                      </span>
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${CATEGORY_PILL[m.category]}`}>
                        {m.category}
                      </span>
                      {m.pool && (
                        <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">
                          {m.pool}
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-gray-900 text-base leading-tight">
                      {m.teamA}
                      <span className="font-normal text-gray-400 text-sm mx-2">vs</span>
                      {m.teamB}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        📍 {m.place}
                      </span>
                      {m.notes && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-gray-100 text-gray-500 italic">
                          💬 {m.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
