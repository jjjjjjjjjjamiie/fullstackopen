import { useState } from 'react'
import Button from "./components/Button.tsx";
import Statistics from "./components/Statistics.tsx";

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [positive, setPositive] = useState(0)

  const handleGoodClick = () => {
    const updatedGood = good + 1
    const updatedTotal = total + 1
    const updatedPositive = updatedGood / updatedTotal * 100

    setGood(updatedGood)
    setAverage(average + 1)
    setTotal(updatedTotal)
    setPositive(updatedPositive)
  }

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1
    const updatedTotal = total + 1
    const updatedPositive = good / updatedTotal * 100

    setNeutral(updatedNeutral)
    setTotal(updatedTotal)
    setPositive(updatedPositive)
  }

  const handleBadClick = () => {
    const updatedBad = bad + 1
    const updatedTotal = total + 1
    const updatedPositive = good / updatedTotal * 100

    setBad(updatedBad)
    setAverage(average - 1)
    setTotal(updatedTotal)
    setPositive(updatedPositive)
  }

  return (
    <>
      <h1>give feedback</h1>

      <Button onClick={() => handleGoodClick()} text='good'/>
      <Button onClick={() => handleNeutralClick()} text='neutral'/>
      <Button onClick={() => handleBadClick()} text='bad'/>

      <h1>statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} positive={positive}/>
    </>
  )
}

export default App
