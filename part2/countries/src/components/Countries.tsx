import Country from "./Country.tsx";

const Countries = ({ countries, details, toggleDetails }) => {
  if (countries.length === 0) return <div>No matches.</div>
  if (countries.length > 10) return <div>Too many matches, specify another filter.</div>
  if (countries.length === 1) return <Country country={countries[0]}/>

  return (
    countries.map(country => (
      <div>
        {country.name.common} {' '}
        <button onClick={() => toggleDetails(country.cca3)}>{details === country.cca3 ? 'hide' : 'show'}</button>
      {details === country.cca3 && (
        <Country key={country.cca3} country={country}/>
      )}
      </div>
    ))
    )
}

export default Countries