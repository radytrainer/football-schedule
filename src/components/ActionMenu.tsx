import { useState, useEffect, useRef } from 'react'

interface Props {
  onEdit: () => void
  onDelete: () => void
  showDelete: boolean
}

export default function ActionMenu({ onEdit, onDelete, showDelete }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onOutsideClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [open])

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(prev => !prev) }}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors text-xl leading-none"
        aria-label="More actions"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-xl border border-gray-200 shadow-xl z-30 overflow-hidden py-1">
          <button
            onClick={() => { onEdit(); setOpen(false) }}
            className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Edit
          </button>
          {showDelete && (
            <>
              <div className="h-px bg-gray-100 mx-3" />
              <button
                onClick={() => { onDelete(); setOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
