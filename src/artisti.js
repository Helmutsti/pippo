// Scheda artista: le persone del mondo dei film (attori, registi, cantanti).
// Per poche persone ci sono i dati completi (nascita, biografia, premi, carriera), scritti a memoria e non verificati;
// per tutte le altre la scheda si costruisce dal catalogo: foto, titoli in cui compaiono, con chi lavorano più spesso.
// Nell'app tutto arriverà da un database.

import { TITOLI, cast } from './data.js'
import { REGISTI, nomiRegia } from './registi.js'

// genere: serve per accordare le parole ("Conosciuta per" / "Conosciuto per"); si scrive solo quando è noto.
// Per le persone senza dati si usano parole neutre.
const DATI = {
  Zendaya: {
    genere: 'f',
    ruoli: 'Attrice · Cantante',
    nascita: 'Nata il 1° settembre 1996 a Oakland (USA)',
    bio: 'Attrice e cantante statunitense. Cresciuta con le serie Disney, è diventata famosa con Euphoria e con i film di Spider-Man, poi con Dune e Challengers.',
    premi: [['2023', 'Golden Globe', 'Miglior attrice in una serie drammatica', 'Euphoria'], ['2022', 'Emmy', 'Miglior attrice protagonista in una serie drammatica', 'Euphoria'], ['2020', 'Emmy', 'Miglior attrice protagonista in una serie drammatica', 'Euphoria']],
    carriera: {
      Attrice: [['2024', 'Challengers', 'Film', 'Tashi Duncan'], ['2024', 'Dune – Parte Due', 'Film', 'Chani'], ['2021', 'Spider-Man: No Way Home', 'Film', 'MJ'], ['2021', 'Dune', 'Film', 'Chani'], ['2019', 'Euphoria', 'Serie', 'Rue Bennett'], ['2017', 'The Greatest Showman', 'Film', 'Anne Wheeler']],
      Cantante: [['2017', 'Rewrite the Stars', 'Brano', 'con Zac Efron'], ['2013', 'Zendaya', 'Album', 'primo album']],
    },
  },
  'Timothée Chalamet': {
    genere: 'm',
    ruoli: 'Attore',
    nascita: 'Nato il 27 dicembre 1995 a New York (USA)',
    bio: 'Attore statunitense. Si è fatto conoscere con Chiamami col tuo nome, che gli è valso la prima candidatura all\'Oscar, e oggi è il volto di Dune e di Wonka.',
    premi: [['2025', 'SAG Award', 'Miglior attore protagonista', 'A Complete Unknown']],
    carriera: {
      Attore: [['2024', 'A Complete Unknown', 'Film', 'Bob Dylan'], ['2024', 'Dune – Parte Due', 'Film', 'Paul Atreides'], ['2023', 'Wonka', 'Film', 'Willy Wonka'], ['2021', 'Dune', 'Film', 'Paul Atreides'], ['2019', 'Piccole donne', 'Film', 'Laurie'], ['2017', 'Chiamami col tuo nome', 'Film', 'Elio Perlman']],
    },
  },
  'Cillian Murphy': {
    genere: 'm',
    ruoli: 'Attore',
    nascita: 'Nato il 25 maggio 1976 a Douglas, Cork (Irlanda)',
    bio: 'Attore irlandese, attore feticcio di Christopher Nolan. Famoso per Peaky Blinders, ha vinto l\'Oscar con Oppenheimer.',
    premi: [['2024', 'Oscar', 'Miglior attore protagonista', 'Oppenheimer'], ['2024', 'Golden Globe', 'Miglior attore in un film drammatico', 'Oppenheimer'], ['2024', 'BAFTA', 'Miglior attore protagonista', 'Oppenheimer']],
    carriera: {
      Attore: [['2023', 'Oppenheimer', 'Film', 'J. Robert Oppenheimer'], ['2017', 'Dunkirk', 'Film', 'Soldato tremante'], ['2013', 'Peaky Blinders', 'Serie', 'Tommy Shelby'], ['2010', 'Inception', 'Film', 'Robert Fischer'], ['2002', '28 giorni dopo', 'Film', 'Jim']],
    },
  },
  'Christopher Nolan': {
    genere: 'm',
    ruoli: 'Regista · Sceneggiatore · Produttore',
    nascita: 'Nato il 30 luglio 1970 a Londra (Regno Unito)',
    bio: 'Regista e sceneggiatore britannico, famoso per film che giocano con il tempo e la memoria. Ha vinto due Oscar con Oppenheimer.',
    premi: [['2024', 'Oscar', 'Miglior film', 'Oppenheimer'], ['2024', 'Oscar', 'Miglior regia', 'Oppenheimer'], ['2024', 'Golden Globe', 'Miglior regia', 'Oppenheimer'], ['2024', 'BAFTA', 'Miglior film', 'Oppenheimer'], ['2024', 'BAFTA', 'Miglior regia', 'Oppenheimer']],
    carriera: {
      Regista: [['2023', 'Oppenheimer', 'Film', ''], ['2020', 'Tenet', 'Film', ''], ['2017', 'Dunkirk', 'Film', ''], ['2014', 'Interstellar', 'Film', ''], ['2010', 'Inception', 'Film', ''], ['2008', 'Il cavaliere oscuro', 'Film', ''], ['2006', 'The Prestige', 'Film', ''], ['2000', 'Memento', 'Film', '']],
    },
  },
  'Denis Villeneuve': {
    genere: 'm',
    ruoli: 'Regista · Sceneggiatore',
    nascita: 'Nato il 3 ottobre 1967 a Gentilly, Québec (Canada)',
    bio: 'Regista canadese. Dai thriller come Prisoners e Sicario è passato alla grande fantascienza con Arrival, Blade Runner 2049 e Dune.',
    premi: [],
    carriera: {
      Regista: [['2024', 'Dune – Parte Due', 'Film', ''], ['2021', 'Dune', 'Film', ''], ['2017', 'Blade Runner 2049', 'Film', ''], ['2016', 'Arrival', 'Film', ''], ['2015', 'Sicario', 'Film', ''], ['2013', 'Prisoners', 'Film', ''], ['2010', 'La donna che canta', 'Film', '']],
    },
  },
}

