import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { StoreProvider } from './store.jsx'
import Home from './screens/Home.jsx'
import Scheda from './screens/Scheda.jsx'
import Wizard from './screens/Wizard.jsx'
import { Conferma, Filtri } from './screens/Pannelli.jsx'

// Navigazione a pila: Home → Scheda titolo (entra da destra) · Home → Wizard (dissolvenza)
export default function App() {
  const [pila, setPila] = useState([{ nome: 'home' }])
  const [pannello, setPannello] = useState(null) // 'filtri' | 'conferma'
  const scrollHome = useRef(null)

  const apri = (schermata) => setPila((p) => [...p, schermata])
  const indietro = () => setPila((p) => (p.length > 1 ? p.slice(0, -1) : p))
  const allaHome = () => { setPannello(null); setPila([{ nome: 'home' }]) }

  return (
    <StoreProvider>
      <div className="stage">
        <div className="telefono">
          <Home
            scrollRef={scrollHome}
            onApri={(id) => apri({ nome: 'scheda', id, chiave: Date.now() })}
            onFiltri={() => setPannello('filtri')}
            onWizard={() => apri({ nome: 'wizard', chiave: Date.now() })}
          />

          <AnimatePresence initial={false}>
            {pila.slice(1).map((s) =>
              s.nome === 'scheda' ? (
                <motion.div key={s.chiave} className="schermata" style={{ zIndex: 5 }}
                  initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                  transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}>
                  <Scheda id={s.id} onIndietro={indietro} onApri={(id) => apri({ nome: 'scheda', id, chiave: Date.now() })} />
                </motion.div>
              ) : (
                <motion.div key={s.chiave} className="schermata" style={{ zIndex: 5 }}
                  initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.3 }}>
                  <Wizard onInterrompi={() => setPannello('conferma')} inPausa={pannello === 'conferma'} />
                </motion.div>
              ),
            )}
          </AnimatePresence>

          <AnimatePresence>
            {pannello === 'filtri' && <Filtri key="filtri" onChiudi={() => setPannello(null)} />}
            {pannello === 'conferma' && <Conferma key="conferma" onContinua={() => setPannello(null)} onInterrompi={allaHome} />}
          </AnimatePresence>
        </div>
      </div>
    </StoreProvider>
  )
}
