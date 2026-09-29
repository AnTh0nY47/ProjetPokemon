const URL_API = 'https://tyradex.app/api/v1';

const NB_GENERATIONS = 9;

let listePokemons = [];
let typeChoisi = null;
let triChoisi = 'numero';

const main = document.querySelector('main');
const selectGeneration = document.querySelector('#generation');
const selectTri = document.querySelector('#tri');
const navTypes = document.querySelector('#types');
const compteur = document.querySelector('#compteur');

class Type {
  constructor(data) {
    this.name = data.name;
    this.image = data.image;
    this.color = this.getColorHexa();
  }

  getColorHexa() {
    if (this.name === 'Plante') return '#3d7a6b';
    if (this.name === 'Feu') return '#c0392b';
    if (this.name === 'Eau') return '#2a6fa8';
    if (this.name === 'Electrik') return '#c9a227';
    if (this.name === 'Poison') return '#7b4397';
    if (this.name === 'Insecte') return '#7a8c2b';
    if (this.name === 'Vol') return '#6d7ea8';
    if (this.name === 'Psy') return '#b03a6d';
    if (this.name === 'Roche') return '#8a7a4b';
    if (this.name === 'Sol') return '#a1743b';
    if (this.name === 'Glace') return '#4a9aa5';
    if (this.name === 'Combat') return '#9b3d2e';
    if (this.name === 'Spectre') return '#54497a';
    if (this.name === 'Dragon') return '#4a3fa8';
    if (this.name === 'Acier') return '#6b7b83';
    if (this.name === 'Fée') return '#c46a8c';
    if (this.name === 'Ténèbres') return '#4a3f38';
    if (this.name === 'Normal') return '#8a8a78';
    return '#6b6b6b';
  }

  getBackgroundHexa() {
    return this.color + '66';
  }
}

class Pokemon {
  constructor(data) {
    this.id = data.pokedex_id;
    this.name = data.name.fr;
    this.image = data.sprites.regular;

    this.arrTypes = [];
    for (let i = 0; i < data.types.length; i++) {
      this.arrTypes.push(new Type(data.types[i]));
    }

    this.hp = data.stats.hp;
    this.attack = data.stats.atk;
    this.defense = data.stats.def;
    this.special_attack = data.stats.spe_atk;
    this.speed = data.stats.vit;
  }

  getMainType() {
    return this.arrTypes[0];
  }

  getTypesLabel() {
    let texte = '';
    for (let i = 0; i < this.arrTypes.length; i++) {
      if (i > 0) {
        texte = texte + ' / ';
      }
      texte = texte + this.arrTypes[i].name;
    }
    return texte;
  }

  hasType(name) {
    for (let i = 0; i < this.arrTypes.length; i++) {
      if (this.arrTypes[i].name === name) {
        return true;
      }
    }
    return false;
  }

  getTotalStats() {
    return this.hp + this.attack + this.defense + this.special_attack + this.speed;
  }

  displayCard() {
    const type = this.getMainType();

    const article = document.createElement('article');
    article.style.borderColor = type.color;
    article.style.backgroundColor = type.getBackgroundHexa();

    article.innerHTML = `
      <figure>
        <picture>
          <img src="${this.image}" alt="Image ${this.name}" loading="lazy" />
        </picture>
        <figcaption>
          <span class="types" style="background-color: ${type.color}">${this.getTypesLabel()}</span>
          <h2>${this.name}</h2>
          <ol>
            <li>Points de vie : ${this.hp}</li>
            <li>Attaque : ${this.attack}</li>
            <li>Défense : ${this.defense}</li>
            <li>Attaque spéciale : ${this.special_attack}</li>
            <li>Vitesse : ${this.speed}</li>
          </ol>
        </figcaption>
      </figure>
    `;

    return article;
  }
}

function remplirSelects() {
  let optionsGeneration = '';
  for (let i = 1; i <= NB_GENERATIONS; i++) {
    optionsGeneration = optionsGeneration + '<option value="' + i + '">Génération ' + i + '</option>';
  }
  optionsGeneration = optionsGeneration + '<option value="toutes">Toutes les générations</option>';
  selectGeneration.innerHTML = optionsGeneration;

  selectTri.innerHTML = `
    <option value="numero">Numéro du Pokédex</option>
    <option value="nom">Nom (A vers Z)</option>
    <option value="hp">Points de vie</option>
    <option value="attack">Attaque</option>
    <option value="defense">Défense</option>
    <option value="speed">Vitesse</option>
    <option value="total">Total des statistiques</option>
    <option value="type">Type</option>
  `;
}

