import { useEffect, useState } from 'react'

// Misure dello schermo del telefono, aggiornate quando cambiano (rotazione, barra del browser)
export function useSchermo() {
  const leggi = () => ({ larghezza: window.innerWidth, altezza: window.innerHeight })
  const [schermo, setSchermo] = useState(leggi)
  useEffect(() => {
    const aggiorna = () => setSchermo(leggi())
    window.addEventListener('resize', aggiorna)
    return () => window.removeEventListener('resize', aggiorna)
  }, [])
  return schermo
}
