const reducirDataPokemon = (data) => {
  let newArray = [];
  for (let infoPokemon of data) {
    let reducedInfoPokemon = {
      id: infoPokemon.id,
      num: infoPokemon.num,
      name: infoPokemon.name,
      img: infoPokemon.img,
      type: infoPokemon.type,
      multipliers: infoPokemon.multipliers,
      avgSpawns: infoPokemon.avg_spawns,
      weaknesses: infoPokemon.weaknesses,
      egg: infoPokemon.egg,
      spawnTime: infoPokemon.spawn_time,
      candy: infoPokemon.candy,
      candyCount: infoPokemon.candy_count,
      weight: infoPokemon.weight,
      height: infoPokemon.height
    };
    newArray.push(reducedInfoPokemon);
  }
  return newArray;
};
