import { motion } from 'framer-motion'
import { Bookmark, Heart, Search, X } from 'lucide-react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { TITOLI } from '../data.js'
import { useStore } from '../store.jsx'
import { COLORE_VOTO } from '../components/Barra.jsx'
import { VeloNascosto } from '../components/Pezzi.jsx'

// Cerca: vetro scuro a tutto schermo sopra la pagina in cui si è. Il campo sta in basso (sopra la tastiera),
// i risultati partono dal basso, vicino al campo, divisi in "Nella tua libreria" e "Altri titoli".
// Appena si scorre la lista la tastiera si chiude. Chiusa con la x si torna dov'eri, con i segni aggiornati.

// minuscole e senza accenti, così "pokemon" trova "Pokémon"
const semplice = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// si cerca nel titolo, negli attori e in chi l'ha diretto o ideato
const testoDi = (t) => semplice([t.titolo, t.regia, t.ideata, ...(t.cast || []).map((c) => c[0])].filter(Boolean).join(' | '))

// L'area visibile sopra la tastiera: sul telefono la tastiera copre la parte bassa dello schermo
function useAreaVisibile() {
  const leggi = () => {
    const v = window.visualViewport
    return v ? { alto: v.offsetTop, altezza: v.height } : { alto: 0, altezza: window.innerHeight }
  }
  const [area, setArea] = useState(leggi)
  useEffect(() => {
    const v = window.visualViewport
    const aggiorna = () => setArea(leggi())
    const su = v || window
    su.addEventListener('resize', aggiorna)
    v?.addEventListener('scroll', aggiorna)
    return () => { su.removeEventListener('resize', aggiorna); v?.removeEventListener('scroll', aggiorna) }
  }, [])
  return area
}

export default function Cerca({ onChiudi, onApri }) {
  const { voti, daVedere, nonInteressa } = useStore()
  const [testo, setTesto] = useState('')
  const campo = useRef(null)
  const lista = useRef(null)
  const area = useAreaVisibile()

  const cercato = semplice(testo.trim())
  // I gruppi si fanno quando cambia il testo: toccando cuore o segnalibro la riga resta al suo posto
  const gruppi = useMemo(() => {
    if (!cercato) return null
    const trovati = Object.values(TITOLI)
      .filter((t) => testoDi(t).includes(cercato))
      .sort((a, b) => a.titolo.localeCompare(b.titolo, 'it'))
    const inLibreria = (t) => voti[t.id] || daVedere[t.id] || nonInteressa[t.id]
    return [
      ['Nella tua libreria', trovati.filter(inLibreria)],
      ['Altri titoli', trovati.filter((t) => !inLibreria(t))],
    ].filter(([, titoli]) => titoli.length)
  }, [cercato]) // eslint-disable-line react-hooks/exhaustive-deps

  // la lista parte dal basso: a ogni nuova ricerca si mostra la parte vicina al campo
  useLayoutEffect(() => {
    if (lista.current) lista.current.scrollTop = lista.current.scrollHeight
  }, [gruppi, area.altezza])

  const chiudiTastiera = () => campo.current?.blur()

  return (
    <motion.div
      className="cerca"
      style={{ top: area.alto, height: area.altezza }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div ref={lista} className="cerca-lista" onTouchMove={chiudiTastiera} onWheel={chiudiTastiera}>
        <div className="cerca-gruppi">
          {gruppi && !gruppi.length && <p className="t-etichetta c-ter">Nessun titolo per "{testo.trim()}"</p>}
          {gruppi?.map(([nome, titoli]) => (
            <section key={nome} className="cerca-gruppo">
              <h2 className="t-etichetta c-ter">{nome} · {titoli.length}</h2>
              {titoli.map((t) => <Risultato key={t.id} t={t} onApri={onApri} />)}
            </section>
          ))}
        </div>
      </div>

      <div className="cerca-campo">
        <label className="campo-ricerca vetro">
          <Search size={20} strokeWidth={2} />
          <input
            ref={campo}
            className="t-corpo"
            type="search"
            enterKeyHint="search"
            autoFocus
            autoComplete="off"
            placeholder="Film, serie, attori…"
            value={testo}
            onChange={(e) => setTesto(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') chiudiTastiera() }}
          />
        </label>
        <motion.button whileTap={{ scale: 0.9 }} className="bolla-piccola vetro" style={{ width: 44, height: 44 }} onClick={onChiudi} aria-label="Chiudi la ricerca">
          <X size={20} strokeWidth={2} />
        </motion.button>
      </div>
    </motion.div>
  )
}

function Risultato({ t, onApri }) {
  const { voti, daVedere, nonInteressa, alterna } = useStore()
  const segni = [
    ['da-vedere', Bookmark, 'Da vedere', !!daVedere[t.id]],
    ['like', Heart, 'Mi è piaciuto', voti[t.id] === 'like'],
  ]
  return (
    <div className="risultato" role="button" tabIndex={0} onClick={() => onApri(t.id)}>
      <div className="risultato-copertina">
        <img src={t.poster} alt="" />
        {nonInteressa[t.id] && <VeloNascosto icona={16} />}
      </div>
      <div className="risultato-testi">
        <span className="t-pulsante">{t.titolo}</span>
        <span className="t-didascalia c-sec">{t.anno} · {t.tipo} · {t.generi[0]}</span>
      </div>
      {segni.map(([chiave, Icona, etichetta, attivo]) => (
        <motion.button
          key={chiave}
          whileTap={{ scale: 0.85 }}
          className="bolla-piccola vetro"
          aria-label={etichetta}
          aria-pressed={attivo}
          onClick={(e) => { e.stopPropagation(); alterna(t.id, chiave) }}
        >
          <Icona size={20} strokeWidth={2} {...(attivo ? { color: COLORE_VOTO[chiave], fill: COLORE_VOTO[chiave] } : {})} />
        </motion.button>
      ))}
    </div>
  )
}
