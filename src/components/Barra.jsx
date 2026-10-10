import { motion } from 'framer-motion'
import { Bookmark, ChevronLeft, GalleryVerticalEnd, Heart, House, Library, Search, ThumbsDown, User } from 'lucide-react'

const ICONA = { size: 24, strokeWidth: 2 }

const COLORE_VOTO = { like: 'var(--voto-like)', dislike: 'var(--voto-dislike)', 'da-vedere': 'var(--voto-da-vedere)' }

// Barra a bolle: Home · Scheda titolo · Wizard
export function BarraHome({ onCarte }) {
  return (
    <div className="barra">
      <nav className="pillola-barra vetro" aria-label="Navigazione">
        <button className="pulsante-barra attivo" aria-label="Home"><House {...ICONA} /></button>
        {/* Cerca, Libreria e Profilo non sono ancora disegnate */}
        <button className="pulsante-barra" disabled aria-label="Cerca"><Search {...ICONA} /></button>
        <button className="pulsante-barra" disabled aria-label="Libreria"><Library {...ICONA} /></button>
        <button className="pulsante-barra" disabled aria-label="Profilo"><User {...ICONA} /></button>
      </nav>
      <button className="bolla vetro" onClick={onCarte} aria-label="Scopri nuovi film">
        <GalleryVerticalEnd {...ICONA} />
      </button>
    </div>
  )
}

export function BarraScheda({ onIndietro, voto, daVedere, onVoto }) {
  const azioni = [
    ['like', Heart, 'Mi è piaciuto'],
    ['dislike', ThumbsDown, 'Non mi è piaciuto'],
    ['da-vedere', Bookmark, 'Da vedere'],
  ]
  return (
    <div className="barra">
      <button className="bolla vetro" onClick={onIndietro} aria-label="Indietro"><ChevronLeft {...ICONA} /></button>
      <div className="pillola-barra vetro">
        {azioni.map(([chiave, Icona, etichetta]) => {
          const attivo = chiave === 'da-vedere' ? daVedere : voto === chiave
          return (
            <motion.button
              key={chiave}
              className="pulsante-barra"
              aria-label={etichetta}
              aria-pressed={attivo}
              whileTap={{ scale: 0.85 }}
              onClick={() => onVoto(chiave)}
            >
              <motion.span
                key={String(attivo)}
                initial={{ scale: attivo ? 0.4 : 1 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                style={{ display: 'grid' }}
              >
                <Icona {...ICONA} color={attivo ? COLORE_VOTO[chiave] : 'currentColor'} fill={attivo ? COLORE_VOTO[chiave] : 'none'} />
              </motion.span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export function BarraWizard({ onIndietro, onSegnalibro }) {
  return (
    <div className="barra">
      <button className="bolla vetro" onClick={onIndietro} aria-label="Interrompi"><ChevronLeft {...ICONA} /></button>
      <motion.button whileTap={{ scale: 0.9 }} className="bolla vetro" onClick={onSegnalibro} aria-label="Da vedere">
        <Bookmark {...ICONA} />
      </motion.button>
    </div>
  )
}

export { COLORE_VOTO }
