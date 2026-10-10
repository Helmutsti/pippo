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
export function VeloNascosto({ icona = 32, style }) {
  return (
    <div className="velo-nascosto" style={style}>
      {icona && <EyeOff size={icona} color="var(--voto-non-interessa)" />}
    </div>
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

// Fila di copertine. Nell'angolo il voto e il segnalibro dei titoli da vedere, affiancati come un mazzo:
// il voto davanti, il segnalibro che spunta da dietro a sinistra.
// Nella fila della watch list il segnalibro non si mostra, perché sarebbe su tutti.
export function FilaCopertine({ titolo, ids, onApri, senzaSegnalibro }) {
  const { voti, daVedere, nonInteressa } = useStore()
  return (
    <section className="sezione-fila">
      <TestaSezione titolo={titolo} />
      <Fila>
        {ids.map((id) => {
          const t = TITOLI[id]
          // dal più lontano al più vicino: prima il segnalibro, poi il voto
          const segni = [!senzaSegnalibro && daVedere[id] && 'da-vedere', voti[id]].filter(Boolean)
          return (
            <button key={id} className="copertina-fila" onClick={() => onApri(id)}>
              <div className="img">
                <img src={t.poster} alt="" loading="lazy" />
                {nonInteressa[id] ? <VeloNascosto /> : segni.map((s, i) => {
                  const [Segno, colore] = SEGNO[s]
                  return (
                    <span key={s} className="voto-angolo vetro" style={{ right: 8 + 18 * (segni.length - 1 - i) }}>
                      <Segno size={16} color={colore} fill={colore} />
                    </span>
                  )
                })}
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
