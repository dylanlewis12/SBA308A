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

async function pokemonCarousel() {
    try {
        // Generate a random number between 1 and 1025 (valid Pokémon range)
        let randomNum = Math.floor(Math.random() * 1025) + 1;
        let apiUrl = `https://pokeapi.co/api/v2/pokemon/${randomNum}`;
        let response = await axios.get(apiUrl);

        let result = response.data;

        displayPokemonData(result);

        // Show the next pokemon after 3 seconds
        setTimeout(pokemonCarousel, 3000);
    } catch(error) {
        console.log('Error fetching Pokémon data:', error.message);
        // Retry after 3 seconds even if there's an error
        setTimeout(pokemonCarousel, 3000);
    }
}

function displayPokemonData(pokemon) {
    const pokemonNameElement = document.getElementById('pokemonName');
    const pokemonNumberElement = document.getElementById('pokemonNumber');
    const type1Element = document.getElementById('type1');
    const type2Element = document.getElementById('type2');
    const ability1Element = document.getElementById('ability1');
    const ability2Element = document.getElementById('ability2');
    const cardImage = document.querySelector('.card img');
    const card = document.querySelector('.card');

    // Define type colors
    const typeColors = {
        'normal': '#A8A878', 'fire': '#F08030', 'water': '#6890F0',
        'electric': '#F8D030', 'grass': '#78C850', 'ice': '#98D8D8',
        'fighting': '#C03028', 'poison': '#A040A0', 'ground': '#E0C068',
        'flying': '#A890F0', 'psychic': '#F85888', 'bug': '#A8B820',
        'rock': '#B8A038', 'ghost': '#705898', 'dragon': '#7038F8',
        'dark': '#705848', 'steel': '#B8B8D0', 'fairy': '#EE99AC'
    };

    try {
        // Update name and number
        pokemonNameElement.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        pokemonNumberElement.textContent = `#${String(pokemon.id).padStart(3, '0')}`;

        // Update image
        const imageUrl = pokemon.sprites.front_default;
        if (imageUrl) {
            cardImage.src = imageUrl;
            cardImage.alt = pokemon.name;
        }

        // Update types with colors
        const types = pokemon.types;
        
        if (types.length > 0) {
            const primaryTypeName = types[0].type.name;
            const primaryTypeColor = typeColors[primaryTypeName] || '#A8A878';
            
            // Update type 1 badge
            type1Element.textContent = primaryTypeName.toUpperCase();
            type1Element.style.backgroundColor = primaryTypeColor;
            type1Element.style.display = 'block';
            
            // Update pokemon number color
            pokemonNumberElement.style.color = primaryTypeColor;
            
            // Update card styling - wrap in try/catch
            try {
                if (card) {
                    card.style.background = `linear-gradient(135deg, ${primaryTypeColor}EE 0%, ${primaryTypeColor}DD 100%)`;
                    // And just update the border
                    card.style.borderColor = primaryTypeColor;


                }
            } catch (styleError) {
                console.error('Error updating card style:', styleError);
            }
        }
        
        if (types.length > 1) {
            const secondTypeName = types[1].type.name;
            const secondTypeColor = typeColors[secondTypeName] || '#999';
            type2Element.textContent = secondTypeName.toUpperCase();
            type2Element.style.backgroundColor = secondTypeColor;
            type2Element.style.display = 'block';
        } else {
            type2Element.style.display = 'none';
        }

        // Update abilities
        const abilities = pokemon.abilities;
        if (abilities.length > 0) {
            ability1Element.textContent = abilities[0].ability.name;
        } else {
            ability1Element.textContent = 'None';
        }
        
        if (abilities.length > 1) {
            ability2Element.textContent = abilities[1].ability.name;
        } else {
            ability2Element.textContent = 'None';
        }
    } catch (error) {
        console.error('Error in displayPokemonData:', error);
    }
}
// Start the carousel
pokemonCarousel();