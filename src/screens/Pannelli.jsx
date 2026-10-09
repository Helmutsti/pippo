import { motion } from 'framer-motion'
import { useState } from 'react'
import { FILTRI, FILTRI_VUOTI, TITOLI, rispettaFiltri } from '../data.js'
import { useStore } from '../store.jsx'

// Pannello dal basso: sale sopra la schermata scurita; si chiude toccando il velo o trascinando giù.
function Pannello({ onChiudi, children }) {
  return (
    <>
      <motion.div className="velo-pannello" onClick={onChiudi}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }} />
      <motion.div className="pannello"
        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 380, damping: 38 }}
        drag="y" dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, i) => { if (i.offset.y > 120 || i.velocity.y > 600) onChiudi() }}
      >
        <div className="maniglia" />
        {children}
      </motion.div>
    </>
  )
}

export function Conferma({ onContinua, onInterrompi }) {
  return (
    <Pannello onChiudi={onContinua}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h2 className="t-titolo-pannello">Vuoi interrompere?</h2>
        <p className="t-corpo c-sec">I voti dati finora restano salvati.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button className="pulsante principale t-pulsante" onClick={onContinua}>Continua</button>
        <button className="pulsante secondario t-pulsante" onClick={onInterrompi}>Interrompi</button>
      </div>
    </Pannello>
  )
}

export function Filtri({ onChiudi }) {
  const { filtri, setFiltri } = useStore()
  const [bozza, setBozza] = useState(filtri)
  const quanti = Object.values(TITOLI).filter((t) => rispettaFiltri(t, bozza)).length
  const alterna = (gruppo, v) => setBozza((b) => ({ ...b, [gruppo]: b[gruppo].includes(v) ? b[gruppo].filter((x) => x !== v) : [...b[gruppo], v] }))

  return (
    <Pannello onChiudi={onChiudi}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="t-titolo-pannello">Filtri</h2>
        <button className="t-pulsante c-ter" onClick={() => setBozza(FILTRI_VUOTI)}>Azzera</button>
      </div>
      <Gruppo titolo="Cosa">
        {FILTRI.cosa.map((c) => <Pillola key={c} scelta={bozza.cosa === c} onClick={() => setBozza((b) => ({ ...b, cosa: c }))}>{c}</Pillola>)}
      </Gruppo>
      <Gruppo titolo="Umore e genere">
        {FILTRI.umore.map((u) => <Pillola key={u} scelta={bozza.umore.includes(u)} onClick={() => alterna('umore', u)}>{u}</Pillola>)}
      </Gruppo>
      <Gruppo titolo="Tempo che hai">
        {FILTRI.tempo.map((f) => <Pillola key={f.nome} scelta={bozza.tempo.includes(f.nome)} onClick={() => alterna('tempo', f.nome)}>{f.etichetta}</Pillola>)}
      </Gruppo>
      <Gruppo titolo="Le mie piattaforme">
        {FILTRI.piattaforme.map((p) => <Pillola key={p} scelta={bozza.piattaforme.includes(p)} onClick={() => alterna('piattaforme', p)}>{p}</Pillola>)}
      </Gruppo>
      <button className="pulsante principale t-pulsante" disabled={!quanti} style={{ opacity: quanti ? 1 : 0.5 }}
        onClick={() => { setFiltri(bozza); onChiudi() }}>
        {quanti ? `Mostra ${quanti} ${quanti === 1 ? 'titolo' : 'titoli'}` : 'Nessun titolo'}
      </button>
    </Pannello>
  )
}

function Gruppo({ titolo, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h3 className="t-etichetta c-sec">{titolo}</h3>
      <div className="gruppo-pillole">{children}</div>
    </div>
  )
}

function Pillola({ scelta, onClick, children }) {
  return (
    <motion.button whileTap={{ scale: 0.95 }} className={`pillola t-pillola${scelta ? ' scelta' : ''}`} onClick={onClick} aria-pressed={scelta}>
      {children}
    </motion.button>
  )
}
