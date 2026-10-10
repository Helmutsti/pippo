import { createContext, useContext, useMemo, useState } from 'react'
import { FILTRI_VUOTI } from './data.js'

const Ctx = createContext(null)

// Stato condiviso del prototipo: voti dati (wizard e Scheda titolo), watch list e filtri della Home.
// Il voto (like o dislike, uno esclude l'altro) e "da vedere" sono indipendenti.
export function StoreProvider({ children }) {
  const [voti, setVoti] = useState({})
  const [daVedere, setDaVedere] = useState({ stranger: true, tlou1: true, ripley: true })
  const [filtri, setFiltri] = useState(FILTRI_VUOTI)

  const value = useMemo(() => ({
    voti,
    daVedere,
    filtri,
    setFiltri,
    vota: (id, voto) => {
      if (voto === 'da-vedere') setDaVedere((d) => ({ ...d, [id]: true }))
      else setVoti((v) => ({ ...v, [id]: voto }))
    },
    // Dalla Scheda titolo: toccare di nuovo lo stesso segno lo toglie
    alterna: (id, voto) => {
      const togli = (o) => { const n = { ...o }; if (n[id] === (voto === 'da-vedere' ? true : voto)) delete n[id]; else n[id] = voto === 'da-vedere' ? true : voto; return n }
      if (voto === 'da-vedere') setDaVedere(togli)
      else setVoti(togli)
    },
  }), [voti, daVedere, filtri])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
