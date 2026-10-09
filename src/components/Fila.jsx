import { useEffect, useRef } from 'react'

// Fila che scorre in orizzontale: col dito scorre da sola, col mouse si trascina.
// Un trascinamento non apre la copertina sotto il puntatore e non gira la carta del wizard.
export default function Fila({ children, style }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    let inizio = null
    let partenza = 0
    let trascinata = false

    const giu = (e) => {
      e.stopPropagation() // la carta del wizard non deve girarsi né muoversi
      if (e.pointerType !== 'mouse' || e.button !== 0) return
      inizio = e.clientX
      partenza = el.scrollLeft
      trascinata = false
    }
    const muovi = (e) => {
      if (inizio === null) return
      const dx = e.clientX - inizio
      if (!trascinata && Math.abs(dx) > 4) {
        trascinata = true
        el.setPointerCapture(e.pointerId)
        el.style.scrollSnapType = 'none'
        el.style.cursor = 'grabbing'
      }
      if (trascinata) el.scrollLeft = partenza - dx
    }
    const su = () => {
      if (inizio === null) return
      inizio = null
      el.style.cursor = ''
      el.style.scrollSnapType = ''
    }
    const clic = (e) => {
      if (trascinata) { e.stopPropagation(); e.preventDefault(); trascinata = false }
    }

    el.addEventListener('pointerdown', giu)
    el.addEventListener('pointermove', muovi)
    el.addEventListener('pointerup', su)
    el.addEventListener('pointercancel', su)
    el.addEventListener('click', clic, true)
    return () => {
      el.removeEventListener('pointerdown', giu)
      el.removeEventListener('pointermove', muovi)
      el.removeEventListener('pointerup', su)
      el.removeEventListener('pointercancel', su)
      el.removeEventListener('click', clic, true)
    }
  }, [])

  return <div ref={ref} className="fila" style={style}>{children}</div>
}
