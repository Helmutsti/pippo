import { X } from 'lucide-react'
import { FILTRI, TITOLI, rispettaFiltri } from '../data.js'
import { useStore } from '../store.jsx'
import Griglia from '../components/Griglia.jsx'
import { BarraIndietro } from '../components/Barra.jsx'

// Risultati dei filtri: i filtri attivi (si toccano per toglierli), "Modifica filtri" e la griglia di copertine
export default function Risultati({ onIndietro, onApri, onModifica }) {
  const { filtri, setFiltri, nonInteressa, voti } = useStore()
  const ids = Object.keys(TITOLI).filter((id) => !nonInteressa[id] && rispettaFiltri(TITOLI[id], filtri, voti))
  const senza = (gruppo, v) => setFiltri({ ...filtri, [gruppo]: filtri[gruppo].filter((x) => x !== v) })
  const attivi = [
    ...(filtri.cosa !== 'Tutto' ? [{ chiave: 'cosa', etichetta: filtri.cosa, togli: () => setFiltri({ ...filtri, cosa: 'Tutto' }) }] : []),
    ...filtri.umore.map((u) => ({ chiave: 'u' + u, etichetta: u, togli: () => senza('umore', u) })),
    ...filtri.tempo.map((n) => ({ chiave: 't' + n, etichetta: FILTRI.tempo.find((f) => f.nome === n).etichetta, togli: () => senza('tempo', n) })),
    ...filtri.piattaforme.map((p) => ({ chiave: 'p' + p, etichetta: p, togli: () => senza('piattaforme', p) })),
  ]

  return (
    <div className="schermata">
      <div className="scorre">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spazio-gruppo)', padding: 'var(--area-sicura-alto) 0 var(--contenuto-spazio-sotto-barra)' }}>
          <header style={{ padding: '0 var(--spazio-pagina)', display: 'flex', flexDirection: 'column', gap: 'var(--spazio-icona)' }}>
            <h1 className="t-titolo-pagina">Risultati</h1>
            <p className="t-corpo c-sec">{ids.length} {ids.length === 1 ? 'titolo' : 'titoli'}</p>
          </header>
          <div className="gruppo-pillole" style={{ padding: '0 var(--spazio-pagina)' }}>
            {attivi.map((a) => (
              <button key={a.chiave} className="filtro-attivo t-pillola" onClick={a.togli} aria-label={`Togli il filtro ${a.etichetta}`}>
                {a.etichetta} <X size={16} strokeWidth={2} />
              </button>
            ))}
            <button className="pillola t-pillola" onClick={onModifica}>Modifica filtri</button>
          </div>
          {ids.length ? (
            <Griglia ids={ids} onApri={onApri} />
          ) : (
            <p className="t-corpo c-sec" style={{ padding: '24px var(--spazio-pagina)', textAlign: 'center' }}>Nessun titolo con questi filtri.</p>
          )}
        </div>
      </div>
      <BarraIndietro onIndietro={onIndietro} />
    </div>
  )
}
