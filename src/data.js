// Dati di prova: copertine e foto da Wikipedia (bassa risoluzione, coperte da diritti, solo prototipo interno).
// Voti IMDb e durate scritti a memoria, non verificati.

const p = (f) => `/img/poster/${f}`
const a = (f) => `/img/cast/${f}`

export const TITOLI = {
  dune: {
    id: 'dune', titolo: 'Dune – Parte Due', tipo: 'Film', anno: 2024, imdb: '8,5', minuti: 166,
    generi: ['Fantascienza', 'Avventura'], umore: ['Adrenalina', 'Da pensare'],
    regia: 'Denis Villeneuve', piattaforme: ['Netflix', 'Prime Video'], poster: p('dune.jpg'),
    trama: "Paul Atreides si unisce ai Fremen e a Chani per vendicarsi di chi ha distrutto la sua famiglia, mentre deve scegliere tra l'amore della sua vita e il destino dell'universo conosciuto.",
    cast: [
      ['Timothée Chalamet', 'Paul Atreides', 'chalamet.jpg'], ['Zendaya', 'Chani', 'zendaya.jpg'],
      ['Rebecca Ferguson', 'Lady Jessica', 'ferguson.jpg'], ['Javier Bardem', 'Stilgar', 'bardem.jpg'],
      ['Austin Butler', 'Feyd-Rautha', 'butler.jpg'], ['Florence Pugh', 'Principessa Irulan', 'pugh.jpg'],
      ['Josh Brolin', 'Gurney Halleck', 'brolin.jpg'], ['Stellan Skarsgård', 'Barone Harkonnen', 'skarsgard.jpg'],
    ],
    simili: ['bladerunner', 'arrival', 'interstellar', 'sicario'],
  },
  stranger: {
    id: 'stranger', titolo: 'Stranger Things 4', tipo: 'Serie', anno: 2022, imdb: '8,6', minuti: 75,
    generi: ['Fantastico', 'Horror'], umore: ['Adrenalina', 'Horror'],
    ideata: 'Matt e Ross Duffer', piattaforme: ['Netflix'], poster: p('stranger.jpg'),
    trama: 'Sei mesi dopo la battaglia di Starcourt il gruppo si è diviso. A Hawkins emerge una nuova minaccia soprannaturale che potrebbe distruggere il Sottosopra e il mondo reale.',
    cast: [
      ['Millie Bobby Brown', 'Undici', 'brown.png'], ['David Harbour', 'Jim Hopper', 'harbour.jpg'],
      ['Winona Ryder', 'Joyce Byers', 'ryder.jpg'], ['Finn Wolfhard', 'Mike Wheeler', 'wolfhard.png'],
      ['Sadie Sink', 'Max Mayfield', 'sink.jpg'], ['Gaten Matarazzo', 'Dustin Henderson', 'matarazzo.jpg'],
      ['Caleb McLaughlin', 'Lucas Sinclair', 'mclaughlin.png'], ['Noah Schnapp', 'Will Byers', 'schnapp.jpg'],
    ],
    simili: ['tlou1', 'fallout', 'arrival'],
  },
  oppenheimer: {
    id: 'oppenheimer', titolo: 'Oppenheimer', tipo: 'Film', anno: 2023, imdb: '8,3', minuti: 180,
    generi: ['Drammatico'], umore: ['Da pensare'],
    regia: 'Christopher Nolan', piattaforme: ['Prime Video', 'NOW'], poster: p('oppenheimer.jpg'),
    trama: 'La storia di J. Robert Oppenheimer, il fisico che guidò il Progetto Manhattan e cambiò per sempre il mondo con la creazione della bomba atomica.',
    cast: [
      ['Cillian Murphy', 'J. Robert Oppenheimer', 'murphy.jpg'], ['Emily Blunt', 'Kitty Oppenheimer', 'blunt.jpg'],
      ['Matt Damon', 'Leslie Groves', 'damon.jpg'], ['Robert Downey Jr.', 'Lewis Strauss', 'downey.jpg'],
      ['Florence Pugh', 'Jean Tatlock', 'pugh.jpg'], ['Josh Hartnett', 'Ernest Lawrence', 'hartnett.png'],
      ['Kenneth Branagh', 'Niels Bohr', 'branagh.jpg'], ['Rami Malek', 'David L. Hill', 'malek.jpg'],
    ],
    simili: ['dunkirk', 'interstellar', 'prestige', 'inception'],
  },
  interstellar: {
    id: 'interstellar', titolo: 'Interstellar', tipo: 'Film', anno: 2014, imdb: '8,7', minuti: 169,
    generi: ['Fantascienza', 'Avventura'], umore: ['Da pensare'], regia: 'Christopher Nolan',
    piattaforme: ['Prime Video'], poster: p('interstellar.jpg'),
    trama: "Con la Terra ormai al collasso, un gruppo di esploratori attraversa un wormhole per cercare un nuovo pianeta dove l'umanità possa sopravvivere.",
    simili: ['arrival', 'inception', 'dune'],
  },
  arrival: {
    id: 'arrival', titolo: 'Arrival', tipo: 'Film', anno: 2016, imdb: '7,9', minuti: 116,
    generi: ['Fantascienza', 'Drammatico'], umore: ['Da pensare'], regia: 'Denis Villeneuve',
    piattaforme: ['Netflix'], poster: p('arrival.jpg'),
    trama: 'Quando dodici astronavi aliene atterrano sulla Terra, una linguista viene chiamata a trovare un modo per comunicare con i visitatori.',
    simili: ['interstellar', 'bladerunner', 'dune'],
  },
  bladerunner: {
    id: 'bladerunner', titolo: 'Blade Runner 2049', tipo: 'Film', anno: 2017, imdb: '8,0', minuti: 164,
    generi: ['Fantascienza', 'Thriller'], umore: ['Da pensare', 'Adrenalina'], regia: 'Denis Villeneuve',
    piattaforme: ['Netflix', 'NOW'], poster: p('bladerunner.png'),
    trama: 'Trent\'anni dopo il primo film, un nuovo blade runner scopre un segreto che potrebbe far precipitare nel caos ciò che resta della società.',
    simili: ['dune', 'arrival', 'inception'],
  },
  sicario: {
    id: 'sicario', titolo: 'Sicario', tipo: 'Film', anno: 2015, imdb: '7,6', minuti: 121,
    generi: ['Thriller'], umore: ['Adrenalina'], regia: 'Denis Villeneuve',
    piattaforme: ['Prime Video'], poster: p('sicario.jpg'),
    trama: "Un'agente dell'FBI viene coinvolta in una missione segreta contro un cartello della droga al confine tra Stati Uniti e Messico.",
    simili: ['bladerunner', 'dunkirk'],
  },
  dunkirk: {
    id: 'dunkirk', titolo: 'Dunkirk', tipo: 'Film', anno: 2017, imdb: '7,8', minuti: 106,
    generi: ['Drammatico', 'Avventura'], umore: ['Adrenalina'], regia: 'Christopher Nolan',
    piattaforme: ['Netflix'], poster: p('dunkirk.jpg'),
    trama: "1940: centinaia di migliaia di soldati alleati sono intrappolati sulla spiaggia di Dunkerque. La loro salvezza si gioca per terra, per mare e in cielo.",
    simili: ['oppenheimer', 'interstellar'],
  },
  inception: {
    id: 'inception', titolo: 'Inception', tipo: 'Film', anno: 2010, imdb: '8,8', minuti: 148,
    generi: ['Fantascienza', 'Thriller'], umore: ['Adrenalina', 'Da pensare'], regia: 'Christopher Nolan',
    piattaforme: ['Netflix', 'Prime Video'], poster: p('inception.jpg'),
    trama: "Un ladro capace di entrare nei sogni altrui riceve l'incarico più difficile: non rubare un'idea, ma impiantarne una.",
    simili: ['interstellar', 'prestige'],
  },
  prestige: {
    id: 'prestige', titolo: 'The Prestige', tipo: 'Film', anno: 2006, imdb: '8,5', minuti: 130,
    generi: ['Drammatico', 'Thriller'], umore: ['Da pensare'], regia: 'Christopher Nolan',
    piattaforme: ['Disney+'], poster: p('prestige.jpg'),
    trama: "Nella Londra di fine Ottocento due illusionisti rivali si sfidano fino all'ossessione per creare il trucco perfetto.",
    simili: ['inception', 'oppenheimer'],
  },
  ripley: {
    id: 'ripley', titolo: 'Ripley', tipo: 'Serie', anno: 2024, imdb: '8,1', minuti: 55,
    generi: ['Thriller', 'Drammatico'], umore: ['Da pensare'], ideata: 'Steven Zaillian',
    piattaforme: ['Netflix'], poster: p('ripley.jpg'),
    trama: "Nella New York degli anni Sessanta, un truffatore viene mandato in Italia per riportare a casa il figlio di un ricco armatore.",
    simili: ['prestige', 'sicario'],
  },
  fallout: {
    id: 'fallout', titolo: 'Fallout', tipo: 'Serie', anno: 2024, imdb: '8,3', minuti: 60,
    generi: ['Fantascienza', 'Avventura'], umore: ['Adrenalina', 'Spensierato'], ideata: 'Jonathan Nolan e Lisa Joy',
    piattaforme: ['Prime Video'], poster: p('fallout.jpg'),
    trama: "Duecento anni dopo l'apocalisse, una giovane donna lascia il suo rifugio sotterraneo e scopre un mondo in rovina.",
    simili: ['tlou1', 'stranger'],
  },
  tlou1: {
    id: 'tlou1', titolo: 'The Last of Us', tipo: 'Serie', anno: 2023, imdb: '8,7', minuti: 55,
    generi: ['Drammatico', 'Horror'], umore: ['Adrenalina', 'Horror'], ideata: 'Craig Mazin e Neil Druckmann',
    piattaforme: ['NOW'], poster: p('tlou1.png'),
    trama: "Vent'anni dopo una pandemia che ha distrutto la civiltà, un contrabbandiere deve scortare una ragazzina attraverso gli Stati Uniti.",
    simili: ['tlou2', 'fallout', 'stranger'],
  },
  tlou2: {
    id: 'tlou2', titolo: 'The Last of Us – Stagione 2', tipo: 'Serie', anno: 2025, imdb: '7,8', minuti: 55,
    generi: ['Drammatico', 'Horror'], umore: ['Adrenalina', 'Horror'], ideata: 'Craig Mazin e Neil Druckmann',
    piattaforme: ['NOW'], poster: p('tlou2.png'),
    trama: 'Cinque anni dopo gli eventi della prima stagione, Joel ed Ellie vivono a Jackson, finché un conflitto li trascina di nuovo nel pericolo.',
    simili: ['tlou1', 'fallout'],
  },
  bear: {
    id: 'bear', titolo: 'The Bear', tipo: 'Serie', anno: 2022, imdb: '8,5', minuti: 30,
    generi: ['Commedia', 'Drammatico'], umore: ['Spensierato'], ideata: 'Christopher Storer',
    piattaforme: ['Disney+'], poster: p('bear.png'),
    trama: 'Uno chef stellato torna a Chicago per mandare avanti la paninoteca di famiglia, tra debiti, urla e una brigata da rimettere in piedi.',
    simili: ['ripley'],
  },
}

