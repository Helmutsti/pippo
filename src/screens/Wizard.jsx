import { AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent, useTransform } from 'framer-motion'
import { Bookmark, EyeOff, Heart, ThumbsDown } from 'lucide-react'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { TITOLI, WIZARD } from '../data.js'
import { useStore } from '../store.jsx'
import { FilaCast, Imdb, VeloNascosto } from '../components/Pezzi.jsx'
import { BarraWizard } from '../components/Barra.jsx'
import { useSchermo } from '../schermo.js'

// Wizard per scoprire nuovi titoli.
// Gesti per direzione del dito: destra = mi è piaciuto, sinistra = non mi è piaciuto,
// su = successivo, giù = precedente; tocco = gira la carta. Da tastiera: frecce, spazio, B, N, Esc.
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
const MOLLA = { type: 'spring', stiffness: 320, damping: 34 }
// scorrimento verticale: molla rapida; un gesto nuovo può sempre interromperla
const MOLLA_Y = { type: 'spring', stiffness: 300, damping: 34, restDelta: 0.001 }

const VOTI = {
  like: { Icona: Heart, colore: 'var(--voto-like)', velo: 'var(--voto-like-velo)' },
  dislike: { Icona: ThumbsDown, colore: 'var(--voto-dislike)', velo: 'var(--voto-dislike-velo)' },
  'da-vedere': { Icona: Bookmark, colore: 'var(--voto-da-vedere)', velo: 'var(--voto-da-vedere-velo)' },
  'non-interessa': { Icona: EyeOff, colore: 'var(--voto-non-interessa)', velo: 'var(--voto-non-interessa-velo)', vuota: true },
}

