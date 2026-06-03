import { useState } from 'react'
import type { Match, Sport, Category } from '../types'

interface Props {
  initial: Match | null
  onSubmit: (data: Omit<Match, 'id'>) => void
  onCancel: () => void
}

const SPORTS: Sport[] = ['Volleyball', 'Football']
const CATEGORIES: Category[] = ['Male', 'Female']

const SPORT_ICONS: Record<Sport, string> = { Volleyball: '🏐', Football: '⚽' }
const CATEGORY_ICONS: Record<Category, string> = { Male: '👨', Female: '👩' }

export default function ScheduleForm({ initial, onSubmit, onCancel }: Props) {
  const [sport, setSport]       = useState<Sport>(initial?.sport ?? 'Volleyball')
  const [category, setCategory] = useState<Category>(initial?.category ?? 'Male')
  const [date, setDate]         = useState(initial?.date ?? '')
  const [time, setTime]         = useState(initial?.time ?? '')
  const [teamA, setTeamA]       = useState(initial?.teamA ?? '')
  const [teamB, setTeamB]       = useState(initial?.teamB ?? '')
  const [place, setPlace]       = useState(initial?.place ?? '')
  const [notes, setNotes]       = useState(initial?.notes ?? '')
  const [errors, setErrors]     = useState<Record<string, string>>({})

  function clearError(key: string) {
    setErrors(prev => ({ ...prev, [key]: '' }))
  }

  function validate(): Record<string, string> {
    const e: Record<string, string> = {}
    if (!date)             e.date  = 'Date is required'
    if (!time)             e.time  = 'Time is required'
    if (!teamA.trim())     e.teamA = 'Team A name is required'
    if (!teamB.trim())     e.teamB = 'Team B name is required'
    if (!place.trim())     e.place = 'Venue is required'
    if (teamA.trim().toLowerCase() === teamB.trim().toLowerCase() && teamA.trim())
      e.teamB = 'Team B must differ from Team A'
    return e
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSubmit({
      sport, category, date, time,
      teamA: teamA.trim(), teamB: teamB.trim(),
      place: place.trim(), notes: notes.trim(),
    })
  }

  const isEdit = initial !== null

  return (
    <div className="max-w-2xl mx-auto">

      {/* Back breadcrumb */}
      <button
        onClick={onCancel}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-4 transition-colors"
      >
        ← Back to schedule
      </button>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* Form header */}
        <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            {isEdit ? 'Edit Match Schedule' : 'Add New Match Schedule'}
          </h2>
          <p className="text-gray-400 text-sm mt-0.5">Fill in the match details below</p>
        </div>

        <form onSubmit={handleSubmit} className="px-5 sm:px-6 py-5 space-y-4 sm:space-y-5">

          {/* Sport + Category */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Sport Type
              </label>
              <div className="flex gap-2">
                {SPORTS.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSport(s)}
                    className={`flex-1 py-2.5 px-1 rounded-xl border-2 text-sm font-bold transition-all text-center ${
                      sport === s
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-500'
                    }`}
                  >
                    <div>{SPORT_ICONS[s]}</div>
                    <div className="text-xs mt-0.5">{s}</div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                Category
              </label>
              <div className="flex gap-2">
                {CATEGORIES.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`flex-1 py-2.5 px-1 rounded-xl border-2 text-sm font-bold transition-all text-center ${
                      category === c
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-500'
                    }`}
                  >
                    <div>{CATEGORY_ICONS[c]}</div>
                    <div className="text-xs mt-0.5">{c}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Date + Time — stack on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={e => { setDate(e.target.value); clearError('date') }}
                className={`w-full border rounded-xl px-3 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors ${
                  errors.date ? 'border-rose-400 bg-rose-50' : 'border-gray-200'
                }`}
              />
              {errors.date && <p className="text-rose-500 text-xs mt-1">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Time <span className="text-rose-400">*</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={e => { setTime(e.target.value); clearError('time') }}
                className={`w-full border rounded-xl px-3 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors ${
                  errors.time ? 'border-rose-400 bg-rose-50' : 'border-gray-200'
                }`}
              />
              {errors.time && <p className="text-rose-500 text-xs mt-1">{errors.time}</p>}
            </div>
          </div>

          {/* Team A + Team B — stack on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Team A <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Grade 12A"
                value={teamA}
                onChange={e => { setTeamA(e.target.value); clearError('teamA') }}
                className={`w-full border rounded-xl px-3 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors ${
                  errors.teamA ? 'border-rose-400 bg-rose-50' : 'border-gray-200'
                }`}
              />
              {errors.teamA && <p className="text-rose-500 text-xs mt-1">{errors.teamA}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                Team B <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Grade 12B"
                value={teamB}
                onChange={e => { setTeamB(e.target.value); clearError('teamB') }}
                className={`w-full border rounded-xl px-3 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors ${
                  errors.teamB ? 'border-rose-400 bg-rose-50' : 'border-gray-200'
                }`}
              />
              {errors.teamB && <p className="text-rose-500 text-xs mt-1">{errors.teamB}</p>}
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Venue / Place <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. School Court"
              value={place}
              onChange={e => { setPlace(e.target.value); clearError('place') }}
              className={`w-full border rounded-xl px-3 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-colors ${
                errors.place ? 'border-rose-400 bg-rose-50' : 'border-gray-200'
              }`}
            />
            {errors.place && <p className="text-rose-500 text-xs mt-1">{errors.place}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
              Notes <span className="text-gray-400 font-normal normal-case">(optional)</span>
            </label>
            <textarea
              placeholder="Any additional notes…"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none transition-colors"
            />
          </div>

          {/* Live preview */}
          {(teamA || teamB) && (
            <div className="rounded-xl bg-indigo-50 border border-indigo-100 px-4 py-3">
              <p className="text-xs font-bold text-indigo-400 uppercase tracking-wide mb-1.5">Preview</p>
              <p className="text-sm font-bold text-gray-700 mb-0.5">
                {SPORT_ICONS[sport]} {sport} — {category}
              </p>
              <p className="text-base font-bold text-gray-900">
                {teamA || '—'} <span className="font-normal text-gray-400 text-sm">vs</span> {teamB || '—'}
              </p>
              {(date || place) && (
                <p className="text-xs text-gray-500 mt-1">
                  {date} {time && `· ${time}`} {place && `· ${place}`}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
            >
              {isEdit ? 'Save Changes' : 'Save Schedule'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}
