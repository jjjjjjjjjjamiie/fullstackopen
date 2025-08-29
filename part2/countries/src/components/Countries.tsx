import Country from "./Country.tsx";

const Countries = ({ countries, countryFilter }) => {

  const filter = countryFilter ? countryFilter.toLowerCase() : ''
  if (filter === '') return

  const countriesToShow = countries.filter(country => {
    return country?.name?.common?.toLowerCase().includes(filter)
  })

  if (countriesToShow.length > 10) {
    return <div>Too many matches specify another filter</div>
  } else if (countriesToShow.length === 1) {
    return (countriesToShow.map(country =>
      <Country country={country}/>
    ))
  } else {
    return (countriesToShow.map(country =>
      <div>{country.name.common}</div>
    ))
  }
}

export default Countries