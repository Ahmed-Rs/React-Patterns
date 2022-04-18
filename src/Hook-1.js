// Hooks Personnalisés
import * as React from "react";
// POKEMON RESEARCHER

const themes = {
  light: {
    backgroundColor: "silver",
    color: "black",
  },

  dark: {
    // li: { background: "#222222", color: "white" },
    // background: "#222222",
    backgroundColor: "rgb(125, 125, 125)",
    color: "white",
  },
};

const ThemeContext = React.createContext(themes);

const myHeader = new Headers({
  headers: {},
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
    const promise = callback();
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
  const myCallback = React.useCallback(() => {
    if (!pokemonQuery) {
      return;
    }
    return fetchPokemon(pokemonQuery);
  }, [pokemonQuery]);
  return useFetchData(myCallback);
}

function PokemonViewer({ pokemonName }) {
  const state = usePokemonResearcher(pokemonName);
  const { mainData, error, status } = state;
  console.log(mainData);

  if (status === "fail") {
    throw new Error(`Le Pokemon ${pokemonName} n'existe pas`);
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

function PokemonSearchForm({ onSearch }) {
  const [name, setName] = React.useState("pikachu");
  const theme = React.useContext(ThemeContext);
  return (
    <>
      <label htmlFor="" className="pokemon-label">
        Enter Pokemon Name
      </label>
      <input // Sortir les input dans un composant à part permet de résoudre le porblème des relancement du composant principal à chaque frappe.
        className="pokemon-input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="button"
        className="pokemon-btn-submit"
        value="Search"
        onClick={() => onSearch(name)} // Faire attention à ne rien mettre entre les premières parenthèses.
        style={{ backgroundColor: theme.backgroundColor, color: theme.color }}
      />
    </>
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
  const handleSearch = (name) => {
    setPokemonName(name);
  };

  return (
    <div className="pokemon-section">
      <ThemeContext.Provider value={themes.dark}>
        <PokemonSearchForm onSearch={handleSearch} />
        <ErrorBoundary key={pokemonName} ErrorDisp={ErrorDisplay}>
          <PokemonViewer pokemonName={pokemonName} />
        </ErrorBoundary>
      </ThemeContext.Provider>
    </div>
  );
}

export default PokemonApp;
