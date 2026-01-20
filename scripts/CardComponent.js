export default function (pokemon) {
    // Map pokemon types to their official colors
    const typeColors = {
        'normal': '#A8A878', 'fire': '#F08030', 'water': '#6890F0',
        'electric': '#F8D030', 'grass': '#78C850', 'ice': '#98D8D8',
        'fighting': '#C03028', 'poison': '#A040A0', 'ground': '#E0C068',
        'flying': '#A890F0', 'psychic': '#F85888', 'bug': '#A8B820',
        'rock': '#B8A038', 'ghost': '#705898', 'dragon': '#7038F8',
        'dark': '#705848', 'steel': '#B8B8D0', 'fairy': '#EE99AC'
    };
    
    // Get the primary type and its corresponding color
    const primaryType = pokemon.types[0].type.name;
    const typeColor = typeColors[primaryType];
    
    // Create the card element and apply type-based styling
    const card = document.createElement('div');
    card.className = 'card';
    card.style.background = `linear-gradient(135deg, ${primaryTypeColor}EE 0%, ${primaryTypeColor}DD 100%)`;
    card.style.borderColor = typeColor;
    
    // Format pokemon name (capitalize first letter)
    const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    
    // Format pokedex number with leading zeros (#001, #025, etc)
    const pokemonNum = String(pokemon.id).padStart(3, '0');
    
    // Generate type badges with their respective colors
    const typesBadges = pokemon.types.map(type => {
        const color = typeColors[type.type.name];
        return `<span class="type-badge" style="background-color: ${color};">${type.type.name.toUpperCase()}</span>`;
    }).join('');
    
    // Generate ability list with star icons
    const abilities = pokemon.abilities
        .map(a => `<p class="ability">⭐ ${a.ability.name}</p>`)
        .join('');
    
    // Build the card HTML with all pokemon data
    card.innerHTML = `
        <div class="card-header">
            <p class="pokemonName">${pokemonName}</p>
            <p class="pokemonNumber" style="color: ${typeColor};">#${pokemonNum}</p>
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