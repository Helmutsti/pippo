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
export function TestaSezione({ titolo, piccola }) {
  return (
    <div className="testa-sezione">
      <h2 className={piccola ? 't-etichetta c-ter' : 't-titolo-sezione'}>{titolo}</h2>
      <button className="vedi-tutto t-etichetta c-sec">Vedi tutto</button>
    </div>
  )
}

// Fila di copertine. Nell'angolo il voto; se non c'è, il segnalibro dei titoli da vedere
// (non nella fila della watch list, dove sarebbe su tutti)
export function FilaCopertine({ titolo, ids, onApri, senzaSegnalibro }) {
  const { voti, daVedere } = useStore()
  return (
    <section className="sezione-fila">
      <TestaSezione titolo={titolo} />
      <Fila>
        {ids.map((id) => {
          const t = TITOLI[id]
          const v = voti[id] || (!senzaSegnalibro && daVedere[id] && 'da-vedere')
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
      <TestaSezione titolo="Cast" piccola />
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
