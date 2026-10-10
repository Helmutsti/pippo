import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import { Bookmark, EyeOff, Heart, ThumbsDown } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TITOLI, WIZARD } from '../data.js'
import { useStore } from '../store.jsx'
import { FilaCast, Imdb } from '../components/Pezzi.jsx'
import { BarraWizard } from '../components/Barra.jsx'
import { useSchermo } from '../schermo.js'

// Wizard per scoprire nuovi titoli.
// Gesti per direzione del dito: destra = mi è piaciuto, sinistra = non mi è piaciuto,
// su = successivo, giù = precedente; tocco = gira la carta. Da tastiera: frecce, spazio, B, Esc.
// Carta: la copertina intera (2:3, mai tagliata), la più grande che sta tra la barra di stato e la barra in basso,
// al centro dello spazio libero. Intorno la stessa copertina sfocata e scurita riempie lo schermo.
const ALTO = 54 // area sicura in alto
const misureCarta = ({ larghezza, altezza }) => {
  const basso = altezza - 16 - 56 - 16 // sopra la barra
  const h = Math.min(Math.round((larghezza - 24) * 1.5), basso - ALTO - 24)
  const w = Math.round(h / 1.5)
  return { x: Math.round((larghezza - w) / 2), y: Math.round(ALTO + (basso - ALTO - h) / 2), w, h }
}
const SOGLIA_X = 110
const SOGLIA_Y = 90
const MOLLA = { type: 'spring', stiffness: 320, damping: 34 }

const VOTI = {
  like: { Icona: Heart, colore: 'var(--voto-like)', velo: 'var(--voto-like-velo)' },
  dislike: { Icona: ThumbsDown, colore: 'var(--voto-dislike)', velo: 'var(--voto-dislike-velo)' },
  'da-vedere': { Icona: Bookmark, colore: 'var(--voto-da-vedere)', velo: 'var(--voto-da-vedere-velo)' },
  'non-interessa': { Icona: EyeOff, colore: 'var(--voto-non-interessa)', velo: 'var(--voto-non-interessa-velo)', vuota: true },
}

export default function Wizard({ onInterrompi, inPausa }) {
  const { vota, alterna, daVedere, nonInteressa } = useStore()
  const [indice, setIndice] = useState(0)
  const [girata, setGirata] = useState(false)
  const [bolle, setBolle] = useState([])
  const [segnalibro, setSegnalibro] = useState(false) // velo giallo sulla carta prima di passare oltre
  const occupato = useRef(false)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const comparsa = useMotionValue(1) // 0 → 1: la carta successiva compare dopo un voto
  const ultimoVoto = useRef(0)
  const schermo = useSchermo()
  const CARTA = misureCarta(schermo)
  // la carta che se ne va esce tutta dallo schermo e quella che arriva parte da fuori
  const PASSO_Y = Math.max(CARTA.y + CARTA.h, schermo.altezza - CARTA.y)

  // Quando cambia carta, la nuova prende il posto della vecchia senza salti
  useLayoutEffect(() => { x.set(0); y.set(0); setGirata(false); setSegnalibro(false) }, [indice, x, y])

  // Cronologia: i titoli già proposti restano com'erano (tornando indietro si ritrovano, anche quelli
  // "non mi interessa", col velo grigio). Le proposte nuove invece saltano i titoli "non mi interessa".
  // Il wizard non finisce mai: in teoria scorre tutto il catalogo, nel prototipo ricomincia dai primi titoli.
  const cronologia = useRef([])
  const cursore = useRef(0)
  const prossimo = () => {
    for (let k = 0; k < WIZARD.length; k++) {
      const candidato = WIZARD[cursore.current++ % WIZARD.length]
      if (!nonInteressa[candidato] && candidato !== cronologia.current.at(-1)) return candidato
    }
    return WIZARD[cursore.current++ % WIZARD.length]
  }
  while (cronologia.current.length < indice + 2) cronologia.current.push(prossimo())
  const titoloA = (i) => cronologia.current[i]
  const id = titoloA(indice)

  const passaA = useCallback(async (verso) => {
    const nuovo = indice + verso
    if (nuovo < 0) { await animate(y, 0, MOLLA); return } // prima del primo titolo non c'è niente
    await animate(y, -verso * PASSO_Y, { type: 'spring', stiffness: 260, damping: 32, restDelta: 1 })
    setIndice(nuovo)
  }, [indice, y, PASSO_Y])

  const dai = useCallback(async (voto) => {
    if (occupato.current) return
    occupato.current = true
    vota(id, voto)
    ultimoVoto.current = Date.now()
    const verso = voto === 'like' ? 1 : -1
    // la bolla parte dove si trova l'icona sulla carta
    const partenzaX = Math.max(-110, Math.min(110, x.get()))
    setBolle((b) => [...b, { chiave: Date.now(), voto, partenzaX }])
    // la carta vola via di lato e la successiva compare subito al suo posto, senza scorrere
    await animate(x, verso * (CARTA.w + 160), { duration: 0.18, ease: 'easeIn' })
    comparsa.set(0)
    setIndice((i) => i + 1)
    animate(comparsa, 1, { duration: 0.16, ease: 'easeOut' })
    occupato.current = false
  }, [id, vota, x, comparsa, CARTA.w])

  const salva = useCallback(async () => {
    if (occupato.current) return
    occupato.current = true
    vota(id, 'da-vedere')
    setSegnalibro(true)
    await new Promise((r) => setTimeout(r, 650))
    await passaA(1)
    occupato.current = false
  }, [id, passaA, vota])

  // Non mi interessa: velo grigio, poi il titolo successivo. Su un titolo già segnato (ritrovato tornando
  // indietro) il tasto toglie il segno e si resta lì: conta solo per le proposte future.
  const nascondi = useCallback(async () => {
    if (occupato.current) return
    if (nonInteressa[id]) { alterna(id, 'non-interessa'); return }
    occupato.current = true
    ultimoVoto.current = Date.now()
    vota(id, 'non-interessa')
    await new Promise((r) => setTimeout(r, 500))
    await animate(comparsa, 0, { duration: 0.18, ease: 'easeIn' })
    setIndice((i) => i + 1)
    animate(comparsa, 1, { duration: 0.16, ease: 'easeOut' })
    occupato.current = false
  }, [id, nonInteressa, vota, alterna, comparsa])

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
      if (e.key === 'ArrowRight' && !girata) dai('like')
      else if (e.key === 'ArrowLeft' && !girata) dai('dislike')
      else if (e.key === 'ArrowDown') scorri(1)
      else if (e.key === 'ArrowUp') scorri(-1)
      else if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setGirata((g) => !g) }
      else if (e.key.toLowerCase() === 'b') salva()
      else if (e.key.toLowerCase() === 'n') nascondi()
    }
    window.addEventListener('keydown', tasto)
    return () => window.removeEventListener('keydown', tasto)
  }, [dai, girata, inPausa, onInterrompi, salva, nascondi, scorri])

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
      {/* Prolungamento: la copertina della carta attiva, sfocata e scurita, su tutto lo schermo */}
      <AnimatePresence initial={false}>
        <motion.img key={id} src={TITOLI[id].poster} alt="" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
          style={{ position: 'absolute', inset: -80, width: 'calc(100% + 160px)', height: 'calc(100% + 160px)', objectFit: 'cover', filter: 'blur(40px)' }} />
      </AnimatePresence>
      <div style={{ position: 'absolute', inset: 0, background: 'var(--velo-scuro)' }} />
      {[-1, 0, 1].map((d) => {
        const tid = titoloA(indice + d)
        if (!tid) return null
        return (
          <Carta key={indice + d} carta={CARTA} t={TITOLI[tid]} attiva={d === 0} offset={d * PASSO_Y} x={x} y={y} comparsa={comparsa}
            girata={d === 0 && girata} segnalibro={d === 0 && segnalibro} nascosta={!!nonInteressa[tid]}
            onTap={() => { if (Date.now() - ultimoVoto.current > 350) setGirata((g) => !g) }} onDragEnd={fineTrascinamento} occupato={occupato} />
        )
      })}

      <AnimatePresence>
        {bolle.map((b) => <Bolla key={b.chiave} {...b} carta={CARTA} onFine={() => setBolle((bb) => bb.filter((x) => x.chiave !== b.chiave))} />)}
      </AnimatePresence>

      <BarraWizard onIndietro={onInterrompi} onSegnalibro={salva} onNascondi={nascondi} daVedere={!!(id && daVedere[id])} nonInteressa={!!nonInteressa[id]} />
    </div>
  )
}

