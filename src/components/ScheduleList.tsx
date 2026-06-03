import type { Match } from '../types'
import ActionMenu from './ActionMenu'

interface Props {
  matches: Match[]
  onEdit: (match: Match) => void
  onDelete: (id: number) => void
  onAddNew: () => void
}

const SPORT_ICONS: Record<string, string> = {
  Volleyball: '🏐',
  Football: '⚽',
}

const SPORT_PILL: Record<string, string> = {
  Volleyball: 'bg-blue-50 text-blue-700 border border-blue-100',
  Football:   'bg-emerald-50 text-emerald-700 border border-emerald-100',
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

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export default function ScheduleList({ matches, onEdit, onDelete, onAddNew }: Props) {
  function handleDelete(m: Match) {
    if (window.confirm(`Delete "${m.teamA} vs ${m.teamB}" on ${formatDate(m.date)}?`)) {
      onDelete(m.id)
    }
  }

  const sorted = [...matches].sort((a, b) => {
    const d = a.date.localeCompare(b.date)
    return d !== 0 ? d : a.time.localeCompare(b.time)
  })

  if (sorted.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-20 text-center">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-gray-700 font-bold text-lg">No schedules found</p>
        <p className="text-gray-400 text-sm mt-1 mb-5">Add a match or try a different filter</p>
        <button
          onClick={onAddNew}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
        >
          + Add Your First Match
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['#', 'Date', 'Time', 'Sport', 'Category', 'Team A', 'Team B', 'Venue', ''].map((h, i) => (
                  <th
                    key={i}
                    className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide text-left"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((m, idx) => (
                <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3.5 text-gray-400 text-xs">{idx + 1}</td>
                  <td className="px-4 py-3.5 font-bold text-gray-800 whitespace-nowrap">{formatDate(m.date)}</td>
                  <td className="px-4 py-3.5 text-gray-600 whitespace-nowrap">{formatTime(m.time)}</td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${SPORT_PILL[m.sport]}`}>
                      {SPORT_ICONS[m.sport]} {m.sport}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${CATEGORY_PILL[m.category]}`}>
                      {m.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-gray-800">{m.teamA}</td>
                  <td className="px-4 py-3.5 font-bold text-gray-800">{m.teamB}</td>
                  <td className="px-4 py-3.5 text-gray-500 max-w-[140px] truncate">{m.place}</td>
                  <td className="px-4 py-3.5">
                    <ActionMenu onEdit={() => onEdit(m)} onDelete={() => handleDelete(m)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {sorted.map(m => (
          <div key={m.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold ${SPORT_PILL[m.sport]}`}>
                  {SPORT_ICONS[m.sport]} {m.sport}
                </span>
                <span className={`px-2 py-0.5 rounded-lg text-xs font-bold ${CATEGORY_PILL[m.category]}`}>
                  {m.category}
                </span>
              </div>
              <ActionMenu onEdit={() => onEdit(m)} onDelete={() => handleDelete(m)} />
            </div>
            <p className="font-bold text-gray-900 text-base">
              {m.teamA} <span className="font-normal text-gray-400 text-sm">vs</span> {m.teamB}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1.5 text-sm text-gray-500">
              <span>{formatDate(m.date)}</span>
              <span>{formatTime(m.time)}</span>
              <span>📍 {m.place}</span>
            </div>
            {m.notes && (
              <p className="mt-2 text-xs text-gray-400 italic border-t border-gray-100 pt-2">{m.notes}</p>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
