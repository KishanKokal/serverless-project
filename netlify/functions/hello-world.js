const axios = require("axios");

exports.handler = async () => {
  const POKE_API = "https://pokeapi.co/api/v2/pokedex/kanto";
  const { data } = await axios.get(POKE_API);
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello, World!", pokemon: data }),
  };
};
