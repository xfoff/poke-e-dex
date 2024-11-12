# Pokédex Website

Welcome to the **Pokédex** website! This project is a digital encyclopedia for all known Pokémon, providing detailed information such as types, abilities, stats, and more. Designed for both Pokémon fans and developers, this Pokédex is responsive and can be accessed on desktop or mobile devices.

## Table of Contents
- Features
- Technologies
- Screenshots
- Installation
- Usage
- Contributing
- License

## Features

- **Pokémon Search**: Quickly find Pokémon by name or ID.
- **Detailed Pokémon Info**: View type, stats, abilities, evolution chain, and more.
- **Filter by Type**: Sort Pokémon by their elemental type (e.g., Fire, Water, Electric).
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing.
- **Pagination**: Browse Pokémon list with pagination for easy navigation.
- **Random Pokémon Generator**: Discover random Pokémon with a single click.

## Technologies

- **Frontend**: HTML, CSS, JavaScript
- **Frameworks**: React (optional) or vanilla JavaScript
- **API**: [PokéAPI](https://pokeapi.co) for fetching Pokémon data
- **Styling**: CSS3, Flexbox, Grid
- **Deployment**: GitHub Pages / Netlify

## Screenshots

Homepage displaying the Pokémon list and search functionality.

## Installation

To set up and run the Pokédex site locally, follow these steps:

1. **Clone the repository:**
   git clone https://github.com/yourusername/pokedex-site.git
2. **Navigate into the directory:**
   cd pokedex-site
3. **Install dependencies (if using a framework):**
   npm install
4. **Run the development server:**
   npm start

The site should now be running on `http://localhost:3000`.

## Usage

1. **Search Pokémon**: Type a Pokémon's name or ID in the search bar and press enter to view details.
2. **Browse by Type**: Select a type from the filter menu to see only Pokémon of that type.
3. **Random Pokémon**: Click the "Random Pokémon" button to discover a random Pokémon.
4. **View Detailed Info**: Click on any Pokémon in the list to view its stats, evolutions, and abilities.

## API Usage

The Pokédex uses [PokéAPI](https://pokeapi.co) for real-time Pokémon data. No additional setup is required to connect with the API.

Example API call to get a Pokémon’s data:

fetch("https://pokeapi.co/api/v2/pokemon/1")
  .then((response) => response.json())
  .then((data) => console.log(data));

## Contributing

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the project.
2. Create a new branch (`git checkout -b feature/new-feature`).
3. Commit your changes (`git commit -m 'Add a new feature'`).
4. Push to the branch (`git push origin feature/new-feature`).
5. Open a Pull Request.

Please ensure your code follows the style and conventions used in the project.

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

Feel free to reach out with any questions or suggestions! Enjoy using the Pokédex website! 🎉
