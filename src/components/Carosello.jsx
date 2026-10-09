import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { TITOLI, durata } from '../data.js'

// Carosello dei suggerimenti: copertina grande al centro, precedente e successiva ai lati.
const ALTEZZA = 430
const CENTRO_X = 393 / 2
const PASSO = 246.5 // distanza tra il centro della copertina e il centro della vicina
const SCALA_VICINA = 200 / 260

export default function Carosello({ ids, onApri }) {
  const [indice, setIndice] = useState(0)
  const spostamento = useMotionValue(0) // in "posizioni": -1 = una copertina a sinistra
  const attuale = TITOLI[ids[indice]]
  const trascinato = useRef(false) // per non aprire la scheda alla fine di un trascinamento

  const vai = (nuovo) => {
    const n = Math.max(0, Math.min(ids.length - 1, nuovo))
    // tiene ferma la posizione visiva mentre cambia l'indice, poi anima fino a zero
    spostamento.set(spostamento.get() + (n - indice))
    setIndice(n)
    animate(spostamento, 0, { type: 'spring', stiffness: 300, damping: 32 })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
      <motion.div
        style={{ position: 'relative', width: '100%', height: ALTEZZA, overflow: 'hidden', touchAction: 'pan-y', cursor: 'grab' }}
        onPointerDown={() => { trascinato.current = false }}
        onPanStart={() => { trascinato.current = true }}
        onPan={(_, info) => spostamento.set(-info.offset.x / PASSO)}
        onPanEnd={(_, info) => {
          const s = spostamento.get()
          const verso = Math.abs(s) > 0.25 || Math.abs(info.velocity.x) > 400 ? Math.sign(s || -info.velocity.x) : 0
          if (verso && ids[indice + verso]) vai(indice + verso)
          else animate(spostamento, 0, { type: 'spring', stiffness: 300, damping: 32 })
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

        {ids.map((id, i) => (
          <Copertina key={id} t={TITOLI[id]} posizione={i - indice} spostamento={spostamento}
            onTap={() => { if (trascinato.current) return; if (i === indice) onApri(id); else vai(i) }} />
        ))}
      </motion.div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={attuale.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.18 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '0 20px', textAlign: 'center' }}
        >
          <h2 className="t-titolo-pannello">{attuale.titolo}</h2>
          <p className="t-didascalia c-sec">{attuale.generi.join(' · ')} · {durata(attuale)}</p>
        </motion.div>
      </AnimatePresence>

      <div style={{ display: 'flex', gap: 8 }} aria-label={`Suggerimento ${indice + 1} di ${ids.length}`}>
        {ids.map((id, i) => (
          <motion.button
            key={id}
            onClick={() => vai(i)}
            animate={{ width: i === indice ? 20 : 6, backgroundColor: i === indice ? '#ffffff' : '#ffffffbf' }}
            style={{ height: 6, borderRadius: 3, padding: 0 }}
            aria-label={`Vai al suggerimento ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

function Copertina({ t, posizione, spostamento, onTap }) {
  const rel = useTransform(spostamento, (s) => posizione - s)
  const x = useTransform(rel, (r) => CENTRO_X + r * PASSO - 130)
  const scale = useTransform(rel, (r) => 1 - (1 - SCALA_VICINA) * Math.min(1, Math.abs(r)))
  const opacity = useTransform(rel, (r) => 1 - 0.55 * Math.min(1, Math.abs(r)))
  const zIndex = useTransform(rel, (r) => 10 - Math.round(Math.abs(r)))
  const ombra = useTransform(rel, (r) => `0 16px 40px rgba(0,0,0,${0.6 * (1 - Math.min(1, Math.abs(r)))})`)

  if (Math.abs(posizione) > 2) return null
  return (
    <motion.img
      src={t.poster}
      alt={t.titolo}
      onTap={onTap}
      style={{
        position: 'absolute', top: 20, left: 0, width: 260, height: 390, objectFit: 'cover',
        borderRadius: 'var(--raggio-copertina)', x, scale, opacity, zIndex, boxShadow: ombra,
      }}
    />
  )
}
