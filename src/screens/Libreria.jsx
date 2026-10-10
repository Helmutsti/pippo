import { AnimatePresence, motion } from 'framer-motion'
import { Bookmark, Heart, LayoutGrid, List, ThumbsDown } from 'lucide-react'
import { useState } from 'react'
import { TITOLI } from '../data.js'
import { useStore } from '../store.jsx'
import Griglia from '../components/Griglia.jsx'
import { BarraNavigazione } from '../components/Barra.jsx'

const FILTRI = ['Tutti', 'Piaciuti', 'Non piaciuti', 'Da vedere']

// lettera della rubrica: senza accenti, i numeri e i simboli sotto "#"
const lettera = (titolo) => {
  const l = titolo.normalize('NFD').replace(/[̀-ͯ]/g, '')[0].toUpperCase()
  return /[A-Z]/.test(l) ? l : '#'
}

// Libreria: i titoli con un segno (votati o da vedere), divisi per lettera come una rubrica.
// In alto a destra si sceglie griglia o elenco; una sola fila di pillole filtra.
// I titoli "Non mi interessa" non sono qui: avranno una pagina loro nel Profilo.
// In "Da vedere" ogni riga ha "Visto?": si apre lì la scelta pollice in giù / cuore, per segnare in fretta cosa hai visto.
export default function Libreria({ onApri, onHome, onWizard, onCerca }) {
  const { voti, daVedere, nonInteressa } = useStore()
  const [vista, setVista] = useState('elenco') // 'elenco' | 'griglia'
  const [filtro, setFiltro] = useState('Tutti')
  const [aperto, setAperto] = useState(null) // riga con la scelta di "Visto?" aperta

  const passa = (id) => {
    if (!TITOLI[id] || nonInteressa[id]) return false
    if (filtro === 'Piaciuti') return voti[id] === 'like'
    if (filtro === 'Non piaciuti') return voti[id] === 'dislike'
    if (filtro === 'Da vedere') return !!daVedere[id]
    return !!(voti[id] || daVedere[id])
  }
  const ids = [...new Set([...Object.keys(voti), ...Object.keys(daVedere)])]
    .filter(passa)
    .sort((a, b) => TITOLI[a].titolo.localeCompare(TITOLI[b].titolo, 'it'))
  const sezioni = []
  for (const id of ids) {
    const l = lettera(TITOLI[id].titolo)
    if (sezioni.at(-1)?.[0] !== l) sezioni.push([l, []])
    sezioni.at(-1)[1].push(id)
  }

  return (
    <div className="schermata">
      <div className="scorre">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spazio-gruppo)', padding: 'var(--area-sicura-alto) 0 var(--contenuto-spazio-sotto-barra)' }}>
          <div className="testa-libreria">
            <h1 className="t-titolo-pagina">Libreria</h1>
            <div className="griglia-o-elenco vetro" role="radiogroup" aria-label="Vista">
              <button role="radio" aria-checked={vista === 'griglia'} aria-label="Griglia" className={vista === 'griglia' ? 'scelto' : ''} onClick={() => setVista('griglia')}><LayoutGrid size={20} /></button>
              <button role="radio" aria-checked={vista === 'elenco'} aria-label="Elenco" className={vista === 'elenco' ? 'scelto' : ''} onClick={() => setVista('elenco')}><List size={20} /></button>
            </div>
          </div>
          <div className="fila" style={{ gap: 8, cursor: 'default' }}>
            {FILTRI.map((f) => (
              <button key={f} className={`pillola t-pillola${filtro === f ? ' scelta' : ''}`} aria-pressed={filtro === f} onClick={() => { setFiltro(f); setAperto(null) }}>{f}</button>
            ))}
          </div>
          {sezioni.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spazio-blocco)' }}>
              {sezioni.map(([l, lista]) => (
                <section key={l} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <h2 className="t-titolo-sezione" style={{ padding: '0 var(--spazio-pagina)' }}>{l}</h2>
                  {vista === 'griglia' ? (
                    <Griglia ids={lista} onApri={onApri} senzaSegnalibro={filtro === 'Da vedere'} />
                  ) : (
                    <div style={{ padding: '0 var(--spazio-pagina)' }}>
                      {lista.map((id) => (
                        <Riga key={id} id={id} onApri={onApri} censimento={filtro === 'Da vedere'}
                          aperto={aperto === id} onApriScelta={() => setAperto(aperto === id ? null : id)} onChiudiScelta={() => setAperto(null)} />
                      ))}
                    </div>
                  )}
                </section>
              ))}
            </div>
          ) : (
            <p className="t-corpo c-sec" style={{ padding: '24px var(--spazio-pagina)', textAlign: 'center' }}>
              {filtro === 'Da vedere' ? 'Nessun titolo da vedere: usa il segnalibro per aggiungerne.' : 'Non hai ancora votato nessun titolo qui.'}
            </p>
          )}
        </div>
      </div>
      <BarraNavigazione attiva="libreria" onHome={onHome} onCerca={onCerca} onCarte={onWizard} />
    </div>
  )
}

const SEGNI = {
  'da-vedere': [Bookmark, 'var(--voto-da-vedere)'],
  like: [Heart, 'var(--voto-like)'],
  dislike: [ThumbsDown, 'var(--voto-dislike)'],
}

function Riga({ id, onApri, censimento, aperto, onApriScelta, onChiudiScelta }) {
  const { voti, daVedere, vota } = useStore()
  const t = TITOLI[id]
  // in "Da vedere" il segnalibro c'è su tutte le righe: si mostra solo il voto
  const segni = [!censimento && daVedere[id] && 'da-vedere', voti[id]].filter(Boolean)
  const scegli = (voto) => { vota(id, voto); onChiudiScelta() }

  return (
    <div className="riga-libreria" role="button" tabIndex={0} onClick={() => onApri(id)}>
      <div className="risultato-copertina"><img src={t.poster} alt="" loading="lazy" /></div>
      <div className="risultato-testi">
        <span className="t-pulsante">{t.titolo}</span>
        <span className="t-didascalia c-sec">{t.anno} · {t.tipo}</span>
      </div>
      {censimento && !voti[id] ? (
        <AnimatePresence mode="wait" initial={false}>
          {aperto ? (
            <motion.div key="scelta" className="scelta-visto vetro" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}>
              <motion.button whileTap={{ scale: 0.85 }} aria-label="Visto, non mi è piaciuto" onClick={() => scegli('dislike')}><ThumbsDown size={20} /></motion.button>
              <motion.button whileTap={{ scale: 0.85 }} aria-label="Visto, mi è piaciuto" onClick={() => scegli('like')}><Heart size={20} /></motion.button>
            </motion.div>
          ) : (
            <motion.button key="visto" className="pillola t-pillola" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
              onClick={(e) => { e.stopPropagation(); onApriScelta() }}>Visto?</motion.button>
          )}
        </AnimatePresence>
      ) : (
        <div className="segni-riga">
          {segni.map((s) => { const [Segno, colore] = SEGNI[s]; return <Segno key={s} size={16} color={colore} fill={colore} /> })}
        </div>
      )}
    </div>
  )
}
