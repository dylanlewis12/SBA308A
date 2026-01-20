// Request interceptor
axios.interceptors.request.use(
  (config) => {
    config.metadata = { startTime: new Date() }; // store timestamp
    console.log("Request started:", config.url); // log request start
    return config;
  },
  (error) => {
    return Promise.reject(error); // pass error along
  }
);

// Response interceptor
axios.interceptors.response.use(
  (response) => {
    const requestTime = new Date() - response.config.metadata.startTime; // duration
    console.log(`Response from ${response.config.url} in ${requestTime} ms`);
    return response; // pass the response to your code
  },
  (error) => {
    if (error.config?.metadata?.startTime) {
      const requestTime = new Date() - error.config.metadata.startTime;
      console.log(
        `Request failed (${error.config.url}) after ${requestTime} ms`
      );
    }
    return Promise.reject(error); // pass error along
  }
);

let allPokemon = []; // Cache all pokemon data

const getAllPokemon = async () => {
    try {
        let response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10000');
        allPokemon = response.data.results;  // Store results in allPokemon
        console.log(`Loaded ${allPokemon.length} pokemon`);
    } catch(error) {
        console.error("Error fetching pokemon list:", error);
    }
};

// A simple debounce function to limit API calls
function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

const searchInput = document.getElementById('search-input');
const suggestionsContainer = document.getElementById('suggestions-container');
const addBtn = document.getElementById('add-btn');

const fetchSuggestions = (query) => {
    if (query.length < 2) {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.classList.remove('active');
        addBtn.classList.add('hidden-btn');
        return;
    }

    // Filter locally from cached data
    const filtered = allPokemon.filter(pokemon => 
        pokemon.name.toLowerCase().startsWith(query.toLowerCase())
    ).slice(0, 10);

    displaySuggestions(filtered);
};

const displaySuggestions = (suggestions) => {
    suggestionsContainer.innerHTML = '';

    if (suggestions && suggestions.length > 0) {
        suggestions.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.name.charAt(0).toUpperCase() + item.name.slice(1);
            
            li.addEventListener('click', async () => {
                try {
                    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${item.name}`);
                    const pokemonData = response.data;
                    
                    const card = createPokemonCard(pokemonData);
                    const container = document.querySelector('.card-container');
                    container.innerHTML = '';
                    container.appendChild(card);

                    searchInput.value = item.name;
                    suggestionsContainer.innerHTML = '';
                    suggestionsContainer.classList.remove('active');
                    addBtn.classList.add('hidden-btn');
                } catch (error) {
                    console.error("Error fetching pokemon details:", error);
                }
            });
            
            suggestionsContainer.appendChild(li);
        });
        suggestionsContainer.classList.add('active');
        addBtn.classList.remove('hidden-btn');
    } else {
        suggestionsContainer.classList.remove('active');
        addBtn.classList.add('hidden-btn');
    }
};

// Create pokemon card function
function createPokemonCard(pokemon) {
    const typeColors = {
        'normal': '#A8A878', 'fire': '#F08030', 'water': '#6890F0',
        'electric': '#F8D030', 'grass': '#78C850', 'ice': '#98D8D8',
        'fighting': '#C03028', 'poison': '#A040A0', 'ground': '#E0C068',
        'flying': '#A890F0', 'psychic': '#F85888', 'bug': '#A8B820',
        'rock': '#B8A038', 'ghost': '#705898', 'dragon': '#7038F8',
        'dark': '#705848', 'steel': '#B8B8D0', 'fairy': '#EE99AC'
    };

    const primaryType = pokemon.types[0].type.name;
    const typeColor = typeColors[primaryType] || '#A8A878';

    const card = document.createElement('div');
    card.className = 'card';
    card.style.background = `linear-gradient(135deg, ${typeColor}EE 0%, ${typeColor}DD 100%)`;
    card.style.borderColor = typeColor;

    const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const pokemonNum = String(pokemon.id).padStart(3, '0');

    const typesBadges = pokemon.types.map(type => {
        const color = typeColors[type.type.name];
        return `<span class="type-badge" style="background-color: ${color};">${type.type.name.toUpperCase()}</span>`;
    }).join('');

    const abilities = pokemon.abilities
        .map(a => `<p class="ability">⭐ ${a.ability.name}</p>`)
        .join('');

    card.innerHTML = `
        <div class="card-header">
            <p id="pokemonName">${pokemonName}</p>
            <p id="pokemonNumber" style="color: ${typeColor};">#${pokemonNum}</p>
        </div>
        
        <div class="card-image">
            <img src="${pokemon.sprites.front_default}" alt="${pokemonName}">
        </div>
        
        <div class="card-types">
            ${typesBadges}
        </div>
        
        <div class="content-container">
            <p><strong>Abilities:</strong></p>
            ${abilities}
        </div>
    `;

    return card;
}

// Add input event listener with debounce
searchInput.addEventListener('input', debounce((e) => {
    fetchSuggestions(e.target.value);
}, 300));

// Load all pokemon on page load
getAllPokemon();