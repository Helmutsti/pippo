import { FILE_HOME, GENERI, SUGGERIMENTI, TITOLI, fraseDiOggi } from '../data.js'
import { useStore } from '../store.jsx'
import Carosello from '../components/Carosello.jsx'
import { FilaCopertine, TestaSezione } from '../components/Pezzi.jsx'
import { useEffect, useRef, useState } from 'react'
import { useSchermo } from '../schermo.js'
import { BarraNavigazione } from '../components/Barra.jsx'
import Fila from '../components/Fila.jsx'

// Una frase per apertura dell'app (scelta una volta sola, anche se la Home si ridisegna)
const frase = fraseDiOggi()

export default function Home({ onApri, onFiltri, onWizard, onLibreria, onCerca, onVediTutto, scrollRef }) {
  const { nonInteressa } = useStore()
  // i titoli segnati "non mi interessa" non vengono più proposti; i filtri non toccano la Home (aprono i Risultati)
  const passa = (id) => TITOLI[id] && !nonInteressa[id]
  const suggerimenti = SUGGERIMENTI.filter(passa).slice(0, 5)
  // la Home serve a esplorare: niente watch list qui (la lista "Da vedere" sta nella Libreria)
  const piuVotati = Object.values(TITOLI).sort((a, b) => parseFloat(b.imdb.replace(',', '.')) - parseFloat(a.imdb.replace(',', '.'))).map((t) => t.id)
  // Il carosello si adatta: la copertina è la più grande che lascia "Non sai cosa scegliere?" sopra la barra.
  // Sotto la copertina e la frase in alto restano fissi 291 px (area sicura, spazi, titolo, pallini, pulsante)
  // e la barra con il suo margine ne occupa 88.
  const { altezza } = useSchermo()
  const testa = useRef(null)
  const [altezzaTesta, setAltezzaTesta] = useState(66)
  useEffect(() => {
    const el = testa.current
    const ro = new ResizeObserver(() => setAltezzaTesta(el.offsetHeight))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const altezzaCopertina = Math.max(200, altezza - 88 - 291 - altezzaTesta)

  return (
    <div className="schermata">
      <div className="scorre" ref={scrollRef}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spazio-sezione)', padding: 'var(--area-sicura-alto) 0 var(--contenuto-spazio-sotto-barra)' }}>
          <header ref={testa} style={{ padding: '0 var(--spazio-pagina)', display: 'flex', flexDirection: 'column', gap: 'var(--spazio-icona)' }}>
            <h1 className="t-titolo-pagina">{frase}</h1>
            <p className="t-titolo-sezione c-sec">Potresti guardare…</p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spazio-gruppo)' }}>
            {suggerimenti.length > 0 && <Carosello key={suggerimenti.join()} ids={suggerimenti} onApri={onApri} altezzaCopertina={altezzaCopertina} />}
            <div style={{ padding: '0 var(--spazio-pagina)' }}>
              <button className="pulsante principale t-pulsante" onClick={onFiltri}>Non sai cosa scegliere?</button>
            </div>
          </div>

          {FILE_HOME.map((f) => {
            const tutti = (f.piuVotati ? piuVotati : f.ids).filter(passa)
            if (!tutti.length) return null
            return <FilaCopertine key={f.titolo} titolo={f.titolo} ids={tutti.slice(0, 10)} onApri={onApri} onVediTutto={() => onVediTutto({ titolo: f.titolo, tipo: 'titoli', ids: tutti })} />
          })}

          <section className="sezione-fila">
            <TestaSezione titolo="Generi" onVediTutto={() => onVediTutto({ titolo: 'Generi', tipo: 'generi' })} />
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
      <BarraNavigazione attiva="home" onCerca={onCerca} onLibreria={onLibreria} onCarte={onWizard} />
    </div>
  )
}
