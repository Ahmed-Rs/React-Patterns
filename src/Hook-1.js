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

const reducer = (data, action) => ({ ...data, ...action });

function usePokemonResearcher(pokemonQuery) {
  const [data, dispatch] = React.useState(reducer, {
    generalData: { name: null, ability: [], sprites: [] },
    // ability : null,
    // image : null,
    error: null,
  });
  // const [generalData, setGeneralData] = React.useState("");
  // const [ability, setAbility] = React.useState([]);
  // const [image, setImage] = React.useState([]);
  // const [error, setError] = React.useState(null);
  React.useEffect(() => {
    // setError(null); // A éviter car on risque de ne pas récupérer de données.
    if (!pokemonQuery) {
      return;
    }
    fetchPokemon(pokemonQuery)
      .then((response) => {
        return response.json();
      })
      .then((info) => {
        // dispatch({newData : info});
        dispatch({ generalData: info }); // Ne pas confondre le 'data' de setData et le 'data' qui nous est retourné par l'API 
        // dispatch({ability : info.abilities.length});
        dispatch({name : info.name});
        dispatch({image : info.sprites["front_shiny"]});
      })
      .catch((err) => {
        dispatch({ error: err });
      });
  }, [pokemonQuery]);

  // if (error) {
  //   throw error;
  //   return null;
  // }

  return data;
}

function PokemonViewer({ pokemonName }) {
  // Ne pas oublier, les accolades pour les props et non les simples variables
  const state = usePokemonResearcher(pokemonName);
  const { generalData, name, image, error } = state;
  // const {newData, error} = state
  // console.log(pokemonName);
  console.log(generalData);
  console.log(name);

  if (error) {
    throw error;
  }
  return (
    <div>
      <p>
        Pokemon Name: {name}
      </p>
      <div className="pokemon-img">
        <img src={image} alt="" />
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