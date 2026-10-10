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
- **Home:** il carosello dei suggerimenti si trascina di lato e gira all'infinito; tocco su qualsiasi copertina → Scheda titolo. "Vedi tutto" accanto alle sezioni per ora non porta a niente. "Non sai cosa scegliere?" apre i filtri, che restringono davvero suggerimenti e file. Le copertine aprono la Scheda titolo.
- **Scheda titolo:** cuore, pollice in giù e segnalibro segnano il titolo (toccati di nuovo si tolgono); il segnalibro lo aggiunge a "Dalla tua watch list".
- **Wizard** (bolla con le carte nella barra): trascina a destra = mi è piaciuto, a sinistra = non mi è piaciuto, su = successivo, giù = precedente, tocco = gira la carta. Segnalibro = da vedere. Freccia = conferma per uscire.
- **Tastiera nel wizard:** frecce destra/sinistra (voto), giù/su (successivo/precedente), spazio (gira), B (da vedere), Esc (esci).

Cerca, Libreria e Profilo non sono ancora disegnate: i loro pulsanti nella barra non fanno niente.

## Immagine Docker
Caricando su GitHub una versione (es. `git tag v1.0.0 && git push origin v1.0.0`) parte da sola la pubblicazione dell'immagine su GitHub Container Registry, privata come il repository.
```
docker login ghcr.io
docker run -p 8080:80 ghcr.io/helmutsti/pippo:latest
```
Poi aprire http://localhost:8080.

## Immagini
Copertine e foto da Wikipedia, a bassa risoluzione e coperte da diritti: solo per uso interno. Voti IMDb e durate scritti a memoria, non verificati.
