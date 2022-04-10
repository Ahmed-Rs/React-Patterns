// Hooks Personnalisés
import * as React from "react";

const myHeader = new Headers({
  headers: {
    // "X-Api-Key": "25835002-2618-40f1-b7ba-05f7e9c0417e",
    // "content-type": "application/json",
    // 'Accept': 'application/json'
  },
});

const init = {
  method: "GET",
  redirect: "follow",
  headers: myHeader,
  // mode: 'cors',
};

function fetchPokemon(pokemonQuery) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonQuery}`;
  return fetch(url, init);
}

const reducer = (state, action) => {
  switch (action.type) {
    case "fetching":
      return { mainData: null, error: null };
    case "done":
      return { mainData: action.payload, error: null };
    case "fail":
      return { mainData: null, error: action.error };
    default:
      throw new Error("Action non supporté");
  }
};

function usePokemonResearcher(pokemonQuery) {
  const [state, dispatch] = React.useReducer(reducer, {
    mainData: null,
    error: null,
  });
  React.useEffect(() => {
    if (!pokemonQuery) {
      return;
    }
    dispatch({ type: "fetching" });
    fetchPokemon(pokemonQuery)
      .then((response) => response.json())
      .then((info) => dispatch({ type: "done", payload: info }))
      .catch((error) => dispatch({ type: "fail", error }));
  }, [pokemonQuery]);

  // if (error) {
  //   throw error;
  //   return null;
  // }

  return state;
}

function PokemonViewer({ pokemonName }) {
  // Ne pas oublier, les accolades pour les props et non pour les simples variables
  const state = usePokemonResearcher(pokemonName);
  const { mainData, error } = state; // C'est dans le .then(dispatch) plus haut que toutes ces variables sont définies
  // const {data, error} = state
  // console.log(pokemonName);
  console.log(mainData);
  // console.log(name);

  if (error) {
    throw error;
  }
  return (
    <div>
      {/* <p>Pokemon Name: {mainData.name}</p>
      <p>Pokemon Abilities: {mainData.ability}</p>
      <div className="pokemon-img">
        <img src={mainData.image} alt="" />
      </div> */}
    </div>
  );
}

class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    const { ErrorDisp } = this.props;
    if (this.state.error) {
      return <ErrorDisp error={this.state.error} />;
    }
    return this.props.children;
  }
}

function ErrorDisplay({ error }) {
  return (
    <div style={{ color: "orange" }}>
      Invalid Pokemon Name
      <pre>Details : {error.message}</pre>
    </div>
  );
}

function PokemonApp() {
  const [pokemonName, setPokemonName] = React.useState("pikachu");

  return (
    <div className="pokemon-section">
      <label htmlFor="" className="pokemon-label">
        Enter Pokemon Name
      </label>
      <input
        className="pokemon-input"
        type="text"
        value={pokemonName}
        onChange={(e) => setPokemonName(e.target.value)}
      />
      <ErrorBoundary key={pokemonName} ErrorDisp={ErrorDisplay}>
        {/* La clé est très importante car permet de réinitialiser l'erreur à chaque frappe, et donc de laisser le fetch se relancer à chaque frappe. Il convient de mettre la valeur pokemonName, et non son setter pour que cela fonctionne */}
        <PokemonViewer pokemonName={pokemonName} />
      </ErrorBoundary>
    </div>
  );
}

export default PokemonApp;
// generalData: info,
// ability: info.abilities.length,
// name: info.name,
// image: info.sprites["front_shiny"],
