import { createContext, useContext, useMemo, useState } from 'react'
import { FILTRI_VUOTI } from './data.js'

const Ctx = createContext(null)

// Stato condiviso del prototipo: voti dati (wizard e Scheda titolo) e filtri della Home.
export function StoreProvider({ children }) {
  const [voti, setVoti] = useState({ stranger: 'da-vedere', tlou1: 'da-vedere', ripley: 'da-vedere' })
  const [filtri, setFiltri] = useState(FILTRI_VUOTI)

  const value = useMemo(() => ({
    voti,
    filtri,
    setFiltri,
    vota: (id, voto) => setVoti((v) => ({ ...v, [id]: voto })),
    // Dalla Scheda titolo: toccare di nuovo lo stesso voto lo toglie
    alterna: (id, voto) => setVoti((v) => {
      const n = { ...v }
      if (n[id] === voto) delete n[id]; else n[id] = voto
      return n
    }),
  }), [voti, filtri])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
