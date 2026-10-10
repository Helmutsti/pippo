import { useState } from 'react'
import { artista } from '../artisti.js'
import { FilaCopertine, TestaSezione } from '../components/Pezzi.jsx'
import Fila from '../components/Fila.jsx'
import { BarraIndietro } from '../components/Barra.jsx'
import { TITOLI } from '../data.js'
import { useStore } from '../store.jsx'

// Scheda artista: attori, registi, cantanti. Foto grande in alto come nella Scheda titolo, poi nome, ruoli, nascita e premi in breve;
// biografia, "Conosciuta per", "Ha lavorato spesso con", premi vinti (niente zeri) e carriera divisa per ruolo.
export default function Artista({ nome, onIndietro, onApri, onArtista }) {
  const a = artista(nome)
  const { nonInteressa } = useStore()
  const [gruppo, setGruppo] = useState(a.carriera[0]?.[0])
  const righe = a.carriera.find(([g]) => g === gruppo)?.[1] || []
  const inBreve = [a.nascita, ...a.conteggio.map(([p, n]) => `${n} ${p}`)].filter(Boolean).join(' · ')
  const conosciuta = a.conosciutaPer.filter((id) => !nonInteressa[id])

  return (
    <div className="schermata">
      <div className="scorre">
        <div style={{ position: 'relative', height: 440, overflow: 'hidden', background: 'var(--superficie-pannello)' }}>
          {a.foto && <>
            <img src={a.foto} alt="" style={{ position: 'absolute', inset: -60, width: 'calc(100% + 120px)', height: 560, objectFit: 'cover', filter: 'blur(40px)' }} />
            <img src={a.foto} alt={a.nome} style={{
              position: 'absolute', left: 'calc(50% - 146.5px)', top: 0, width: 293, height: 440, objectFit: 'cover',
              WebkitMaskImage: 'linear-gradient(to right, transparent, #000 18%, #000 82%, transparent)',
              maskImage: 'linear-gradient(to right, transparent, #000 18%, #000 82%, transparent)',
            }} />
          </>}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(#000 0%, #0000 20%, #0000 70%, #000 100%)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spazio-gruppo)', padding: '0 0 var(--contenuto-spazio-sotto-barra)' }}>
          <div style={{ padding: '0 var(--spazio-pagina)', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h1 className="t-titolo-carta">{a.nome}</h1>
            {a.ruoli && <p className="t-corpo c-sec">{a.ruoli}</p>}
            {inBreve && <p className="t-didascalia c-ter">{inBreve}</p>}
          </div>

          {a.bio && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h2 className="t-titolo-sezione" style={{ padding: '0 var(--spazio-pagina)' }}>Biografia</h2>
              <p className="t-corpo c-sec" style={{ padding: '0 var(--spazio-pagina)' }}>{a.bio}</p>
            </section>
          )}

          {conosciuta.length > 0 && <FilaCopertine titolo={a.conteggio.length || a.bio ? 'Conosciuta per' : 'Nel catalogo'} ids={conosciuta} onApri={onApri} />}

          {a.colleghi.length > 0 && (
            <section className="sezione-fila">
              <TestaSezione titolo="Ha lavorato spesso con" />
              <Fila style={{ gap: 8 }}>
                {a.colleghi.map((p) => (
                  <button key={p.nome} className="attore" onClick={() => onArtista(p.nome)}>
                    {p.foto ? <img src={p.foto} alt="" loading="lazy" /> : <span className="foto-vuota t-pulsante">{p.nome.split(' ').map((x) => x[0]).join('')}</span>}
                    <span className="t-didascalia">{p.nome}<br /><span className="c-ter">{p.volte} {p.volte === 1 ? 'titolo' : 'titoli'} insieme</span></span>
                  </button>
                ))}
              </Fila>
            </section>
          )}

          {a.premi.length > 0 && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h2 className="t-titolo-sezione" style={{ padding: '0 var(--spazio-pagina)' }}>Premi</h2>
              <div style={{ display: 'flex', gap: 8, padding: '0 var(--spazio-pagina)' }}>
                {a.conteggio.map(([p, n]) => (
                  <div key={p} className="premio vetro">
                    <span className="t-titolo-pannello">{n}</span>
                    <span className="t-etichetta c-sec">{p}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 var(--spazio-pagina)' }}>
                {a.premi.map(([anno, premio, categoria, titolo], i) => (
                  <div key={i} style={{ display: 'flex', gap: 12 }}>
                    <span className="t-etichetta c-ter" style={{ paddingTop: 3 }}>{anno}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span className="t-corpo">{premio} · {categoria}</span>
                      <span className="t-didascalia c-sec">{titolo}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {a.carriera.length > 0 && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <h2 className="t-titolo-sezione" style={{ padding: '0 var(--spazio-pagina)' }}>Carriera</h2>
              <div className="gruppo-pillole" style={{ padding: '0 var(--spazio-pagina)' }}>
                {a.carriera.map(([g, r]) => (
                  <button key={g} className={`pillola t-pillola${gruppo === g ? ' scelta' : ''}`} aria-pressed={gruppo === g} onClick={() => setGruppo(g)}>{g} · {r.length}</button>
                ))}
              </div>
              <div style={{ padding: '0 var(--spazio-pagina)' }}>
                {righe.map((r, i) => {
                  const t = r.id && TITOLI[r.id]
                  return (
                    <div key={i} className="riga-libreria" role={t ? 'button' : undefined} style={{ cursor: t ? 'pointer' : 'default' }} onClick={t ? () => onApri(t.id) : undefined}>
                      <div className="risultato-copertina">{t && <img src={t.poster} alt="" loading="lazy" />}</div>
                      <div className="risultato-testi">
                        <span className="t-pulsante">{r.titolo}</span>
                        <span className="t-didascalia c-sec">{[r.anno, r.tipo, r.ruolo].filter(Boolean).join(' · ')}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      </div>
      <BarraIndietro onIndietro={onIndietro} />
    </div>
  )
}
