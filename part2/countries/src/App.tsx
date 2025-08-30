import axios from "axios";
import {useEffect, useState} from "react";
import Countries from "./components/Countries.tsx";

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [details, setDetails] = useState(null)

  useEffect(() => {
    const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'
    axios
      .get(`${baseUrl}all`)
      .then(response =>
        setCountries(response.data)
      )
  }, [])

  const handleFilter = (event) => {
    setFilter(event.target.value);
    setDetails(null)
  }

  const filtered = countries.filter(country =>
    country.name?.common?.toLowerCase().includes(filter.toLowerCase())
  )

  const toggleDetails = (cca3) => {
    setDetails(prevState => (prevState === cca3 ? null : cca3))
  }

  return (
    <>
      <label>
        find countries{' '}
        <input value={filter} onChange={handleFilter}/>
      </label>
      <Countries countries={filtered} details={details} toggleDetails={toggleDetails}/>
    </>
  )
}

export default App