export const cast = (t) => (t.cast || []).map(([nome, personaggio, foto]) => ({ nome, personaggio, foto: a(foto) }))

export const durata = (t) => {
  if (t.tipo === 'Serie') return `${t.minuti} min a episodio`
  const h = Math.floor(t.minuti / 60), m = t.minuti % 60
  return h ? (m ? `${h} h ${m} min` : `${h} h`) : `${m} min`
}

// Home
// i primi 5 che rispettano i filtri
export const SUGGERIMENTI = ['dune', 'oppenheimer', 'interstellar', 'arrival', 'bladerunner', 'fallout', 'bear', 'ripley', 'inception', 'sicario', 'dunkirk', 'prestige', 'tlou2']
export const FILE_HOME = [
  { titolo: 'Simili ai tuoi gusti', ids: ['bladerunner', 'arrival', 'sicario', 'interstellar', 'inception'] },
  { titolo: 'Dalla tua watch list', watchlist: true, ids: ['stranger', 'tlou1', 'ripley'] },
  { titolo: 'Nuovi sulle tue piattaforme', ids: ['fallout', 'tlou2', 'bear'] },
]
export const GENERI = [
  { nome: 'Fantascienza', poster: p('interstellar.jpg') },
  { nome: 'Thriller', poster: p('sicario.jpg') },
  { nome: 'Drammatico', poster: p('oppenheimer.jpg') },
  { nome: 'Commedia', poster: p('bear.png') },
  { nome: 'Fantastico', poster: p('stranger.jpg') },
  { nome: 'Avventura', poster: p('dune.jpg') },
]

