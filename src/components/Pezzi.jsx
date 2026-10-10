import { Bookmark, EyeOff, Heart, ThumbsDown } from 'lucide-react'
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

// Velo grigio sopra la copertina di un titolo "non mi interessa", in tutta l'app
// leggero: nei risultati di Cerca, dove il titolo si cerca apposta e la copertina deve restare riconoscibile
export function VeloNascosto({ icona = 32, leggero, style }) {
  return (
    <div className={`velo-nascosto${leggero ? ' leggero' : ''}`} style={style}>
      {icona && <EyeOff size={icona} color="var(--voto-non-interessa)" />}
    </div>
  )
}

// Titolo di una sezione con "Vedi tutto" a destra, che apre la griglia completa (se c'è dove andare)
export function TestaSezione({ titolo, piccola, onVediTutto }) {
  return (
    <div className="testa-sezione">
      <h2 className={piccola ? 't-etichetta c-ter' : 't-titolo-sezione'}>{titolo}</h2>
      {onVediTutto && <button className="vedi-tutto t-etichetta c-sec" onClick={onVediTutto}>Vedi tutto</button>}
    </div>
  )
}

// Segni sull'angolo di una copertina: il voto e il segnalibro dei titoli da vedere, affiancati come un mazzo
// (il voto davanti, il segnalibro che spunta da dietro a sinistra). "Non mi interessa" copre tutto col velo grigio.
// Dove il segnalibro sarebbe su tutte le copertine (watch list) non si mostra.
export function SegniAngolo({ id, senzaSegnalibro }) {
  const { voti, daVedere, nonInteressa } = useStore()
  if (nonInteressa[id]) return <VeloNascosto />
  // dal più lontano al più vicino: prima il segnalibro, poi il voto
  const segni = [!senzaSegnalibro && daVedere[id] && 'da-vedere', voti[id]].filter(Boolean)
  return segni.map((s, i) => {
    const [Segno, colore] = SEGNO[s]
    return (
      <span key={s} className="voto-angolo vetro" style={{ right: 8 + 18 * (segni.length - 1 - i) }}>
        <Segno size={16} color={colore} fill={colore} />
      </span>
    )
  })
}

// Fila di copertine che scorre in orizzontale
export function FilaCopertine({ titolo, ids, onApri, senzaSegnalibro, onVediTutto }) {
  return (
    <section className="sezione-fila">
      <TestaSezione titolo={titolo} onVediTutto={onVediTutto} />
      <Fila>
        {ids.map((id) => {
          const t = TITOLI[id]
          return (
            <button key={id} className="copertina-fila" onClick={() => onApri(id)}>
              <div className="img">
                <img src={t.poster} alt="" loading="lazy" />
                <SegniAngolo id={id} senzaSegnalibro={senzaSegnalibro} />
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
export function FilaCast({ titolo, onArtista, onVediTutto }) {
  const persone = cast(titolo)
  if (!persone.length) return null
  return (
    <section className="sezione-fila">
      <TestaSezione titolo="Cast" onVediTutto={onVediTutto && (() => onVediTutto({ titolo: 'Cast', tipo: 'persone', persone: persone.map((p) => ({ nome: p.nome, foto: p.foto, sotto: p.personaggio })) }))} />
      <Fila style={{ gap: 8 }}>
        {persone.map((p) => (
          <button key={p.nome} className="attore" onClick={(e) => { if (onArtista) { e.stopPropagation(); onArtista(p.nome) } }}>
            <img src={p.foto} alt="" loading="lazy" />
            <span className="t-didascalia">{p.nome}<br /><span className="c-ter">({p.personaggio})</span></span>
          </button>
        ))}
      </Fila>
    </section>
  )
}
