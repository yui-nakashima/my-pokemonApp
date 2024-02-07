import { ProxyAgent } from "proxy-agent";

const agent = new ProxyAgent();

/** ポケモンの取得 */
export const findPokemon = async (name) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
    agent,
  });
  const pokemon = await response.json();
  return pokemon;
};

// export const findPokemon = async (name) => {
//   const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`, {
//     agent,
//   });
//   const pokemon = await response.json();
//   return pokemon;
// };


