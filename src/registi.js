// Registi del catalogo di prova: foto da Wikipedia (bassa risoluzione, coperte da diritti, solo prototipo interno).
// Numero di film diretti e Oscar vinti scritti a memoria, non verificati: nell'app arriveranno da un database.

const f = (n) => `/img/registi/${n}.jpg`

export const REGISTI = {
  'Christopher Nolan': { foto: f('nolan'), film: 12, oscar: 2 },
  'Denis Villeneuve': { foto: f('villeneuve'), film: 11, oscar: 0 },
  'Rian Johnson': { foto: f('johnson'), film: 7, oscar: 0 },
  Questlove: { foto: f('questlove'), film: 2, oscar: 1 },
  'Matt Reeves': { foto: f('reeves'), film: 6, oscar: 0 },
  'Martin Scorsese': { foto: f('scorsese'), film: 27, oscar: 1 },
  'Luca Guadagnino': { foto: f('guadagnino'), film: 14, oscar: 0 },
  'Lee Unkrich': { foto: f('unkrich'), film: 5, oscar: 2 },
  'Kelsey Mann': { foto: f('mann'), film: 1, oscar: 0 },
  'Joseph Kosinski': { foto: f('kosinski'), film: 6, oscar: 0 },
  'Jordan Peele': { foto: f('peele'), film: 3, oscar: 1 },
  'John Krasinski': { foto: f('krasinski'), film: 5, oscar: 0 },
  'Jimmy Chin': { foto: f('chin'), film: 4, oscar: 1 },
  'Elizabeth Chai Vasarhelyi': { foto: f('vasarhelyi'), film: 5, oscar: 1 },
  'Greta Gerwig': { foto: f('gerwig'), film: 3, oscar: 0 },
  'George Miller': { foto: f('miller'), film: 11, oscar: 1 },
  'Daniel Kwan': { foto: f('kwan'), film: 2, oscar: 3 },
  'Daniel Scheinert': { foto: f('scheinert'), film: 3, oscar: 3 },
  'Damien Chazelle': { foto: f('chazelle'), film: 5, oscar: 1 },
  'Chad Stahelski': { foto: f('stahelski'), film: 4, oscar: 0 },
  'Bong Joon-ho': { foto: f('bong'), film: 8, oscar: 4 },
  'Bob Persichetti': { foto: f('persichetti'), film: 1, oscar: 1 },
  'Peter Ramsey': { foto: f('ramsey'), film: 2, oscar: 1 },
  'Rodney Rothman': { foto: f('rothman'), film: 1, oscar: 1 },
  'Ari Aster': { foto: f('aster'), film: 4, oscar: 0 },
  'Alex Garland': { foto: f('garland'), film: 5, oscar: 0 },
}

// "Daniel Kwan, Daniel Scheinert" → ['Daniel Kwan', 'Daniel Scheinert']
export const nomiRegia = (regia) => (regia ? regia.split(',').map((n) => n.trim()) : [])
