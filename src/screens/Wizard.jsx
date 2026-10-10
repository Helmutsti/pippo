import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { Bookmark, Heart, ThumbsDown } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TITOLI, WIZARD } from '../data.js'
import { useStore } from '../store.jsx'
import { FilaCast, Imdb } from '../components/Pezzi.jsx'
import { BarraWizard } from '../components/Barra.jsx'
import { useSchermo } from '../schermo.js'

// Wizard per scoprire nuovi titoli.
// Gesti per direzione del dito: destra = mi è piaciuto, sinistra = non mi è piaciuto,
// su = successivo, giù = precedente; tocco = gira la carta. Da tastiera: frecce, spazio, B, Esc.
// Carta: 12 dai lati, 104 dall'alto, 108 dal fondo (come nel disegno a 393 × 852)
const misureCarta = ({ larghezza, altezza }) => ({ x: 12, y: 104, w: larghezza - 24, h: altezza - 104 - 108 })
const SOGLIA_X = 110
const SOGLIA_Y = 90
const MOLLA = { type: 'spring', stiffness: 320, damping: 34 }

const VOTI = {
  like: { Icona: Heart, colore: 'var(--voto-like)', velo: 'var(--voto-like-velo)' },
  dislike: { Icona: ThumbsDown, colore: 'var(--voto-dislike)', velo: 'var(--voto-dislike-velo)' },
  'da-vedere': { Icona: Bookmark, colore: 'var(--voto-da-vedere)', velo: 'var(--voto-da-vedere-velo)' },
}

export default function Wizard({ onInterrompi, inPausa }) {
  const { vota } = useStore()
  const [indice, setIndice] = useState(0)
  const [girata, setGirata] = useState(false)
  const [bolle, setBolle] = useState([])
  const [segnalibro, setSegnalibro] = useState(false)
  const occupato = useRef(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const schermo = useSchermo()
  const CARTA = misureCarta(schermo)
  const PASSO_Y = CARTA.h + 12

  // Quando cambia carta, la nuova prende il posto della vecchia senza salti
  useLayoutEffect(() => { x.set(0); y.set(0); setGirata(false); setSegnalibro(false) }, [indice, x, y])

  const finito = indice >= WIZARD.length
  const id = WIZARD[indice]

  const passaA = useCallback(async (verso) => {
    const nuovo = indice + verso
    if (nuovo < 0) { await animate(y, 0, MOLLA); return }
    await animate(y, -verso * PASSO_Y, { type: 'spring', stiffness: 260, damping: 32, restDelta: 1 })
    setIndice(nuovo)
  }, [indice, y, PASSO_Y])

  const dai = useCallback(async (voto) => {
    if (occupato.current || finito) return
    occupato.current = true
    vota(id, voto)
    const verso = voto === 'like' ? 1 : -1
    // la bolla parte dove si trova l'icona sulla carta
    const partenzaX = Math.max(-110, Math.min(110, x.get()))
    animate(x, verso * 520, { duration: 0.28, ease: 'easeIn' })
    setTimeout(() => setBolle((b) => [...b, { chiave: Date.now(), voto, partenzaX }]), 200)
    await new Promise((r) => setTimeout(r, 260))
    await passaA(1)
    occupato.current = false
  }, [finito, id, passaA, vota, x])

  const salva = useCallback(async () => {
    if (occupato.current || finito) return
    occupato.current = true
    vota(id, 'da-vedere')
    setSegnalibro(true)
    await new Promise((r) => setTimeout(r, 650))
    await passaA(1)
    occupato.current = false
  }, [finito, id, passaA, vota])

  const scorri = useCallback(async (verso) => {
    if (occupato.current) return
    occupato.current = true
    await passaA(verso)
    occupato.current = false
  }, [passaA])

  // Tastiera, per provare il prototipo dal computer
  useEffect(() => {
    if (inPausa) return
    const tasto = (e) => {
      if (e.key === 'Escape') onInterrompi()
      if (finito) return
      if (e.key === 'ArrowRight' && !girata) dai('like')
      else if (e.key === 'ArrowLeft' && !girata) dai('dislike')
      else if (e.key === 'ArrowDown') scorri(1)
      else if (e.key === 'ArrowUp') scorri(-1)
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setGirata((g) => !g) }
      else if (e.key.toLowerCase() === 'b') salva()
    }
    window.addEventListener('keydown', tasto)
    return () => window.removeEventListener('keydown', tasto)
  }, [dai, finito, girata, inPausa, onInterrompi, salva, scorri])

  const fineTrascinamento = (_, info) => {
    const asse = Math.abs(info.offset.x) > Math.abs(info.offset.y) ? 'x' : 'y'
    if (asse === 'x') {
      if (info.offset.x > SOGLIA_X || info.velocity.x > 700) return dai('like')
      if (info.offset.x < -SOGLIA_X || info.velocity.x < -700) return dai('dislike')
      return animate(x, 0, MOLLA)
    }
    if (info.offset.y < -SOGLIA_Y || info.velocity.y < -700) return scorri(1)
    if (info.offset.y > SOGLIA_Y || info.velocity.y > 700) return scorri(-1)
    return animate(y, 0, MOLLA)
  }

  return (
    <div className="schermata">
      {[-1, 0, 1].map((d) => {
        const tid = WIZARD[indice + d]
        if (!tid) {
          if (d === 1 && !finito) return <Fine key="fine" carta={CARTA} y={y} offset={PASSO_Y} onFine={onInterrompi} />
          return null
        }
        return (
          <Carta key={tid} carta={CARTA} t={TITOLI[tid]} attiva={d === 0} offset={d * PASSO_Y} x={x} y={y}
            girata={d === 0 && girata} segnalibro={d === 0 && segnalibro}
            onTap={() => setGirata((g) => !g)} onDragEnd={fineTrascinamento} occupato={occupato} />
        )
      })}
      {finito && <Fine carta={CARTA} y={y} offset={0} onFine={onInterrompi} />}

      <AnimatePresence>
        {bolle.map((b) => <Bolla key={b.chiave} {...b} carta={CARTA} onFine={() => setBolle((bb) => bb.filter((x) => x.chiave !== b.chiave))} />)}
      </AnimatePresence>

      <BarraWizard onIndietro={onInterrompi} onSegnalibro={salva} />
    </div>
  )
}