function Carta({ carta: CARTA, t, attiva, offset, x, y, comparsa, girata, segnalibro, nascosta, onTap, onDragEnd, occupato }) {
  const yCarta = useTransform(y, (v) => v + offset)
  const xCarta = useTransform(x, (v) => (attiva ? v : 0))
  const rotate = useTransform(xCarta, [-300, 300], [-12, 12])
  const like = useTransform(xCarta, [0, SOGLIA_X * 1.4], [0, 1])
  const dislike = useTransform(xCarta, [-SOGLIA_X * 1.4, 0], [1, 0])
  const scalaLike = useTransform(like, [0, 1], [0.5, 1])
  const scalaDislike = useTransform(dislike, [0, 1], [0.5, 1])
  // le carte vicine si vedono solo mentre si scorre in verticale
  // la carta attiva compare dopo un voto (comparsa 0 → 1)
  const opacity = useTransform([y, comparsa], ([v, c]) => (attiva ? c : Math.min(1, Math.abs(v) / 80)))
  const scale = useTransform(comparsa, (c) => (attiva ? 0.94 + 0.06 * c : 1))
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
        x: xCarta, y: yCarta, rotate, scale, opacity, zIndex: attiva ? 2 : 1, perspective: 1400, touchAction: 'none', cursor: attiva ? 'grab' : 'default',
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
            {[segnalibro && 'da-vedere', nascosta && 'non-interessa'].filter(Boolean).map((m) => (
              <motion.div key={m} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={riempi}>
                <div style={{ ...riempi, background: VOTI[m].velo }} />
                <motion.div initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 14 }} style={segno}>
                  <SegnoGrande voto={m} />
                </motion.div>
              </motion.div>
            ))}
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

// Segno grande al centro della carta (segnalibro o non mi interessa)
function SegnoGrande({ voto }) {
  const { Icona, colore, vuota } = VOTI[voto]
  return <Icona size={120} color={colore} fill={vuota ? 'none' : colore} style={ombraIcona} />
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

const faccia = { position: 'absolute', inset: 0, borderRadius: 'var(--raggio-carta)', overflow: 'hidden', backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }
const riempi = { position: 'absolute', inset: 0, pointerEvents: 'none' }
const segno = { position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }
const ombraIcona = { filter: 'drop-shadow(0 6px 18px rgba(0,0,0,.45))' }