export default function Wizard({ onInterrompi, inPausa }) {
  const { vota, alterna, daVedere, nonInteressa } = useStore()
  // Scorrimento come TikTok: tutto segue un valore continuo, la posizione nel mazzo (0 = primo titolo,
  // 1 = secondo…). Le carte stanno sempre dove dice la posizione, quindi un gesto nuovo può prendere
  // la carta a metà corsa senza aspettare che l'animazione finisca.
  const posizione = useMotionValue(0)
  const meta = useRef(0) // la carta verso cui si sta andando
  const [indice, setIndice] = useState(0) // la carta più vicina al centro
  useMotionValueEvent(posizione, 'change', (v) => setIndice(Math.max(0, Math.round(v))))
  const [girata, setGirata] = useState(false)
  const [bolle, setBolle] = useState([])
  const [segnalibro, setSegnalibro] = useState(false) // velo giallo sulla carta prima di passare oltre
  const occupato = useRef(false) // solo durante voto, segnalibro e "non mi interessa"
  const x = useMotionValue(0)
  const comparsa = useMotionValue(1) // 0 → 1: la carta successiva compare dopo un voto
  const ultimoVoto = useRef(0)
  const gesto = useRef({ asse: null, partenza: 0 })
  const trascinato = useRef(false) // un gesto non è un tocco: non gira la carta
  const schermo = useSchermo()
  const CARTA = misureCarta(schermo)
  // la carta che se ne va esce tutta dallo schermo e quella che arriva parte da fuori
  const PASSO_Y = Math.max(CARTA.y + CARTA.h, schermo.altezza - CARTA.y)

  // Quando cambia carta, la nuova parte dritta e dal fronte
  useLayoutEffect(() => { x.set(0); setGirata(false); setSegnalibro(false) }, [indice, x])

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
  while (cronologia.current.length < indice + 3) cronologia.current.push(prossimo())
  const titoloA = (i) => (i >= 0 ? cronologia.current[i] : undefined)
  const id = titoloA(indice)

  // Va alla carta "dove" (prima del primo titolo non c'è niente)
  const vai = useCallback((dove) => {
    meta.current = Math.max(0, dove)
    animate(posizione, meta.current, MOLLA_Y)
  }, [posizione])
  // Un passo avanti o indietro, contando da dove si sta già andando: premere più volte accumula
  const scorri = useCallback((verso) => {
    const base = posizione.isAnimating() ? meta.current : Math.round(posizione.get())
    vai(base + verso)
  }, [posizione, vai])

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
    meta.current = indice + 1
    posizione.set(indice + 1)
    x.set(0)
    animate(comparsa, 1, { duration: 0.16, ease: 'easeOut' })
    occupato.current = false
  }, [id, indice, vota, x, comparsa, posizione, CARTA.w])

  // Segnalibro: velo giallo, poi la carta scorre in su e arriva la successiva
  const salva = useCallback(async () => {
    if (occupato.current) return
    occupato.current = true
    vota(id, 'da-vedere')
    setSegnalibro(true)
    await new Promise((r) => setTimeout(r, 650))
    occupato.current = false
    scorri(1)
  }, [id, scorri, vota])

  // Non mi interessa: come il segnalibro, col velo grigio. Su un titolo già segnato (ritrovato tornando
  // indietro) il tasto toglie il segno e si resta lì: conta solo per le proposte future.
  const nascondi = useCallback(async () => {
    if (occupato.current) return
    if (nonInteressa[id]) { alterna(id, 'non-interessa'); return }
    occupato.current = true
    ultimoVoto.current = Date.now()
    vota(id, 'non-interessa')
    await new Promise((r) => setTimeout(r, 650))
    occupato.current = false
    scorri(1)
  }, [id, nonInteressa, vota, alterna, scorri])

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

  // Gesti: la direzione si decide all'inizio. Di lato = voto, in verticale = scorrimento.
  // Lo scorrimento prende la carta dove si trova, anche a metà di un'animazione.
  const inizioGesto = (_, info) => {
    trascinato.current = true
    if (girata || occupato.current) { gesto.current.asse = null; return }
    gesto.current.asse = Math.abs(info.offset.x) > Math.abs(info.offset.y) ? 'x' : 'y'
    if (gesto.current.asse === 'y') { posizione.stop(); gesto.current.partenza = posizione.get() }
  }
  const durante = (_, info) => {
    if (gesto.current.asse === 'x') x.set(info.offset.x)
    else if (gesto.current.asse === 'y') {
      const p = gesto.current.partenza - info.offset.y / PASSO_Y
      posizione.set(p < 0 ? p * 0.3 : p) // prima del primo titolo resiste
    }
  }
  const fineGesto = (_, info) => {
    const { asse, partenza } = gesto.current
    gesto.current.asse = null
    if (asse === 'x') {
      if (info.offset.x > SOGLIA_X || info.velocity.x > 700) return dai('like')
      if (info.offset.x < -SOGLIA_X || info.velocity.x < -700) return dai('dislike')
      return animate(x, 0, MOLLA)
    }
    if (asse === 'y') {
      const da = Math.round(partenza)
      const spinta = posizione.get() - da
      // anche un colpetto porta alla carta successiva o precedente, come su TikTok:
      // la carta torna al suo posto solo se il dito si è mosso di pochissimo (meno di 12 px)
      let verso = 0
      if (Math.abs(spinta) * PASSO_Y > 12) verso = Math.sign(spinta)
      else if (Math.abs(info.velocity.y) > 150) verso = -Math.sign(info.velocity.y)
      vai(da + verso)
    }
  }

  return (
    <div className="schermata">
      {/* Prolungamento: la copertina della carta attiva, sfocata e scurita, su tutto lo schermo.
          Gli sfondi della carta precedente e della successiva sono già pronti sotto: al cambio di carta
          si scambia solo l'opacità, senza aspettare che l'immagine si carichi e si sfochi.
          La sfocatura si calcola su un'immagine piccola ingrandita 4 volte: costa molto meno. */}
      {[-1, 0, 1].map((d) => {
        const tid = titoloA(indice + d)
        if (!tid) return null
        return (
          <motion.div key={indice + d} initial={false} animate={{ opacity: d === 0 ? 1 : 0 }} transition={{ duration: 0.25 }}
            style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <img src={TITOLI[tid].poster} alt="" decoding="async"
              style={{ position: 'absolute', left: '-10%', top: '-10%', width: '30%', height: '30%', objectFit: 'cover', filter: 'blur(10px)', transform: 'scale(4)', transformOrigin: 'top left' }} />
          </motion.div>
        )
      })}
      <div style={{ position: 'absolute', inset: 0, background: 'var(--velo-scuro)' }} />
      {nonInteressa[id] && <VeloNascosto icona={null} />}

      {/* Superficie dei gesti: copre lo schermo sopra la barra */}
      <motion.div onPointerDown={() => { trascinato.current = false }} onPanStart={inizioGesto} onPan={durante} onPanEnd={fineGesto}
        style={{ position: 'absolute', inset: 0, touchAction: 'none', cursor: girata ? 'default' : 'grab' }}>
        {[-1, 0, 1, 2].map((d) => {
          const k = indice + d
          const tid = titoloA(k)
          if (!tid) return null
          return (
            <Carta key={k} k={k} carta={CARTA} passo={PASSO_Y} t={TITOLI[tid]} attiva={d === 0} posizione={posizione} x={x} comparsa={comparsa}
              girata={d === 0 && girata} segnalibro={d === 0 && segnalibro} nascosta={!!nonInteressa[tid]}
              onTap={() => { if (!trascinato.current && Date.now() - ultimoVoto.current > 350 && !occupato.current) setGirata((g) => !g) }} />
          )
        })}
      </motion.div>

      <AnimatePresence>
        {bolle.map((b) => <Bolla key={b.chiave} {...b} carta={CARTA} onFine={() => setBolle((bb) => bb.filter((x) => x.chiave !== b.chiave))} />)}
      </AnimatePresence>

      <BarraWizard onIndietro={onInterrompi} onSegnalibro={salva} onNascondi={nascondi} daVedere={!!(id && daVedere[id])} nonInteressa={!!nonInteressa[id]} />
    </div>
  )
}

