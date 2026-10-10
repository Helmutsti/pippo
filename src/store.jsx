import { createContext, useContext, useMemo, useState } from 'react'
import { FILTRI_VUOTI } from './data.js'

const Ctx = createContext(null)

// Stato condiviso del prototipo: voti dati (wizard e Scheda titolo), watch list e filtri della Home.
// Il voto (like o dislike, uno esclude l'altro), "da vedere" e "non mi interessa" sono indipendenti;
// "non mi interessa" ha la precedenza: quei titoli non vengono più proposti (Home, titoli simili, wizard).
export function StoreProvider({ children }) {
  // qualche voto di partenza, per avere una Libreria da sfogliare
  const [voti, setVoti] = useState({ bladerunner: 'like', arrival: 'like', sicario: 'dislike', interstellar: 'like', ripley: 'dislike', bear: 'like' })
  const [daVedere, setDaVedere] = useState({ stranger: true, tlou1: true, ripley: true })
  const [nonInteressa, setNonInteressa] = useState({})
  const [filtri, setFiltri] = useState(FILTRI_VUOTI)

  const value = useMemo(() => ({
    voti,
    daVedere,
    nonInteressa,
    filtri,
    setFiltri,
    vota: (id, voto) => {
      if (voto === 'da-vedere') setDaVedere((d) => ({ ...d, [id]: true }))
      else if (voto === 'non-interessa') setNonInteressa((d) => ({ ...d, [id]: true }))
      else setVoti((v) => ({ ...v, [id]: voto }))
    },
    // Dalla Scheda titolo: toccare di nuovo lo stesso segno lo toglie
    alterna: (id, voto) => {
      const togli = (o) => { const n = { ...o }; if (n[id] === (voto === 'da-vedere' || voto === 'non-interessa' ? true : voto)) delete n[id]; else n[id] = voto === 'da-vedere' || voto === 'non-interessa' ? true : voto; return n }
      if (voto === 'da-vedere') setDaVedere(togli)
      else if (voto === 'non-interessa') setNonInteressa(togli)
      else setVoti(togli)
    },
  }), [voti, daVedere, nonInteressa, filtri])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useStore = () => useContext(Ctx)