function comparer(a, b) {
  if (triChoisi === 'nom') {
    return a.name.localeCompare(b.name);
  }
  if (triChoisi === 'hp') {
    return b.hp - a.hp;
  }
  if (triChoisi === 'attack') {
    return b.attack - a.attack;
  }
  if (triChoisi === 'defense') {
    return b.defense - a.defense;
  }
  if (triChoisi === 'speed') {
    return b.speed - a.speed;
  }
  if (triChoisi === 'total') {
    return b.getTotalStats() - a.getTotalStats();
  }
  if (triChoisi === 'type') {
    return a.getMainType().name.localeCompare(b.getMainType().name);
  }
  return a.id - b.id;
}

function afficherPokemons() {
  let pokemonsAffiches = [];
  for (let i = 0; i < listePokemons.length; i++) {
    const pokemon = listePokemons[i];
    if (typeChoisi === null || pokemon.hasType(typeChoisi)) {
      pokemonsAffiches.push(pokemon);
    }
  }

  pokemonsAffiches.sort(comparer);

  main.innerHTML = '';

  if (pokemonsAffiches.length === 0) {
    main.innerHTML = '<p class="message">Aucun pokémon pour ce filtre.</p>';
  } else {
    for (let i = 0; i < pokemonsAffiches.length; i++) {
      main.appendChild(pokemonsAffiches[i].displayCard());
    }
  }

  compteur.textContent = pokemonsAffiches.length + ' pokémon(s) affiché(s)';
}

function creerBouton(texte, couleur, valeur) {
  let classe = 'bouton-type';
  if (typeChoisi === valeur) {
    classe = classe + ' actif';
  }

  let dataType = valeur;
  if (valeur === null) {
    dataType = '';
  }

  return '<button type="button" class="' + classe + '" data-type="' + dataType + '" style="background-color: ' + couleur + '">' + texte + '</button>';
}

function afficherBoutons() {
  let types = [];
  let nomsDejaVus = [];

  for (let i = 0; i < listePokemons.length; i++) {
    const pokemon = listePokemons[i];
    for (let j = 0; j < pokemon.arrTypes.length; j++) {
      const type = pokemon.arrTypes[j];
      if (!nomsDejaVus.includes(type.name)) {
        nomsDejaVus.push(type.name);
        types.push(type);
      }
    }
  }

  types.sort(function (a, b) {
    return a.name.localeCompare(b.name);
  });

  let html = creerBouton('Tous', '#333', null);
  for (let i = 0; i < types.length; i++) {
    html = html + creerBouton(types[i].name, types[i].color, types[i].name);
  }

  navTypes.innerHTML = html;
}

function chargerGeneration(generation) {
  let url = '';
  if (generation === 'toutes') {
    url = URL_API + '/pokemon';
  } else {
    url = URL_API + '/gen/' + generation;
  }

  main.innerHTML = '<p class="message">Chargement en cours...</p>';
  compteur.textContent = '';

  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (donnees) {
      listePokemons = [];

      for (let i = 0; i < donnees.length; i++) {
        const data = donnees[i];
        if (data.pokedex_id > 0 && data.types !== null && data.stats !== null) {
          listePokemons.push(new Pokemon(data));
        }
      }

      typeChoisi = null;
      afficherBoutons();
      afficherPokemons();
    })
    .catch(function (erreur) {
      console.error(erreur);
      main.innerHTML = '<p class="message">Les pokémons n\'ont pas pu être chargés.</p>';
    });
}

selectGeneration.addEventListener('change', function () {
  chargerGeneration(selectGeneration.value);
});

selectTri.addEventListener('change', function () {
  triChoisi = selectTri.value;
  afficherPokemons();
});

navTypes.addEventListener('click', function (event) {
  const bouton = event.target.closest('button');
  if (bouton === null) {
    return;
  }

  if (bouton.dataset.type === '') {
    typeChoisi = null;
  } else {
    typeChoisi = bouton.dataset.type;
  }

  afficherBoutons();
  afficherPokemons();
});

remplirSelects();
chargerGeneration(selectGeneration.value);
