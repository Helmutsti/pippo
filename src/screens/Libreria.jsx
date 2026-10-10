import { useState } from 'react'
import { TITOLI } from '../data.js'
import { useStore } from '../store.jsx'
import Griglia from '../components/Griglia.jsx'
import { BarraNavigazione } from '../components/Barra.jsx'

// Libreria: i titoli che hai votato (Visti) e quelli da vedere, nella griglia di copertine
export default function Libreria({ onApri, onHome, onWizard }) {
  const { voti, daVedere } = useStore()
  const [scheda, setScheda] = useState('visti')
  const [filtro, setFiltro] = useState('Tutti')
  const visti = Object.keys(voti).filter((id) => TITOLI[id])
  const daVed = Object.keys(daVedere).filter((id) => TITOLI[id]).reverse() // dal più recente
  const piace = { Piaciuti: 'like', 'Non piaciuti': 'dislike' }
  const ids = scheda === 'visti' ? visti.filter((id) => filtro === 'Tutti' || voti[id] === piace[filtro]) : daVed

  return (
    <div className="schermata">
      <div className="scorre">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spazio-gruppo)', padding: 'var(--area-sicura-alto) 0 var(--contenuto-spazio-sotto-barra)' }}>
          <h1 className="t-titolo-pagina" style={{ padding: '0 var(--spazio-pagina)' }}>Libreria</h1>
          <div style={{ padding: '0 var(--spazio-pagina)' }}>
            <div className="schede vetro" role="tablist">
              <button role="tab" aria-selected={scheda === 'visti'} className={`scheda t-pulsante${scheda === 'visti' ? ' scelta' : ''}`} onClick={() => setScheda('visti')}>Visti · {visti.length}</button>
              <button role="tab" aria-selected={scheda === 'da-vedere'} className={`scheda t-pulsante${scheda === 'da-vedere' ? ' scelta' : ''}`} onClick={() => setScheda('da-vedere')}>Da vedere · {daVed.length}</button>
            </div>
          </div>
          {scheda === 'visti' && (
            <div className="gruppo-pillole" style={{ padding: '0 var(--spazio-pagina)' }}>
              {['Tutti', 'Piaciuti', 'Non piaciuti'].map((f) => (
                <button key={f} className={`pillola t-pillola${filtro === f ? ' scelta' : ''}`} onClick={() => setFiltro(f)}>{f}</button>
              ))}
            </div>
          )}
          {ids.length ? (
            <Griglia ids={ids} onApri={onApri} senzaSegnalibro={scheda === 'da-vedere'} />
          ) : (
            <p className="t-corpo c-sec" style={{ padding: '24px var(--spazio-pagina)', textAlign: 'center' }}>
              {scheda === 'visti' ? 'Non hai ancora votato nessun titolo qui.' : 'Nessun titolo da vedere: usa il segnalibro per aggiungerne.'}
            </p>
          )}
        </div>
      </div>
      <BarraNavigazione attiva="libreria" onHome={onHome} onCarte={onWizard} />
    </div>
  )
}
