import { TITOLI, durata } from '../data.js'
import { REGISTI, nomiRegia } from '../registi.js'
import { useStore } from '../store.jsx'
import { FilaCast, FilaCopertine, Imdb, SegniAngolo, VeloNascosto } from '../components/Pezzi.jsx'
import { BarraScheda } from '../components/Barra.jsx'

export default function Scheda({ id, onIndietro, onApri, onArtista }) {
  const t = TITOLI[id]
  const { voti, daVedere, nonInteressa, alterna } = useStore()
  const simili = (t.simili || []).filter((s) => TITOLI[s] && !nonInteressa[s])

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
          {nonInteressa[id] && <VeloNascosto icona={96} />}
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
          {/* per le serie resta la riga "Ideata da"; per i film il regista ha il suo riquadro dopo il cast */}
          {!t.regia && <Blocco titolo="Ideata da"><p className="t-corpo">{t.ideata}</p></Blocco>}
          <FilaCast titolo={t} onArtista={onArtista} />
          {t.regia && <RiquadroRegia t={t} onApri={onApri} onArtista={onArtista} />}
          {simili.length > 0 && <FilaCopertine titolo="Titoli simili" ids={simili} onApri={onApri} />}
        </div>
      </div>
      <BarraScheda onIndietro={onIndietro} voto={voti[id]} daVedere={!!daVedere[id]} nonInteressa={!!nonInteressa[id]} onVoto={(v) => alterna(id, v)} />
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

// Riquadro del regista (solo film), da bordo a bordo: foto, "Regia di" e nome, quanti film e Oscar, poi "Altro di …" con i suoi film piccoli,
// tre per riga, che scorrono di lato. Con più registi: foto a mazzo, nomi insieme, film mescolati e Oscar sommati.
function RiquadroRegia({ t, onApri, onArtista }) {
  const { nonInteressa } = useStore()
  const nomi = nomiRegia(t.regia)
  const persone = nomi.map((n) => ({ nome: n, ...(REGISTI[n] || { film: 0, oscar: 0 }) }))
  const film = Math.max(...persone.map((p) => p.film)) // i film fatti insieme non si contano due volte
  const oscar = persone.reduce((s, p) => s + p.oscar, 0)
  const altri = Object.values(TITOLI)
    .filter((x) => x.id !== t.id && !nonInteressa[x.id] && nomiRegia(x.regia).some((n) => nomi.includes(n)))
    .sort((a, b) => b.anno - a.anno)
  const elenco = (n) => (n.length < 2 ? n[0] : `${n.slice(0, -1).join(', ')} e ${n.at(-1)}`)

  return (
    <section>
      <div className="riquadro-regia vetro">
        {persone[0].foto && <img className="riquadro-regia-sfondo" src={persone[0].foto} alt="" />}
        {/* foto e nome aprono la scheda artista (con più registi, quella del primo) */}
        <button className="riquadro-regia-persona" onClick={() => onArtista(nomi[0])}>
          <div className="mazzo-foto">
            {persone.map((p) => p.foto
              ? <img key={p.nome} src={p.foto} alt="" />
              : <span key={p.nome} className="t-pulsante">{p.nome.split(' ').map((x) => x[0]).join('')}</span>)}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0 }}>
            <span className="t-etichetta c-ter">Regia di</span>
            <span className="t-pulsante">{elenco(nomi)}</span>
            <span className="t-didascalia c-sec">{film} film{oscar > 0 ? ` · ${oscar} Oscar` : ''}</span>
          </div>
        </button>
        {altri.length > 0 && (
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="t-etichetta c-ter">Altro di {elenco(nomi)}</span>
            <div className="film-regia">
              {altri.map((x) => (
                <button key={x.id} className="elemento-griglia" onClick={() => onApri(x.id)}>
                  <div className="img"><img src={x.poster} alt="" loading="lazy" /><SegniAngolo id={x.id} /></div>
                  <span className="t-didascalia">{x.titolo}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
