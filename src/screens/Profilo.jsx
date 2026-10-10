import { motion } from 'framer-motion'
import { ArrowRight, ChevronRight, EyeOff, Settings } from 'lucide-react'
import { TITOLI } from '../data.js'
import { useStore } from '../store.jsx'
import { BarraNavigazione } from '../components/Barra.jsx'

// Profilo: foto, nome e dati al centro, "Modifica" discreto (per ora non fa niente).
// La carta "Scopri nuovi film" apre il wizard (non è più nella barra). Elenco: Non mi interessa, Impostazioni.
// Dati d'esempio; foto da Unsplash (licenza Unsplash).
export default function Profilo({ onHome, onCerca, onLibreria, onWizard, onNascosti }) {
  const { nonInteressa } = useStore()
  const nascosti = Object.keys(nonInteressa).filter((id) => TITOLI[id]).length
  const mazzo = ['bladerunner', 'arrival', 'dune'].map((id) => TITOLI[id].poster)

  return (
    <div className="schermata">
      <div className="scorre">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spazio-gruppo)', padding: 'var(--area-sicura-alto) 0 var(--contenuto-spazio-sotto-barra)' }}>
          <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '0 var(--spazio-pagina)', textAlign: 'center' }}>
            <img src="/img/profilo.jpg" alt="" style={{ width: 112, height: 112, borderRadius: 999, objectFit: 'cover' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <h1 className="t-titolo-pagina">Alex Bianchi</h1>
              <p className="t-corpo c-sec">@alexbianchi</p>
              <p className="t-didascalia c-ter">Milano · su Movinder da ottobre 2026</p>
            </div>
            <button className="pillola t-pillola" disabled>Modifica</button>
          </header>

          {/* spazio in più sopra: le carte escono dal riquadro e non devono toccare "Modifica" */}
          <div style={{ padding: '0 var(--spazio-pagina)', marginTop: 20 }}>
            <motion.button whileTap={{ scale: 0.98 }} className="carta-wizard vetro" onClick={onWizard}>
              <span className="mazzo">
                {mazzo.map((src, i) => <img key={src} src={src} alt="" style={{ transform: `translateX(${[-11, 11, 0][i]}px) rotate(${[-8, 8, 0][i]}deg)` }} />)}
              </span>
              <span style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, textAlign: 'left' }}>
                <span className="t-titolo-sezione">Scopri nuovi film</span>
                <span className="t-didascalia c-sec">Scorri le carte e vota: più voti, consigli migliori.</span>
              </span>
              <span className="freccia-wizard"><ArrowRight size={20} /></span>
            </motion.button>
          </div>

          <nav style={{ padding: '0 var(--spazio-pagina)' }}>
            <button className="voce-profilo" onClick={onNascosti}>
              <EyeOff size={20} /> <span className="t-corpo">Non mi interessa</span>
              {nascosti > 0 && <span className="t-corpo c-ter">{nascosti}</span>}
              <ChevronRight size={20} className="c-ter" />
            </button>
            <button className="voce-profilo" disabled>
              <Settings size={20} /> <span className="t-corpo">Impostazioni</span>
              <ChevronRight size={20} className="c-ter" />
            </button>
          </nav>
        </div>
      </div>
      <BarraNavigazione attiva="profilo" onHome={onHome} onCerca={onCerca} onLibreria={onLibreria} />
    </div>
  )
}
