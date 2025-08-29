import axios from "axios";
import {useEffect, useState} from "react";
import Countries from "./components/Countries.tsx";
import Filter from "./components/Filter.tsx";

const App = () => {
  const [countries, setCountries] = useState([])
  const [countryFilter, setCountryFilter] = useState('')

  useEffect(() => {
    const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'
    axios
      .get(`${baseUrl}all`)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleCountryFilter = (event) => setCountryFilter(event.target.value)

  return (
    <>
      <Filter countryFilter={handleCountryFilter}/>
      <Countries countries={countries} countryFilter={countryFilter}/>
    </>
  )
}

export default App
