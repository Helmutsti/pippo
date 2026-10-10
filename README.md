# Movinder – prototipo

Prototipo navigabile dell'app, fatto con React, Vite e Framer Motion a partire dal file Figma Movinder.
Non è l'app vera: tutti i dati sono di prova e si azzerano ricaricando la pagina.

## Avviarlo
```
npm install
npm run dev
```
Poi aprire l'indirizzo che compare (es. http://localhost:5173). Occupa tutto lo schermo e si adatta al telefono: per provarlo dal telefono, sulla stessa rete, `npm run dev -- --host`. Dal computer conviene la vista telefono degli strumenti per sviluppatori del browser.

## Cosa si può fare
- **Home:** il carosello dei suggerimenti si trascina di lato e gira all'infinito; tocco su qualsiasi copertina → Scheda titolo. Il segnalibro accanto al titolo mette o toglie il suggerimento da "Da vedere". "Vedi tutto" accanto alle sezioni per ora non porta a niente. "Non sai cosa scegliere?" apre i filtri, che restringono davvero suggerimenti e file. Le copertine aprono la Scheda titolo.
- **Scheda titolo:** cuore, pollice in giù e segnalibro segnano il titolo (toccati di nuovo si tolgono); il segnalibro lo aggiunge a "Dalla tua watch list".
- **Wizard** (bolla con le carte nella barra): trascina a destra = mi è piaciuto, a sinistra = non mi è piaciuto, su = successivo, giù = precedente, tocco = gira la carta. Segnalibro = da vedere. Freccia = conferma per uscire.
- **Tastiera nel wizard:** frecce destra/sinistra (voto), giù/su (successivo/precedente), spazio (gira), B (da vedere), Esc (esci).

- **Cerca** (lente nella barra): vetro scuro a tutto schermo con il campo in basso e la tastiera aperta. Si cerca per titolo, attori, regia. I risultati partono dal basso, divisi in "Nella tua libreria" e "Altri titoli"; segnalibro e cuore su ogni riga, tocco sulla riga → Scheda titolo (tornando indietro si ritrova la ricerca). Scorrendo la lista la tastiera si chiude; la x chiude la ricerca.
- **Libreria** (dalla barra): titoli votati o da vedere divisi per lettera come una rubrica; in alto a destra griglia o elenco; pillole Tutti, Piaciuti, Non piaciuti, Da vedere. In Da vedere (elenco) "Visto?" apre pollice in giù e cuore per segnare in fretta cosa hai visto. I titoli "Non mi interessa" non compaiono (avranno una pagina nel Profilo).
- **Risultati** (da "Mostra N titoli" nei filtri).

Community e Profilo non sono ancora disegnate: i loro pulsanti nella barra non fanno niente.

## Immagine Docker
Caricando su GitHub una versione (es. `git tag v1.0.0 && git push origin v1.0.0`) parte da sola la pubblicazione dell'immagine su GitHub Container Registry, privata come il repository.
```
docker login ghcr.io
docker run -p 8080:80 ghcr.io/helmutsti/pippo:latest
```
Poi aprire http://localhost:8080.

## Immagini
Copertine e foto da Wikipedia, a bassa risoluzione e coperte da diritti: solo per uso interno. Voti IMDb e durate scritti a memoria, non verificati.
