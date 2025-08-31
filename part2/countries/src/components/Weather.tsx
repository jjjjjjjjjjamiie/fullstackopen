import axios from "axios";
import {useEffect, useState} from "react";

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    const apiKey = import.meta.env.VITE_API_KEY
    const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${country.latlng[0]}&lon=${country.latlng[1]}&appid=${apiKey}&units=metric`

    axios
      .get(url)
      .then(response => {
        setWeather(response.data)
        console.log(response.data)
      })
  }, [country.latlng])

  if (!weather) return <p>Loading weather...</p>

  return (
    <>
      <h2>Weather in {country.capital} </h2>
      <p>Temperature {weather.current.temp} °C</p>
      <img src={`https://openweathermap.org/img/wn/${weather.current.weather.icon}@2x.png`}
           alt={weather.current.weather.description}/>
      <p>Wind: {weather.current.wind_speed} m/s</p>
    </>
  )
}

export default Weather