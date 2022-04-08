// Hook Perso
// http://localhost:3000/alone/exercise/02.js

/* eslint-disable no-unused-vars */
import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  fetchMarvel,
  MarvelPersoView,
  MarvelSearchForm,
  ErrorDisplay,
} from '../marvel'
import '../02-styles.css'

const reducer = (state, action) => ({...state, ...action})

function useFindMarvelByName(marvelName) {
  const [state, dispatch] = React.useReducer(reducer, {
    marvel: null,
    error: null,
  })

  React.useEffect(() => {
    if (!marvelName) {
      return
    }
    dispatch({error: null})
    dispatch({marvel: null})

    fetchMarvel(marvelName)
      .then(marvel => dispatch({marvel})) // Ici obligation de mettre entre accolades, contrairement à dans 02.bonus-1.js (car objet ?)
      .catch(error => dispatch({error}))
  }, [marvelName])

  return state // le "state" retourné contient un objet
}

function Marvel({marvelName}) {
  const state = useFindMarvelByName(marvelName)
  const {error, marvel} = state // Déclaration d'un objet car state contient un objet
  if (error) {
    throw error
  }
  return (
    <div>
      {' '}
      {marvel ? <MarvelPersoView marvel={marvel} /> : `Le marvel n'existe pas`}
    </div>
  )
}

function App() {
  const [marvelName, setMarvelName] = React.useState('')
  const handleSearch = name => {
    setMarvelName(name)
  }
  return (
    <div className="marvel-app">
      <MarvelSearchForm marvelName={marvelName} onSearch={handleSearch} />
      <div className="marvel-detail">
        <ErrorBoundary key={marvelName} FallbackComponent={ErrorDisplay}>
          <Marvel marvelName={marvelName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App