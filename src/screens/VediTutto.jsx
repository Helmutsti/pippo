import { GENERI } from '../data.js'
import { useStore } from '../store.jsx'
import Griglia from '../components/Griglia.jsx'
import { BarraIndietro } from '../components/Barra.jsx'

// "Vedi tutto": per ora una semplice griglia con il titolo della sezione.
// titoli → griglia di copertine (tre per riga) · persone → foto tonde (tre per riga) · generi → riquadri dei generi (due per riga)
export default function VediTutto({ titolo, tipo, ids = [], persone = [], onIndietro, onApri, onArtista }) {
  const { nonInteressa } = useStore()
  const titoli = ids.filter((id) => !nonInteressa[id])
  const quanti = tipo === 'titoli' ? titoli.length : tipo === 'persone' ? persone.length : GENERI.length
  const parola = { titoli: ['titolo', 'titoli'], persone: ['persona', 'persone'], generi: ['genere', 'generi'] }[tipo]

  return (
    <div className="schermata">
      <div className="scorre">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spazio-gruppo)', padding: 'var(--area-sicura-alto) 0 var(--contenuto-spazio-sotto-barra)' }}>
          <header style={{ padding: '0 var(--spazio-pagina)', display: 'flex', flexDirection: 'column', gap: 'var(--spazio-icona)' }}>
            <h1 className="t-titolo-pagina">{titolo}</h1>
            <p className="t-corpo c-sec">{quanti} {quanti === 1 ? parola[0] : parola[1]}</p>
          </header>

          {tipo === 'titoli' && <Griglia ids={titoli} onApri={onApri} />}

          {tipo === 'persone' && (
            <div className="griglia-persone">
              {persone.map((p) => (
                <button key={p.nome} className="attore" onClick={() => onArtista(p.nome)}>
                  {p.foto ? <img src={p.foto} alt="" loading="lazy" /> : <span className="foto-vuota t-pulsante">{p.nome.split(' ').map((x) => x[0]).join('')}</span>}
                  <span className="t-didascalia">{p.nome}{p.sotto && <><br /><span className="c-ter">{p.sotto}</span></>}</span>
                </button>
              ))}
            </div>
          )}

          {tipo === 'generi' && (
            <div className="griglia-generi">
              {GENERI.map((g) => (
                <div key={g.nome} className="genere">
                  <img src={g.illustrazione} alt="" />
                  <span className="t-titolo-sezione">{g.nome}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <BarraIndietro onIndietro={onIndietro} />
    </div>
  )
}