function Carta({ carta: CARTA, t, attiva, offset, x, y, girata, segnalibro, onTap, onDragEnd, occupato }) {
  const yCarta = useTransform(y, (v) => v + offset)
  const xCarta = useTransform(x, (v) => (attiva ? v : 0))
  const rotate = useTransform(xCarta, [-300, 300], [-12, 12])
  const like = useTransform(xCarta, [0, SOGLIA_X * 1.4], [0, 1])
  const dislike = useTransform(xCarta, [-SOGLIA_X * 1.4, 0], [1, 0])
  const scalaLike = useTransform(like, [0, 1], [0.5, 1])
  const scalaDislike = useTransform(dislike, [0, 1], [0.5, 1])
  // le carte vicine si vedono solo mentre si scorre in verticale
  const opacity = useTransform(y, (v) => (attiva ? 1 : Math.min(1, Math.abs(v) / 80)))
  const trascinata = useRef(false)

  return (
    <motion.div
      drag={attiva && !girata}
      dragDirectionLock
      dragMomentum={false}
      onDragStart={() => { trascinata.current = true }}
      onDragEnd={(e, i) => { onDragEnd(e, i); setTimeout(() => { trascinata.current = false }, 0) }}
      onTap={() => { if (attiva && !trascinata.current && !occupato.current) onTap() }}
      _dragX={x}
      _dragY={y}
      style={{
        position: 'absolute', left: CARTA.x, top: CARTA.y, width: CARTA.w, height: CARTA.h,
        x: xCarta, y: yCarta, rotate, opacity, zIndex: attiva ? 2 : 1, perspective: 1400, touchAction: 'none', cursor: attiva ? 'grab' : 'default',
      }}
    >
      <motion.div
        animate={{ rotateY: girata ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 20 }}
        style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}
      >
        {/* Fronte */}
        {/* Solo la faccia girata verso chi guarda riceve i tocchi: Safari (e Brave su iPhone)
            fa toccare anche la faccia nascosta, che altrimenti ruberebbe i gesti */}
        <div style={{ ...faccia, background: 'var(--superficie-pannello)', pointerEvents: girata ? 'none' : 'auto' }}>
          <img src={t.poster} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(#0000 55%, #000000d9 100%)' }} />
          <h2 className="t-titolo-carta" style={{ position: 'absolute', left: 20, right: 20, bottom: 20 }}>{t.titolo}</h2>

          {/* Velo e segno che seguono il dito */}
          <motion.div style={{ ...riempi, background: VOTI.like.velo, opacity: like }} />
          <motion.div style={{ ...riempi, background: VOTI.dislike.velo, opacity: dislike }} />
          <motion.div style={{ ...segno, opacity: like, scale: scalaLike }}><Heart size={120} color={VOTI.like.colore} fill={VOTI.like.colore} style={ombraIcona} /></motion.div>
          <motion.div style={{ ...segno, opacity: dislike, scale: scalaDislike }}><ThumbsDown size={120} color={VOTI.dislike.colore} fill={VOTI.dislike.colore} style={ombraIcona} /></motion.div>
          <AnimatePresence>
            {segnalibro && (
              <>
                <motion.div key="v" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ ...riempi, background: VOTI['da-vedere'].velo }} />
                <motion.div key="s" initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 14 }} style={segno}>
                  <Bookmark size={120} color={VOTI['da-vedere'].colore} fill={VOTI['da-vedere'].colore} style={ombraIcona} />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Retro */}
        <div style={{ ...faccia, transform: 'rotateY(180deg)', background: 'var(--superficie-retro)', pointerEvents: girata ? 'auto' : 'none' }}>
          <img src={t.poster} alt="" style={{ position: 'absolute', inset: -40, width: 'calc(100% + 80px)', height: 'calc(100% + 80px)', objectFit: 'cover', filter: 'blur(40px)', opacity: 0.35 }} />
          <div style={{ position: 'relative', height: '100%', overflowY: 'auto', padding: '24px 0', display: 'flex', flexDirection: 'column', gap: 'var(--spazio-gruppo)' }}>
            <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h2 className="t-titolo-pannello">{t.titolo}</h2>
              <p className="t-corpo c-sec" style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Imdb voto={t.imdb} /> · {t.anno}</p>
              <p className="t-didascalia"><span className="c-ter">{t.regia ? 'Regia' : 'Ideata da'}</span>&nbsp; {t.regia || t.ideata}</p>
            </div>
            <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h3 className="t-etichetta c-ter">Trama</h3>
              <p className="t-corpo c-sec">{t.trama}</p>
            </div>
            {/* Il cast scorre in orizzontale senza girare la carta */}
            <div onClick={(e) => e.stopPropagation()}>
              <FilaCast titolo={t} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Dopo il voto il segno sale ondeggiando, si rimpicciolisce e sparisce come una bolla di sapone
