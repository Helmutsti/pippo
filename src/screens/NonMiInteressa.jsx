import { TITOLI } from '../data.js'
import { useStore } from '../store.jsx'
import { VeloNascosto } from '../components/Pezzi.jsx'
import { BarraIndietro } from '../components/Barra.jsx'

// Non mi interessa (dal Profilo): i titoli nascosti, con il velo grigio. "Ripristina" li rimette normali per sempre.
export default function NonMiInteressa({ onIndietro, onApri }) {
  const { nonInteressa, alterna } = useStore()
  const ids = Object.keys(nonInteressa).filter((id) => TITOLI[id]).sort((a, b) => TITOLI[a].titolo.localeCompare(TITOLI[b].titolo, 'it'))

  return (
    <div className="schermata">
      <div className="scorre">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spazio-gruppo)', padding: 'var(--area-sicura-alto) 0 var(--contenuto-spazio-sotto-barra)' }}>
          <h1 className="t-titolo-pagina" style={{ padding: '0 var(--spazio-pagina)' }}>Non mi interessa</h1>
          {ids.length ? (
            <div style={{ padding: '0 var(--spazio-pagina)' }}>
              {ids.map((id) => {
                const t = TITOLI[id]
                return (
                  <div key={id} className="riga-libreria" role="button" tabIndex={0} onClick={() => onApri(id)}>
                    <div className="risultato-copertina"><img src={t.poster} alt="" loading="lazy" /><VeloNascosto icona={16} /></div>
                    <div className="risultato-testi">
                      <span className="t-pulsante">{t.titolo}</span>
                      <span className="t-didascalia c-sec">{t.anno} · {t.tipo}</span>
                    </div>
                    <button className="pillola t-pillola" onClick={(e) => { e.stopPropagation(); alterna(id, 'non-interessa') }}>Ripristina</button>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="t-corpo c-sec" style={{ padding: '24px var(--spazio-pagina)', textAlign: 'center' }}>Nessun titolo nascosto. Usa l'occhio barrato per nascondere quelli che non vuoi vedere.</p>
          )}
        </div>
      </div>
      <BarraIndietro onIndietro={onIndietro} />
    </div>
  )
}
