import './dex.css';
import { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

const Dex: React.FC = () => {
  const [pokeCount, setPokeCount] = useState<number>(0);
  const [pokeData, setPokeData] = useState<any[]>([]);
  const [allPokeData, setAllPokeData] = useState<any[]>([]);
  const [currentPokeData, setCurrentPokeData] = useState<any[]>([]);
  const [detailedPokeData, setDetailedPokeData] = useState<any>({})
  const [evenMoreDetailedPokeData, setEvenMoreDetailedPokeData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [help, setHelp] = useState<boolean>(false);
  const [details, setDetails] = useState<boolean>(false);

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
        return axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${response.data.count}`)
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

  const showDetails = async(pokemon:any) => {
    const typeUrls = Array.from({length: pokemon.types.length}, (_, i) => `https://pokeapi.co/api/v2/type/${pokemon.types.map((type:any) => type.type.name)[i]}`)
    const typeResults = await Promise.all(typeUrls.map(url => axios.get(url)));

    const weakAgainstUrls = Array.from({length: typeResults.map((result:any) =>
      result.data.damage_relations.double_damage_from.flat().length).reduce((acc:number, val:number) => acc + val, 0)}, (_, i) =>
      `https://pokeapi.co/api/v2/type/${typeResults.map((result:any) => result.data.damage_relations.double_damage_from).flat()[i].name}`)
    const weakAgainstResults = await Promise.all(weakAgainstUrls.map(url => axios.get(url)));

    const strongAgainstUrls = Array.from({length: typeResults.map((result:any) => 
      result.data.damage_relations.double_damage_to.flat().length).reduce((acc:number, val:number) => acc + val, 0)}, (_, i) =>
      `https://pokeapi.co/api/v2/type/${typeResults.map((result:any) => result.data.damage_relations.double_damage_to).flat()[i].name}`)
    const strongAgainstResults = await Promise.all(strongAgainstUrls.map(url => axios.get(url)));

    setEvenMoreDetailedPokeData([typeResults.map(result => result.data), weakAgainstResults.map(result => result.data), strongAgainstResults.map(result => result.data)]);
    setDetailedPokeData(pokemon);
    setDetails(true);
  }

  useEffect(() => {
    fetchPokemon();
  }, []);

  return (
    <div className="main">
      <div className="completed" style={{display: completed ? 'none' : 'block'}}>The pokemons are on their way...</div>
      <div className="help" style={{display: help && !details ? 'block' : 'none'}}>
        <p>Searching for any word will look for a pokemon with such name</p>
        <p className="p">Searching for any number will look for a pokemon with such id</p>
        <p className="p">Searching for <br/> <b>types</b>: <code>type1</code>, <code>type2</code>, ...</p> will search for pokemon with such types
        <p className="p">Searching for <br/> <b>abilities</b>: <code>ability1</code>, <code>ability2</code>, ...</p> will search for pokemon with such ablilities
        <p className="p">Searching for <br/> <b>moves</b>: <code>move1</code>, <code>move2</code>, ...</p> will search for pokemon with such moves
        <p className="p">
          Searching for <br/> <b>Stats</b>: <code>stat1</code> <a>{">"}</a><span style={{fontSize: "8px"}}>/</span><a>{"<"}</a><span style={{fontSize: "8px"}}>/</span><a>=</a> <code>number</code>,<br/>
          <span className="rest"><code>stat2</code> <a>{">"}</a><span style={{fontSize: "8px"}}>/</span><a>{"<"}</a><span style={{fontSize: "8px"}}>/</span><a>=</a> <code>number</code>,</span><br/>
          <span className="rest">...</span><br/>
          <span>will search for pokemon with such stats</span>
        </p>
        <p className="p">Your can click on each pokemon to see detailed data about them</p>
      </div>
      {Object.keys(detailedPokeData).length != 0 ? (
          <div className="details" style={{display: details ? 'block' : 'none'}}>
            <div className="images">
              <img className="img" src={detailedPokeData.sprites.front_default} draggable="false"/>
              <div className="pokeName">
                <span>Name: </span>
                <p>{detailedPokeData.name}</p>
                <span>
                  Types:
                  <div style={{display: 'flex', justifyContent: 'space-around', padding: '4px'}}>
                    {evenMoreDetailedPokeData[0].map((type:any, index:number) => (
                      <img style={{fontSize: '11px'}} key={index} src={type.sprites['generation-iv']['diamond-pearl'].name_icon} alt={type.name} draggable="false"/>
                    ))}
                  </div>
                </span>
              </div>
              <div className="typeWrapper" style={{left: '10px'}}>
                <p style={{fontSize: '10px', marginTop: '5px'}}>Weak against:</p>
                <div className="typeContainer">
                  {evenMoreDetailedPokeData[1].map((type:any, index:number) => (
                    <img key={index} src={type.sprites['generation-iv']['diamond-pearl'].name_icon} alt={type.name} draggable="false"/>
                  ))}
                </div>
              </div>
              <div className="typeWrapper" style={{left: '150px'}}>
                <p style={{fontSize: '10px', marginTop: '5px', textWrap: 'nowrap'}}>Strong against:</p>
                <div className="typeContainer">
                  {evenMoreDetailedPokeData[2].map((type:any, index:number) => (
                    <img key={index} src={type.sprites['generation-iv']['diamond-pearl'].name_icon} alt={type.name} draggable="false"/>
                  ))}
                </div>
              </div>
              <div style={{fontSize: '10px'}} className="pokeStats">Stats:
                <div className="someDiv" style={{padding: '5px'}}>
                  {detailedPokeData.stats.map((stat:any, index:number) => (
                    <div key={index}><span>{stat.stat.name}</span>: <span style={{color: 'green'}}>{stat.base_stat}</span></div>
                  ))}
                </div>
              </div>
              <div style={{fontSize: '10px', top:'395px'}} className="pokeStats">Abilities:
                <div className="someDiv" style={{padding: '5px'}}>
                  {detailedPokeData.abilities.map((ability:any, index:number) => (
                    <div key={index}><span>{ability.ability.name}</span></div>
                  ))}
                </div>
              </div>
            </div>
            <button className="close" onClick={() => setDetails(!details)}><p>X</p></button>
          </div>
        ) : (
          <></>
        )
      }
      <div className="search">
        <input type="text" onChange={search} placeholder="Search a pokemon..." style={{display: completed && !details ? 'block' : 'none'}}/>
        <button style={{display: completed && !details ? 'block' : 'none'}} onClick={() => {setHelp(!help)}}>?</button>
      </div>
        <div className="cards" style={{display: completed && !details ? 'grid' : 'none'}}>
          {pokeData.map((pokemon:any, index:number) => (
            <div key={index} className="card" onClick={() => showDetails(pokemon)}>
              <img src={pokemon.sprites.front_default} alt="could not fetch image" draggable="false"/>
              <p>{pokemon.name}</p>
            </div>
          ))}
        </div>
        <div className="arrows" style={{display: completed && !details ? 'flex' : 'none'}}>
          <span onClick={() => changePage(-1)}>{"<"}</span>
          <p>page {page} of {Math.floor(pokeCount / 35)}</p>
          <span onClick={() => {changePage(1)}}>{">"}</span>
        </div>
    </div>
  )
}

export default Dex;
