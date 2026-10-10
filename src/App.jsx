import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { StoreProvider, useStore } from './store.jsx'
import Home from './screens/Home.jsx'
import Libreria from './screens/Libreria.jsx'
import Risultati from './screens/Risultati.jsx'
import Scheda from './screens/Scheda.jsx'
import Cerca from './screens/Cerca.jsx'
import Artista from './screens/Artista.jsx'
import VediTutto from './screens/VediTutto.jsx'
import Profilo from './screens/Profilo.jsx'
import NonMiInteressa from './screens/NonMiInteressa.jsx'
import Wizard from './screens/Wizard.jsx'
import { Conferma, Filtri } from './screens/Pannelli.jsx'

export default function App() {
  return (
    <StoreProvider>
      <Navigazione />
    </StoreProvider>
  )
}

// Home, Libreria e Profilo sono le voci della barra; il wizard si apre dal Profilo e, interrotto, riporta dove si era; sopra si impilano Scheda titolo e Risultati (entrano da destra),
// il wizard e Cerca (dissolvenza). Da Cerca si apre la Scheda titolo sopra la ricerca: tornando indietro si ritrova la ricerca.
function Navigazione() {
  const { setFiltri } = useStore()
  const [voce, setVoce] = useState('home') // 'home' | 'libreria' | 'profilo'
  const [pila, setPila] = useState([])
  const [pannello, setPannello] = useState(null) // 'filtri' | 'conferma'
  const scrollHome = useRef(null)

  const apri = (schermata) => setPila((p) => [...p, { ...schermata, chiave: Date.now() }])
  const indietro = () => setPila((p) => p.slice(0, -1))
  // interrompere il wizard lo chiude e si torna alla schermata da cui era partito
  const chiudiWizard = () => { setPannello(null); setPila((p) => p.filter((s) => s.nome !== 'wizard')) }
  const apriScheda = (id) => apri({ nome: 'scheda', id })
  const apriWizard = () => apri({ nome: 'wizard' })
  const apriCerca = () => apri({ nome: 'cerca' })
  const apriArtista = (persona) => apri({ nome: 'artista', persona })
  // "Vedi tutto": { titolo, tipo: 'titoli' | 'persone' | 'generi', ids?, persone? }
  const apriTutti = (cosa) => apri({ nome: 'tutti', cosa })
  // "Mostra N titoli": aggiorna i filtri e apre i Risultati (se non ci si è già)
  const applicaFiltri = (f) => {
    setFiltri(f)
    setPannello(null)
    if (pila.at(-1)?.nome !== 'risultati') apri({ nome: 'risultati' })
  }

  return (
    <div className="telefono">
      {voce === 'home' ? (
        <Home scrollRef={scrollHome} onApri={apriScheda} onFiltri={() => setPannello('filtri')} onLibreria={() => setVoce('libreria')} onProfilo={() => setVoce('profilo')} onCerca={apriCerca} onVediTutto={apriTutti} />
      ) : voce === 'libreria' ? (
        <Libreria onApri={apriScheda} onHome={() => setVoce('home')} onProfilo={() => setVoce('profilo')} onCerca={apriCerca} />
      ) : (
        <Profilo onHome={() => setVoce('home')} onLibreria={() => setVoce('libreria')} onCerca={apriCerca} onWizard={apriWizard} onNascosti={() => apri({ nome: 'nascosti' })} />
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
                ? <Scheda id={s.id} onIndietro={indietro} onApri={apriScheda} onArtista={apriArtista} onVediTutto={apriTutti} />
                : s.nome === 'artista'
                ? <Artista nome={s.persona} onIndietro={indietro} onApri={apriScheda} onArtista={apriArtista} onVediTutto={apriTutti} />
                : s.nome === 'nascosti'
                ? <NonMiInteressa onIndietro={indietro} onApri={apriScheda} />
                : s.nome === 'tutti'
                ? <VediTutto {...s.cosa} onIndietro={indietro} onApri={apriScheda} onArtista={apriArtista} />
                : <Risultati onIndietro={indietro} onApri={apriScheda} onModifica={() => setPannello('filtri')} />}
            </motion.div>
          ),
        )}
      </AnimatePresence>

      <AnimatePresence>
        {pannello === 'filtri' && <Filtri key="filtri" onChiudi={() => setPannello(null)} onApplica={applicaFiltri} />}
        {pannello === 'conferma' && <Conferma key="conferma" onContinua={() => setPannello(null)} onInterrompi={chiudiWizard} />}
      </AnimatePresence>
    </div>
  )
}
