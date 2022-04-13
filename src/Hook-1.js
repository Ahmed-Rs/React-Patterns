// Hooks Personnalisés
import * as React from "react";
// POKEMON RESEARCHER

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
  mode: "cors",
};

function fetchPokemon(pokemonQuery) {
  const url = `https://pokeapi.co/api/v2/pokemon/${pokemonQuery}`;
  return fetch(url, init);
}

const reducer = (data, action) => {
  switch (action.type) {
    case "fetching":
      return { status: "fetching", mainData: {}, error: null };
    case "done":
      return { status: "done", mainData: action.payload, error: null };
    case "fail":
      return { status: "fail", mainData: {}, error: action.error };
    default:
      throw new Error("Action non supporté");
  }
};

function useFetchData(callback) {
  const [data, dispatch] = React.useReducer(reducer, {
    mainData: {},
    error: null,
    status: "idle",
  });
  React.useEffect(() => {
    const promise = callback()
    if (!promise) {
      return;
    }
    dispatch({ type: "fetching" });

    promise
      .then((response) => response.json())
      .then((info) => dispatch({ type: "done", payload: info }))
      .catch((error) => dispatch({ type: "fail", payload: error }));
  }, [callback]);

  return data;
}

function usePokemonResearcher(pokemonQuery) {
  const myCallback = React.useCallback(()=> {
    if (!pokemonQuery) {
      return
    }
    return fetchPokemon(pokemonQuery)
  }, [pokemonQuery])
  return useFetchData(myCallback);
}

function PokemonViewer({ pokemonName }) {
  // Ne pas oublier, les accolades pour les props et non pour les simples variables
  const state = usePokemonResearcher(pokemonName);
  const { mainData, error, status } = state; // C'est dans le .then(dispatch) plus haut que toutes ces variables sont définies
  console.log(mainData);

  if (status === "fail") {
    throw error;
  } else if (status === "idle") {
    return "Saisissez un nom Pokemon";
  } else if (status === "fetching") {
    return "Chargement en cours ...";
  } else if (status === "done") {
    return (
      <>
        {mainData ? (
          <PokemonPersoView mainDataViewer={mainData} />
        ) : (
          `Le Pokemon n'existe pas`
        )}
      </>
    );
  }
}

function PokemonPersoView({ mainDataViewer }) {
  return (
    <div className="pokemon-capsule">
      <div className="pokemon-description">
        <p className="pokemon-description-name">
          Pokemon Name:
          <br /> {mainDataViewer.name}
        </p>{" "}
        {/* On a réussi à accéder aux données de l'Objet mainDataViewer et donc mainData, en initialisant à {} au lieu de null. Ou alors on initialise à null et on utilise mainDataViewer?.name, ainsi nous évitons d'obtenir une erreur de console, car il faut savoir que le composant se render d'abord puis, le contenu du useEffect() s'exécute */}
        <p className="pokemon-description-experience">
          Base-Experience:
          <br /> {mainDataViewer.base_experience}
        </p>
        <p className="pokemon-description-abilities">
          Abilities:
          <br />{" "}
          {mainDataViewer.abilities
            ? mainDataViewer.abilities.length
            : `null`}{" "}
          {/* Usage d'un ternaire pour 'donner le temps' au composant d'afficher les valeurs chargées par useEffect() */}
        </p>
        <p className="pokemon-description-weight">
          Weight:
          <br /> {mainDataViewer.weight}
        </p>
      </div>
      <div className="pokemon-img">
        <img src={mainDataViewer.sprites?.front_shiny} alt="" />
      </div>
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
      Invalid Pokemon Query
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