const semplice = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const perTitolo = Object.fromEntries(Object.values(TITOLI).map((t) => [semplice(t.titolo), t.id]))

// tutte le persone di un titolo: il cast e chi l'ha diretto
const personeDi = (t) => [...cast(t).map((p) => p.nome), ...nomiRegia(t.regia)]

export function fotoDi(nome) {
  if (REGISTI[nome]) return REGISTI[nome].foto
  for (const t of Object.values(TITOLI)) {
    const p = cast(t).find((x) => x.nome === nome)
    if (p) return p.foto
  }
  return null
}

export function artista(nome) {
  const titoli = Object.values(TITOLI)
  const recita = titoli.filter((t) => cast(t).some((p) => p.nome === nome))
  const dirige = titoli.filter((t) => nomiRegia(t.regia).includes(nome))
  const dati = DATI[nome]

  // carriera: dai dati completi, oppure dal catalogo; i titoli del catalogo si aprono
  const riga = ([anno, titolo, tipo, ruolo]) => ({ anno, titolo, tipo, ruolo, id: perTitolo[semplice(titolo)] })
  const carriera = dati
    ? Object.entries(dati.carriera).map(([gruppo, righe]) => [gruppo, righe.map(riga)])
    : [
        ['Recitazione', recita.map((t) => ({ anno: String(t.anno), titolo: t.titolo, tipo: t.tipo, ruolo: cast(t).find((p) => p.nome === nome).personaggio, id: t.id }))],
        ['Regia', dirige.map((t) => ({ anno: String(t.anno), titolo: t.titolo, tipo: t.tipo, ruolo: '', id: t.id }))],
      ]
        .filter(([, r]) => r.length)
        .map(([g, r]) => [g, r.sort((a, b) => b.anno - a.anno)])

  // con chi lavora più spesso: le persone che compaiono negli stessi titoli
  const insieme = {}
  for (const t of [...recita, ...dirige]) for (const p of personeDi(t)) if (p !== nome) insieme[p] = (insieme[p] || 0) + 1
  const colleghi = Object.entries(insieme).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([n, volte]) => ({ nome: n, volte, foto: fotoDi(n) }))

  // premi: solo quelli vinti, contati per nome
  const conteggio = {}
  for (const [, premio] of dati?.premi || []) conteggio[premio] = (conteggio[premio] || 0) + 1

  const ruoliCatalogo = [recita.length && 'Recitazione', dirige.length && 'Regia'].filter(Boolean).join(' · ')
  return {
    nome,
    foto: fotoDi(nome),
    ruoli: dati?.ruoli || ruoliCatalogo,
    nascita: dati?.nascita,
    // titolo della fila dei titoli più noti, accordato solo se il genere è noto
    titoloNoti: dati?.genere === 'f' ? 'Conosciuta per' : dati?.genere === 'm' ? 'Conosciuto per' : 'Titoli più noti',
    bio: dati?.bio,
    premi: dati?.premi || [],
    conteggio: Object.entries(conteggio).sort((a, b) => b[1] - a[1]),
    conosciutaPer: [...new Set([...recita, ...dirige])].sort((a, b) => parseFloat(b.imdb.replace(',', '.')) - parseFloat(a.imdb.replace(',', '.'))).map((t) => t.id),
    colleghi,
    carriera,
  }
}
