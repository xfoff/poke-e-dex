import './dex.css';
import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

const Dex: React.FC = () => {
  const [pokeCount, setPokeCount] = useState<number>(0);
  const [pokeData, setPokeData] = useState<any>([]);
  const [allPokeData, setAllPokeData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);

  const search = (event:ChangeEvent<HTMLInputElement>) => {
    const searched = event.target.value;
    setPokeData(allPokeData.filter(pokemon => pokemon.name.toLowerCase() == searched));
  };

  const fetchPokemonCount = async() => {
    await axios.get("https://pokeapi.co/api/v2/pokemon?limit=0")
      .then(response => {
        const count = response.data.count
        setPokeCount(count)
        return axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${count}`)
      })
      .then(response => {
        const pokemons:any = response.data.results.map((pokemon:any) => axios.get(pokemon.url))

        Promise.all(pokemons)
          .then(pokemonData => {
            const data = pokemonData.map(pokemon => pokemon.data);
            setPokeData(data.slice(0, 35));
            setAllPokeData(data);
            setCompleted(true);
          });
      })
  }

  const changePage = (by:number) => {
    setPage(prevPage => {
      const newPage = ((prevPage + by) % (Math.round(pokeCount / 35) + 1) + (Math.round(pokeCount / 35) + 1)) % (Math.round(pokeCount / 35) + 1);
      setPokeData(allPokeData.slice(newPage * 35, newPage * 35 + 35));
      return newPage;
    })
  }

  const rotateCard = (event:any, index:number) => {
    const card = document.getElementById(`${index}`);
    if (card) {
      const rect = card.getBoundingClientRect();
      const rotateY = Math.round((event.clientX - (rect.left + rect.width / 2)) / 2);
      const rotateX = Math.round(-(event.clientY - (rect.top + rect.height / 2)) / 2);

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
  }

  const resetCardRotation = (index:number) => {
    const card = document.getElementById(`${index}`);
    if (card) card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }

  useEffect(() => {
    fetchPokemonCount();
  }, []);

  return (
    <div className="main">
      <div className="completed" style={completed ? {display: 'none'} : {display: 'block'}}>The pokemons are on their way...</div>
      <div className="search">
        <input type="text" onChange={search} placeholder="Search a pokemon..." style={completed ? {display: 'block'} : {display: 'none'}}/>
        <button style={completed ? {display: 'block'} : {display: 'none'}}>?</button>
      </div>
        <div className="cards">
          {pokeData.map((pokemon:any, index:number) => (
            <div id={`${index}`} key={index} className="card" onMouseMove={(event) => rotateCard(event, index)} onMouseLeave={() => resetCardRotation(index)}>
              <img src={pokemon.sprites.front_default} alt="could not fetch image"/>
              <p>{pokemon.name}</p>
            </div>
          ))}
        </div>
        <div className="arrows" style={completed ? {display: 'flex'} : {display: 'none'}}>
          <span onClick={() => changePage(-1)}>{"<"}</span>
          <p>page {page} of {Math.round(pokeCount / 35)}</p>
          <span onClick={() => {changePage(1)}}>{">"}</span>
        </div>
    </div>
  )
}

export default Dex;
