import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { StoreProvider, useStore } from './store.jsx'
import Home from './screens/Home.jsx'
import Libreria from './screens/Libreria.jsx'
import Risultati from './screens/Risultati.jsx'
import Scheda from './screens/Scheda.jsx'
import Cerca from './screens/Cerca.jsx'
import Artista from './screens/Artista.jsx'
import Wizard from './screens/Wizard.jsx'
import { Conferma, Filtri } from './screens/Pannelli.jsx'

export default function App() {
  return (
    <StoreProvider>
      <Navigazione />
    </StoreProvider>
  )
}

// Home e Libreria sono le voci della barra; sopra si impilano Scheda titolo e Risultati (entrano da destra),
// il wizard e Cerca (dissolvenza). Da Cerca si apre la Scheda titolo sopra la ricerca: tornando indietro si ritrova la ricerca.
function Navigazione() {
  const { setFiltri } = useStore()
  const [voce, setVoce] = useState('home') // 'home' | 'libreria'
  const [pila, setPila] = useState([])
  const [pannello, setPannello] = useState(null) // 'filtri' | 'conferma'
  const scrollHome = useRef(null)

  const apri = (schermata) => setPila((p) => [...p, { ...schermata, chiave: Date.now() }])
  const indietro = () => setPila((p) => p.slice(0, -1))
  const allaHome = () => { setPannello(null); setPila([]); setVoce('home') }
  const apriScheda = (id) => apri({ nome: 'scheda', id })
  const apriWizard = () => apri({ nome: 'wizard' })
  const apriCerca = () => apri({ nome: 'cerca' })
  const apriArtista = (persona) => apri({ nome: 'artista', persona })
  // "Mostra N titoli": aggiorna i filtri e apre i Risultati (se non ci si è già)
  const applicaFiltri = (f) => {
    setFiltri(f)
    setPannello(null)
    if (pila.at(-1)?.nome !== 'risultati') apri({ nome: 'risultati' })
  }

  return (
    <div className="telefono">
      {voce === 'home' ? (
        <Home scrollRef={scrollHome} onApri={apriScheda} onFiltri={() => setPannello('filtri')} onWizard={apriWizard} onLibreria={() => setVoce('libreria')} onCerca={apriCerca} />
      ) : (
        <Libreria onApri={apriScheda} onHome={() => setVoce('home')} onWizard={apriWizard} onCerca={apriCerca} />
      )}

      <AnimatePresence initial={false}>
        {pila.map((s) =>
          s.nome === 'cerca' ? (
            <Cerca key={s.chiave} onChiudi={indietro} onApri={apriScheda} />
          ) : s.nome === 'wizard' ? (
            <motion.div key={s.chiave} className="schermata" style={{ zIndex: 5 }}
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}>
              <Wizard onInterrompi={() => setPannello('conferma')} inPausa={pannello === 'conferma'} />
            </motion.div>
          ) : (
            <motion.div key={s.chiave} className="schermata" style={{ zIndex: 5 }}
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}>
              {s.nome === 'scheda'
                ? <Scheda id={s.id} onIndietro={indietro} onApri={apriScheda} onArtista={apriArtista} />
                : s.nome === 'artista'
                ? <Artista nome={s.persona} onIndietro={indietro} onApri={apriScheda} onArtista={apriArtista} />
                : <Risultati onIndietro={indietro} onApri={apriScheda} onModifica={() => setPannello('filtri')} />}
            </motion.div>
          ),
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pannello === 'filtri' && <Filtri key="filtri" onChiudi={() => setPannello(null)} onApplica={applicaFiltri} />}
        {pannello === 'conferma' && <Conferma key="conferma" onContinua={() => setPannello(null)} onInterrompi={allaHome} />}
      </AnimatePresence>
    </div>
  )
}
