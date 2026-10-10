import { TITOLI } from '../data.js'
import { SegniAngolo } from './Pezzi.jsx'

// Griglia di copertine tre per riga, con il titolo sotto: la stessa visualizzazione per Libreria e Risultati dei filtri
export default function Griglia({ ids, onApri, senzaSegnalibro }) {
  return (
    <div className="griglia">
      {ids.map((id) => {
        const t = TITOLI[id]
        return (
          <button key={id} className="elemento-griglia" onClick={() => onApri(id)}>
            <div className="img">
              <img src={t.poster} alt="" loading="lazy" />
              <SegniAngolo id={id} senzaSegnalibro={senzaSegnalibro} />
            </div>
            <span className="t-didascalia">{t.titolo}</span>
          </button>
        )
      })}
    </div>
  )
}