// Wizard: titoli da scoprire, uno alla volta
export const WIZARD = ['dune', 'stranger', 'oppenheimer', 'interstellar', 'fallout', 'inception', 'bear', 'sicario', 'ripley', 'dunkirk']

// Filtri
export const FILTRI = {
  cosa: ['Tutto', 'Film', 'Serie'],
  umore: ['Spensierato', 'Adrenalina', 'Da pensare', 'Romantico', 'Horror', 'Fantascienza', 'Commedia', 'Drammatico'],
  tempo: [
    { nome: 'Leggero', etichetta: 'Leggero · < 30 min', da: 0, a: 29 },
    { nome: 'Medio', etichetta: 'Medio · 30–60 min', da: 30, a: 60 },
    { nome: 'Lungo', etichetta: 'Lungo · 60–90 min', da: 61, a: 90 },
    { nome: 'Molto lungo', etichetta: 'Molto lungo · > 90 min', da: 91, a: 9999 },
  ],
  piattaforme: ['Netflix', 'Prime Video', 'Disney+', 'Apple TV+', 'NOW', 'RaiPlay'],
}

export const FILTRI_VUOTI = { cosa: 'Tutto', umore: [], tempo: [], piattaforme: [] }

export function rispettaFiltri(t, f) {
  if (f.cosa !== 'Tutto' && t.tipo !== f.cosa) return false
  if (f.umore.length && !f.umore.some((u) => t.umore.includes(u) || t.generi.includes(u))) return false
  if (f.tempo.length && !f.tempo.some((n) => { const b = FILTRI.tempo.find((x) => x.nome === n); return t.minuti >= b.da && t.minuti <= b.a })) return false
  if (f.piattaforme.length && !f.piattaforme.some((x) => t.piattaforme.includes(x))) return false
  return true
}