function Carta({ k, carta: CARTA, passo, t, attiva, posizione, x, comparsa, girata, segnalibro, nascosta, onTap }) {
  // ogni carta sta dove dice la posizione: sopra se è già passata, sotto se deve ancora arrivare
  const yCarta = useTransform(posizione, (p) => (k - p) * passo)
  const xCarta = useTransform(x, (v) => (attiva ? v : 0))
  const rotate = useTransform(xCarta, [-300, 300], [-12, 12])
  const like = useTransform(xCarta, [0, SOGLIA_X * 1.4], [0, 1])
  const dislike = useTransform(xCarta, [-SOGLIA_X * 1.4, 0], [1, 0])
  const scalaLike = useTransform(like, [0, 1], [0.5, 1])
  const scalaDislike = useTransform(dislike, [0, 1], [0.5, 1])
  // la carta attiva compare dopo un voto (comparsa 0 → 1)
  const opacity = useTransform(comparsa, (c) => (attiva ? c : 1))
  const scale = useTransform(comparsa, (c) => (attiva ? 0.94 + 0.06 * c : 1))

  return (
    <motion.div
      onTap={() => { if (attiva) onTap() }}
      style={{
        position: 'absolute', left: CARTA.x, top: CARTA.y, width: CARTA.w, height: CARTA.h,
        x: xCarta, y: yCarta, rotate, scale, opacity, zIndex: attiva ? 2 : 1, perspective: 1400,
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
        {/* Anche il fronte ha la sua rotazione: Safari nasconde il retro di una faccia solo se è trasformata,
            altrimenti il titolo (che sta sopra i veli) si vedrebbe rovesciato a carta girata */}
        <div style={{ ...faccia, transform: 'rotateY(0deg)', background: 'var(--superficie-pannello)', pointerEvents: girata ? 'none' : 'auto' }}>
          <img src={t.poster} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(#0000 55%, #000000d9 100%)' }} />
          {/* il titolo resta sopra i veli: anche sotto il velo grigio si capisce di che film si tratta */}
          <h2 className="t-titolo-carta" style={{ position: 'absolute', left: 20, right: 20, bottom: 20, zIndex: 1, backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>{t.titolo}</h2>

          {/* Velo e segno che seguono il dito */}
          <motion.div style={{ ...riempi, background: VOTI.like.velo, opacity: like }} />
          <motion.div style={{ ...riempi, background: VOTI.dislike.velo, opacity: dislike }} />
          <motion.div style={{ ...segno, opacity: like, scale: scalaLike }}><Heart size={120} color={VOTI.like.colore} fill={VOTI.like.colore} style={ombraIcona} /></motion.div>
          <motion.div style={{ ...segno, opacity: dislike, scale: scalaDislike }}><ThumbsDown size={120} color={VOTI.dislike.colore} fill={VOTI.dislike.colore} style={ombraIcona} /></motion.div>
          <AnimatePresence>
            {[segnalibro && 'da-vedere', nascosta && 'non-interessa'].filter(Boolean).map((m) => (
              <motion.div key={m} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={riempi}>
                {m === 'non-interessa' ? <div className="velo-nascosto" /> : <div style={{ ...riempi, background: VOTI[m].velo }} />}
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
          {nascosta && <VeloNascosto icona={null} />}
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
