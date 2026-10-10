import { motion } from 'framer-motion'
import { Bookmark, ChevronLeft, EyeOff, GalleryVerticalEnd, Heart, House, Library, Search, ThumbsDown, User, Users } from 'lucide-react'

const ICONA = { size: 24, strokeWidth: 2 }

const COLORE_VOTO = { like: 'var(--voto-like)', dislike: 'var(--voto-dislike)', 'da-vedere': 'var(--voto-da-vedere)', 'non-interessa': 'var(--voto-non-interessa)' }

// Barra a bolle: Home e Libreria (navigazione) · Scheda titolo · Wizard · Risultati
export function BarraNavigazione({ attiva, onHome, onLibreria, onCarte }) {
  return (
    <div className="barra">
      <nav className="pillola-barra vetro" aria-label="Navigazione">
        <button className={`pulsante-barra${attiva === 'home' ? ' attivo' : ''}`} onClick={onHome} aria-label="Home" aria-current={attiva === 'home'}><House {...ICONA} /></button>
        {/* Cerca, Community e Profilo non sono ancora disegnate */}
        <button className="pulsante-barra" disabled aria-label="Cerca"><Search {...ICONA} /></button>
        <button className={`pulsante-barra${attiva === 'libreria' ? ' attivo' : ''}`} onClick={onLibreria} aria-label="Libreria" aria-current={attiva === 'libreria'}><Library {...ICONA} /></button>
        <button className="pulsante-barra" disabled aria-label="Community"><Users {...ICONA} /></button>
        <button className="pulsante-barra" disabled aria-label="Profilo"><User {...ICONA} /></button>
      </nav>
      <button className="bolla vetro" onClick={onCarte} aria-label="Scopri nuovi film">
        <GalleryVerticalEnd {...ICONA} />
      </button>
    </div>
  )
}

export function BarraIndietro({ onIndietro }) {
  return (
    <div className="barra">
      <button className="bolla vetro" onClick={onIndietro} aria-label="Indietro"><ChevronLeft {...ICONA} /></button>
    </div>
  )
}

export function BarraScheda({ onIndietro, voto, daVedere, nonInteressa, onVoto }) {
  const azioni = [
    ['like', Heart, 'Mi è piaciuto'],
    ['dislike', ThumbsDown, 'Non mi è piaciuto'],
    ['da-vedere', Bookmark, 'Da vedere'],
    ['non-interessa', EyeOff, 'Non mi interessa'],
  ]
  return (
    <div className="barra">
      <button className="bolla vetro" onClick={onIndietro} aria-label="Indietro"><ChevronLeft {...ICONA} /></button>
      <div className="pillola-barra vetro">
        {azioni.map(([chiave, Icona, etichetta]) => {
          const attivo = chiave === 'da-vedere' ? daVedere : chiave === 'non-interessa' ? nonInteressa : voto === chiave
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
                <Icona {...ICONA} color={attivo ? COLORE_VOTO[chiave] : 'currentColor'} fill={attivo && chiave !== 'non-interessa' ? COLORE_VOTO[chiave] : 'none'} />
              </motion.span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

export function BarraWizard({ onIndietro, onSegnalibro, onNascondi, daVedere, nonInteressa }) {
  return (
    <div className="barra">
      <button className="bolla vetro" onClick={onIndietro} aria-label="Interrompi"><ChevronLeft {...ICONA} /></button>
      <div style={{ display: 'flex', gap: 8 }}>
        <motion.button whileTap={{ scale: 0.9 }} className="bolla vetro" onClick={onNascondi} aria-label="Non mi interessa" aria-pressed={!!nonInteressa}>
          <EyeOff {...ICONA} {...(nonInteressa ? { color: COLORE_VOTO['non-interessa'] } : {})} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} className="bolla vetro" onClick={onSegnalibro} aria-label="Da vedere" aria-pressed={!!daVedere}>
          <Bookmark {...ICONA} {...(daVedere ? { color: COLORE_VOTO['da-vedere'], fill: COLORE_VOTO['da-vedere'] } : {})} />
        </motion.button>
      </div>
    </div>
  )
}

export { COLORE_VOTO }
