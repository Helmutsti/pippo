import { TITOLI, durata } from '../data.js'
import { useStore } from '../store.jsx'
import { FilaCast, FilaCopertine, Imdb } from '../components/Pezzi.jsx'
import { BarraScheda } from '../components/Barra.jsx'

export default function Scheda({ id, onIndietro, onApri }) {
  const t = TITOLI[id]
  const { voti, alterna } = useStore()

  return (
    <div className="schermata">
      <div className="scorre">
        {/* Immagine con prolungamento, copertina al centro */}
        <div style={{ position: 'relative', height: 440, overflow: 'hidden' }}>
          <img src={t.poster} alt="" style={{ position: 'absolute', inset: -60, width: 'calc(100% + 120px)', height: 560, objectFit: 'cover', filter: 'blur(40px)' }} />
          <img src={t.poster} alt={t.titolo} style={{
            position: 'absolute', left: 'calc(50% - 146.5px)', top: 0, width: 293, height: 440, objectFit: 'cover',
            WebkitMaskImage: 'linear-gradient(to right, transparent, #000 18%, #000 82%, transparent)',
            maskImage: 'linear-gradient(to right, transparent, #000 18%, #000 82%, transparent)',
          }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(#000 0%, #0000 20%, #0000 70%, #000 100%)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spazio-gruppo)', padding: '0 0 var(--contenuto-spazio-sotto-barra)' }}>
          <div style={{ padding: '0 var(--spazio-pagina)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h1 className="t-titolo-carta">{t.titolo}</h1>
            <p className="t-corpo c-sec" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <Imdb voto={t.imdb} /> · {t.anno} · {durata(t)} · {t.generi[0]}
            </p>
          </div>

          <Blocco titolo="Dove guardarlo">
            <div className="gruppo-pillole">
              {t.piattaforme.map((p) => <span key={p} className="pillola t-pillola">{p}</span>)}
            </div>
          </Blocco>
          <Blocco titolo="Trama"><p className="t-corpo c-sec">{t.trama}</p></Blocco>
          <Blocco titolo={t.regia ? 'Regia' : 'Ideata da'}><p className="t-corpo">{t.regia || t.ideata}</p></Blocco>
          <FilaCast titolo={t} />
          {t.simili?.length > 0 && <FilaCopertine titolo="Titoli simili" ids={t.simili} onApri={onApri} />}
        </div>
      </div>
      <BarraScheda onIndietro={onIndietro} voto={voti[id]} onVoto={(v) => alterna(id, v)} />
    </div>
  )
}

function Blocco({ titolo, children }) {
  return (
    <section style={{ padding: '0 var(--spazio-pagina)', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h2 className="t-etichetta c-ter">{titolo}</h2>
      {children}
    </section>
  )
}
