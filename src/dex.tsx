import './dex.css';
import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

const Dex: React.FC = () => {
  interface PokemonData {
    name: string;
    image: string;
  }

  const [allPokeData, setAllPokeData] = useState<PokemonData[]>([]);
  const [searched, setSearched] = useState<string>('');
  const [pokeCount, setPokeCount] = useState<number>(0);
  const [pokeData, setPokeData] = useState<any>({});

  const inputChange = (event:ChangeEvent<HTMLInputElement>) => {
    setSearched(event.target.value);
  };

  const fetchPokemonCount = async() => {
    await axios.get("https://pokeapi.co/api/v2/pokemon?limit=0")
      .then(response => setPokeCount(response.data.count))
  }

  const fetchPokemonData = async() => {
    await axios.get(`https://pokeapi.co/api/v2/pokemon/${searched}`)
      .then(response => setPokeData(response.data))
  }

  const fetchAllPokemonData = async() => {
    setAllPokeData([]);
    await axios.get("https://pokeapi.co/api/v2/pokemon?limit=35")
      .then(response => {
        const pokemons:any = response.data.results.map((pokemon:any) => axios.get(pokemon.url))

        Promise.all(pokemons)
          .then(pokemonData => pokemonData.map((pokemon:any) => {
            setAllPokeData(prevData => [...prevData, {name: pokemon.data.species.name, image: pokemon.data.sprites.front_default}])
          }))
      })
  }

  useEffect(() => {
    fetchPokemonCount();
    fetchAllPokemonData();
  }, []);

  return (
    <div className="main">
      <input type="text" className="search" onChange={inputChange} onKeyDown={(event) => {if (event.key == 'Enter') fetchPokemonData()}}/>
        <div className="cards">
          {allPokeData.map((pokemon:any, index:number) => (
            <div key={index} className="card">
              <img src={pokemon.image} alt={pokemon.name}/>
              <p>{pokemon.name}</p>
            </div>
          ))}
        </div>
    </div>
  )
}

export default Dex;
