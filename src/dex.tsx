import './dex.css';
import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

const Dex: React.FC = () => {
  const [pokeCount, setPokeCount] = useState<number>(0);
  const [pokeData, setPokeData] = useState<any>([]);
  const [allPokeData, setAllPokeData] = useState<any[]>([]);
  const [currentPokeData, setCurrentPokeData] = useState<any[]>([]);
  const [detailedPokeData, setDetailedPokeData] = useState<any>({})
  const [page, setPage] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const search = (event:ChangeEvent<HTMLInputElement>) => {
    const searched = event.target.value.toLowerCase();
    var newPokeData:any = [];
    switch (searched.split(" ")[0]) {
      case "types:":
        const types = searched.split(":")[1].split(",").map(type => type.trim());
        newPokeData = allPokeData.filter(pokemon => types.every(type => pokemon.types.some((pokeType:any) => pokeType.type.name.toLowerCase().includes(type))))
        break;
        
      case "abilities:":
        const abilities = searched.split(":")[1].split(",").map(ability => ability.trim());
        newPokeData = allPokeData.filter(pokemon => abilities.every(ability => pokemon.abilities.some((pokeAbility:any) => pokeAbility.ability.name.toLowerCase().includes(ability))))
        break;

      case "moves:":
        const moves = searched.split(":")[1].split(",").map(move => move.trim());
        newPokeData = allPokeData.filter(pokemon => moves.every(move => pokemon.moves.some((pokeMove:any) => pokeMove.move.name.toLowerCase().includes(move))))
        break

      case "stats:":
        const statConditions = searched.slice(6).split(",").map(cond => cond.trim().toLowerCase());
        newPokeData = allPokeData.filter(pokemon => statConditions.every(cond => {
          const [_, statName, operator, value] = cond.match(/(\w+)\s*(<|>|=)\s*(\d+)/) || [];
          const stat = pokemon.stats.find((s: any) => s.stat.name.toLowerCase() === statName);
          return stat && (
            operator === "<" ? stat.base_stat < +value :
            operator === ">" ? stat.base_stat > +value :
            operator === "=" ? stat.base_stat === +value : false
          );
        }));
        break;

      default:
        newPokeData = isNaN(parseInt(searched)) ? allPokeData.filter(pokemon => pokemon.name.toLowerCase().includes(searched)) :
                                                  allPokeData.filter(pokemon => pokemon.id == searched)
        break;
    }
    setPage(0);
    setPokeCount(newPokeData.length == 0 ? allPokeData.length : newPokeData.length);
    setPokeData(searched == "" || newPokeData.length == 0 ? allPokeData.slice(0, 35) : newPokeData.slice(0, 35));
    setCurrentPokeData(searched == "" || newPokeData.length == 0 ? allPokeData : newPokeData);
  };

  const fetchPokemon = async() => {
    await axios.get("https://pokeapi.co/api/v2/pokemon?limit=0")
      .then(response => {
        return axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${35}`)
      })
      .then(response => {
        const pokemons:any = response.data.results.map((pokemon:any) => axios.get(pokemon.url))

        Promise.all(pokemons)
          .then(pokemonData => {
            const data = pokemonData.map(pokemon => pokemon.data);
            setPokeData(data.slice(0, 35));
            setAllPokeData(data);
            setCurrentPokeData(data);
            setCompleted(true);
            setPokeCount(data.length);
          });
      })
  }

  const changePage = (by:number) => {
    setPage(prevPage => {
      const newPage = ((prevPage + by) % (Math.floor(pokeCount / 35) + 1) + (Math.floor(pokeCount / 35) + 1)) % (Math.floor(pokeCount / 35) + 1);
      setPokeData(currentPokeData.slice(newPage * 35, newPage * 35 + 35));
      return newPage;
    })
  }

  const showDetails = (pokemon:any) => {
    setDetailedPokeData(pokemon);
  }

  useEffect(() => {
    fetchPokemon();
  }, []);

  return (
    <div className="main">
      <div className="completed" style={{display: completed ? 'none' : 'block'}}>The pokemons are on their way...</div>
      <div className="details" style={{display: Object.keys(detailedPokeData).length != 0 ? 'block' : 'none'}}>
        <button className="close" onClick={() => setDetailedPokeData({})}>X</button>
      </div>
      <div className="search">
        <input type="text" onChange={search} placeholder="Search a pokemon..." style={{display: completed && Object.keys(detailedPokeData).length == 0 ? 'block' : 'none'}}/>
        <button style={{display: completed && Object.keys(detailedPokeData).length == 0 ? 'block' : 'none'}}>?</button>
      </div>
        <div className="cards" style={{display: completed && Object.keys(detailedPokeData).length == 0 ? 'grid' : 'none'}}>
          {pokeData.map((pokemon:any, index:number) => (
            <div key={index} className="card" onClick={() => showDetails(pokemon)}>
              <img src={pokemon.sprites.front_default} alt="could not fetch image"/>
              <p>{pokemon.name}</p>
            </div>
          ))}
        </div>
        <div className="arrows" style={{display: completed && Object.keys(detailedPokeData).length == 0 ? 'flex' : 'none'}}>
          <span onClick={() => changePage(-1)}>{"<"}</span>
          <p>page {page} of {Math.floor(pokeCount / 35)}</p>
          <span onClick={() => {changePage(1)}}>{">"}</span>
        </div>
    </div>
  )
}

export default Dex;
