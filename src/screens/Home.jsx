import { FILE_HOME, FILTRI_VUOTI, GENERI, SUGGERIMENTI, TITOLI, rispettaFiltri } from '../data.js'
import { useStore } from '../store.jsx'
import Carosello from '../components/Carosello.jsx'
import { FilaCopertine, TestaSezione } from '../components/Pezzi.jsx'
import { BarraHome } from '../components/Barra.jsx'
import Fila from '../components/Fila.jsx'

export default function Home({ onApri, onFiltri, onWizard, scrollRef }) {
  const { daVedere, filtri, setFiltri } = useStore()
  const passa = (id) => rispettaFiltri(TITOLI[id], filtri)
  const suggerimenti = SUGGERIMENTI.filter(passa).slice(0, 5)
  const watchlist = Object.keys(daVedere)

  return (
    <div className="schermata">
      <div className="scorre" ref={scrollRef}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spazio-sezione)', padding: 'var(--area-sicura-alto) 0 var(--contenuto-spazio-sotto-barra)' }}>
          <h1 className="t-titolo-pagina" style={{ padding: '0 var(--spazio-pagina)' }}>Puoi guardare…</h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spazio-gruppo)' }}>
            {suggerimenti.length ? (
              <Carosello key={suggerimenti.join()} ids={suggerimenti} onApri={onApri} />
            ) : (
              <div style={{ padding: '40px var(--spazio-pagina)', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p className="t-corpo c-sec">Nessun titolo per i filtri scelti.</p>
                <button className="pulsante secondario t-pulsante" onClick={() => setFiltri(FILTRI_VUOTI)}>Azzera i filtri</button>
              </div>
            )}
            <div style={{ padding: '0 var(--spazio-pagina)' }}>
              <button className="pulsante principale t-pulsante" onClick={onFiltri}>Non sai cosa scegliere?</button>
            </div>
          </div>

          {FILE_HOME.map((f) => {
            const ids = (f.watchlist ? watchlist : f.ids).filter(passa)
            if (!ids.length) return null
            return <FilaCopertine key={f.titolo} titolo={f.titolo} ids={ids} onApri={onApri} senzaSegnalibro={f.watchlist} />
          })}

          <section className="sezione-fila">
            <TestaSezione titolo="Generi" />
            <Fila>
              {GENERI.map((g) => (
                <div key={g.nome} className="genere">
                  <img src={g.illustrazione} alt="" />
                  <span className="t-titolo-sezione">{g.nome}</span>
                </div>
              ))}
              <span style={{ width: 8 }} />
            </Fila>
          </section>
        </div>
      </div>
      <BarraHome onCarte={onWizard} />
    </div>
  )
}
