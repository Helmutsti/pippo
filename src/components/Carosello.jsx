import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import { useRef, useState } from 'react'
import { TITOLI, durata } from '../data.js'
import { useSchermo } from '../schermo.js'
import { useStore } from '../store.jsx'

// Carosello dei suggerimenti: copertina grande al centro, precedente e successiva ai lati.
// Gira all'infinito: dopo l'ultimo suggerimento torna il primo, e al contrario.
// Tutto segue un solo valore continuo (la posizione), così le copertine non saltano mai.
// Misure al massimo (copertina 260 × 390): su schermi bassi tutto si riduce in proporzione, vedi altezzaCopertina
const COPERTINA_MAX = 390
const PASSO_MAX = 246.5 // distanza tra il centro della copertina e il centro della vicina
const SCALA_VICINA = 200 / 260
const VICINE = 3 // copertine disegnate per lato; oltre la vicina sfumano fino a sparire
const MOLLA = { type: 'spring', stiffness: 260, damping: 32, restDelta: 0.001 }

const giro = (k, n) => ((k % n) + n) % n

export default function Carosello({ ids, onApri, altezzaCopertina = COPERTINA_MAX }) {
  const hC = Math.min(COPERTINA_MAX, altezzaCopertina)
  const scala = hC / COPERTINA_MAX
  const ALTEZZA = hC + 40
  const PASSO = PASSO_MAX * scala
  const n = ids.length
  const posizione = useMotionValue(0) // 0 = primo suggerimento al centro, 1 = il secondo, ecc.
  const [centro, setCentro] = useState(0)
  const partenza = useRef(0)
  const trascinato = useRef(false) // per non aprire la scheda alla fine di un trascinamento
  const centroX = useSchermo().larghezza / 2
  const { daVedere, alterna } = useStore()

  useMotionValueEvent(posizione, 'change', (v) => setCentro(Math.round(v)))

  const indice = giro(centro, n)
  const attuale = TITOLI[ids[indice]]
  const vai = (k) => animate(posizione, k, MOLLA)

  const slot = []
  if (n > 1) for (let k = centro - VICINE; k <= centro + VICINE; k++) slot.push(k)
  else slot.push(0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <motion.div
        style={{ position: 'relative', width: '100%', height: ALTEZZA, overflow: 'hidden', touchAction: 'pan-y', cursor: n > 1 ? 'grab' : 'default' }}
        onPointerDown={() => { trascinato.current = false; posizione.stop(); partenza.current = posizione.get() }}
        onPan={(_, info) => { trascinato.current = true; if (n > 1) posizione.set(partenza.current - info.offset.x / PASSO) }}
        onPanEnd={(_, info) => {
          if (n < 2) return
          const da = Math.round(partenza.current)
          const spinta = posizione.get() - da
          let verso = 0
          if (Math.abs(spinta) > 0.25) verso = Math.sign(spinta)
          else if (Math.abs(info.velocity.x) > 400) verso = -Math.sign(info.velocity.x)
          vai(da + verso)
        }}
      >
        {/* Prolungamento: la copertina sfocata, coperta dal velo scuro */}
        <AnimatePresence initial={false}>
          <motion.img
            key={attuale.id}
            src={attuale.poster}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ position: 'absolute', inset: -60, width: 'calc(100% + 120px)', height: ALTEZZA + 120, objectFit: 'cover', filter: 'blur(40px)' }}
          />
        </AnimatePresence>
        <div style={{ position: 'absolute', inset: 0, background: 'var(--velo-scuro)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(#000 0%, #0000 25%, #0000 70%, #000 100%)' }} />

        {slot.map((k) => {
          const id = ids[giro(k, n)]
          return (
            <Copertina key={k} t={TITOLI[id]} k={k} posizione={posizione} centroX={centroX} passo={PASSO} altezza={hC}
              onTap={() => { if (!trascinato.current) onApri(id) }} />
          )
        })}
      </motion.div>

      {/* Titolo al centro della pagina; a destra il segnalibro mette o toglie il titolo da "Da vedere" senza aprire la Scheda */}
      <div style={{ display: 'grid', gridTemplateColumns: '44px 1fr 44px', alignItems: 'center', gap: 8, width: '100%', padding: '0 var(--spazio-pagina)' }}>
        <span />
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={attuale.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center', minWidth: 0 }}
          >
            <h2 className="t-titolo-pannello">{attuale.titolo}</h2>
            <p className="t-didascalia c-sec">{attuale.generi.join(' · ')} · {durata(attuale)}</p>
          </motion.div>
        </AnimatePresence>
        <motion.button
          whileTap={{ scale: 0.85 }}
          className="vetro"
          style={{ width: 44, height: 44, borderRadius: 999, display: 'grid', placeItems: 'center' }}
          aria-label="Da vedere"
          aria-pressed={!!daVedere[attuale.id]}
          onClick={() => alterna(attuale.id, 'da-vedere')}
        >
          <Bookmark size={20} strokeWidth={2} {...(daVedere[attuale.id] ? { color: 'var(--voto-da-vedere)', fill: 'var(--voto-da-vedere)' } : {})} />
        </motion.button>
      </div>

      <div style={{ display: 'flex', gap: 8 }} aria-label={`Suggerimento ${indice + 1} di ${n}`}>
        {ids.map((id, i) => {
          // va al suggerimento i per la strada più corta
          let d = i - indice
          if (d > n / 2) d -= n
          if (d < -n / 2) d += n
          return (
            <motion.button
              key={id}
              onClick={() => vai(centro + d)}
              animate={{ width: i === indice ? 20 : 6, backgroundColor: i === indice ? '#ffffff' : '#ffffffbf' }}
              style={{ height: 6, borderRadius: 3, padding: 0 }}
              aria-label={`Vai al suggerimento ${i + 1}`}
            />
          )
        })}
      </div>
    </div>
  )
}

function Copertina({ t, k, posizione, centroX, passo, altezza, onTap }) {
  const larghezza = altezza / 1.5
  const rel = useTransform(posizione, (p) => k - p)
  const x = useTransform(rel, (r) => centroX + r * passo - larghezza / 2)
  const scale = useTransform(rel, (r) => 1 - (1 - SCALA_VICINA) * Math.min(1, Math.abs(r)))
  // al centro piena, ai lati 0.45, oltre la vicina sfuma fino a sparire
  const opacity = useTransform(rel, (r) => {
    const a = Math.abs(r)
    return a <= 1 ? 1 - 0.55 * a : Math.max(0, 0.45 * (2 - a))
  })
  const zIndex = useTransform(rel, (r) => 100 - Math.round(Math.abs(r) * 10))
  const ombra = useTransform(rel, (r) => `0 16px 40px rgba(0,0,0,${0.6 * (1 - Math.min(1, Math.abs(r)))})`)

  return (
    <motion.img
      src={t.poster}
      alt={t.titolo}
      draggable={false}
      onTap={onTap}
      style={{
        position: 'absolute', top: 20, left: 0, width: larghezza, height: altezza, objectFit: 'cover',
        borderRadius: 'var(--raggio-copertina)', x, scale, opacity, zIndex, boxShadow: ombra, willChange: 'transform, opacity',
      }}
    />
  )
}
