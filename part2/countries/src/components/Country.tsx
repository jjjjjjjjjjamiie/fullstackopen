import Weather from './Weather.tsx'

const Country = ({ country }) => {
  const countryLanguages = Object.values(country.languages)
  return (
      <>
        <h1>{country.name.common}</h1>
        <div>Capital: {country.capital}</div>
        <div>Area: {country.area}</div>

        <h2>Languages</h2>
        <ul>
        {countryLanguages.map((language, index) =>
          <li key={index}>{language}</li>
          )}
      </ul>
      <img src={country.flags.png} />
      {country.capital &&
      <Weather country={country}/>}
    </>
  )
}

export default Country