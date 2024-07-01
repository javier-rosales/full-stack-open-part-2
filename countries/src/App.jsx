import { useState, useEffect } from 'react'
import countryService from './services/countries'

const Country = ({country}) => {
  return (
    <div>
      <h3>{country.name.common}</h3>
      <p>
        Capital: {country.capital[0]}
      </p>
      <p>
        Area: {country.area}
      </p>
      <div>
        Languages:
        <ul>
          {
            Object.keys(country.languages)
              .map(key =>
                <li key={key}>
                  {country.languages[key]}
                </li>
              )
          }
        </ul>
      </div>
      <img
        src={country.flags.png}
        alt={country.flags.alt}
      />
    </div>
  )
}

const SearchResult = ({countries, onAutoComplete}) => {
  if (!countries) {
    return null
  }

  const countriesCount = countries.length

  if (countriesCount === 0) {
    return (
      <div>
        No results
      </div>
    )
  }

  if (countriesCount === 1) {
    return (
      <Country country={countries[0]} />
    )
  }

  if (countriesCount <= 10) {
    return (
      <ul>
        {countries.map(country => {
          const countryName = country.name.common

          return (
            <li key={countryName}>
              {countryName}
              <button
                onClick={() =>
                  onAutoComplete(countryName)
                }
              >
                Show
              </button>
            </li>
          )
        }
        )}
      </ul>
    )
  }

  if (countriesCount > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
}

const App = () => {
  const [value, setValue] = useState("")
  const [countries, setCountries] = useState(null)
  const [filteredCountries, setFilteredCountries] = useState(null)
  
  useEffect(() => {
    countryService
      .getAll()
      .then(countries => {
        setCountries(countries)
      })
  }, [])

  const searchCountry = event => {
    event.preventDefault()
  }

  const getResult = input => {
    setValue(input)

    if (input.length > 0) {
      setFilteredCountries(
        countries.filter(country => {
          const countryName = country.name.common.toLowerCase()
          return countryName.includes(input.toLowerCase())
        })
      )
    } else {
      setFilteredCountries(null)
    }
  }

  return (
    <>
      <form onSubmit={searchCountry}>
        <label htmlFor="input">Find country</label>
        <input
          id="input"
          value={value}
          onChange={e => getResult(e.target.value)}
        />
      </form>
      <SearchResult
        countries={filteredCountries}
        onAutoComplete={getResult}
      />
    </>
  )
}

export default App
