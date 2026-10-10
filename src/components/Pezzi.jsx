import { Bookmark, Heart, ThumbsDown } from 'lucide-react'
import { TITOLI, cast } from '../data.js'
import { useStore } from '../store.jsx'
import Fila from './Fila.jsx'

const SEGNO = {
  like: [Heart, 'var(--voto-like)'],
  dislike: [ThumbsDown, 'var(--voto-dislike)'],
  'da-vedere': [Bookmark, 'var(--voto-da-vedere)'],
}

export function Imdb({ voto }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span className="imdb t-badge">IMDb</span>
      <span className="t-pulsante">{voto}</span>
    </span>
  )
}

// Titolo di una sezione con "Vedi tutto" a destra (per ora non porta a niente)
export function TestaSezione({ titolo }) {
  return (
    <div className="testa-sezione">
      <h2 className="t-titolo-sezione">{titolo}</h2>
      <button className="vedi-tutto t-etichetta c-sec">Vedi tutto</button>
    </div>
  )
}

// Fila di copertine
export function FilaCopertine({ titolo, ids, onApri, senzaVoto }) {
  const { voti } = useStore()
  return (
    <section className="sezione-fila">
      <TestaSezione titolo={titolo} />
      <Fila>
        {ids.map((id) => {
          const t = TITOLI[id]
          const v = !senzaVoto && voti[id]
          const [Segno, colore] = (v && SEGNO[v]) || []
          return (
            <button key={id} className="copertina-fila" onClick={() => onApri(id)}>
              <div className="img">
                <img src={t.poster} alt="" loading="lazy" />
                {Segno && (
                  <span className="voto-angolo"><Segno size={16} color={colore} fill={colore} /></span>
                )}
              </div>
              <span className="t-didascalia">{t.titolo}</span>
            </button>
          )
        })}
        <span style={{ width: 8 }} />
      </Fila>
    </section>
  )
}

// Fila del cast
export function FilaCast({ titolo }) {
  const persone = cast(titolo)
  if (!persone.length) return null
  return (
    <section className="sezione-fila">
      <h2 className="t-etichetta c-ter" style={{ padding: '0 var(--spazio-pagina)' }}>Cast</h2>
      <Fila style={{ gap: 8 }}>
        {persone.map((p) => (
          <div key={p.nome} className="attore">
            <img src={p.foto} alt="" loading="lazy" />
            <span className="t-didascalia">{p.nome}<br /><span className="c-ter">({p.personaggio})</span></span>
          </div>
        ))}
      </Fila>
    </section>
  )
}