function Bolla({ carta: CARTA, voto, partenzaX, onFine }) {
  const { Icona, colore } = VOTI[voto]
  return (
    <motion.div
      initial={{ x: partenzaX, y: 0, scale: 1, opacity: 1 }}
      animate={{ x: [partenzaX, partenzaX - 14, partenzaX + 12, partenzaX - 8, partenzaX], y: -380, scale: 0.35, opacity: 0 }}
      transition={{ duration: 0.9, ease: 'easeOut', x: { duration: 0.9, ease: 'easeInOut' }, opacity: { duration: 0.9, ease: 'easeIn' } }}
      onAnimationComplete={onFine}
      style={{ position: 'absolute', left: CARTA.x + CARTA.w / 2 - 60, top: CARTA.y + CARTA.h / 2 - 60, zIndex: 30, pointerEvents: 'none' }}
    >
      <Icona size={120} color={colore} fill={colore} style={ombraIcona} />
    </motion.div>
  )
}

function Fine({ carta: CARTA, y, offset, onFine }) {
  const yFine = useTransform(y, (v) => v + offset)
  return (
    <motion.div style={{ position: 'absolute', left: CARTA.x, top: CARTA.y, width: CARTA.w, height: CARTA.h, y: yFine, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 16, padding: 32, textAlign: 'center' }}>
      <h2 className="t-titolo-pannello">Per ora è tutto</h2>
      <p className="t-corpo c-sec">I tuoi voti sono salvati e aiutano a scegliere i suggerimenti.</p>
      <button className="pulsante principale t-pulsante" onClick={onFine}>Torna alla Home</button>
    </motion.div>
  )
}

const faccia = { position: 'absolute', inset: 0, borderRadius: 'var(--raggio-carta)', overflow: 'hidden', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }
const riempi = { position: 'absolute', inset: 0, pointerEvents: 'none' }
const segno = { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }
const ombraIcona = { filter: 'drop-shadow(0 6px 18px rgba(0,0,0,.45))' }
