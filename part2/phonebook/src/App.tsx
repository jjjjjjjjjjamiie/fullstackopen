import {useEffect, useState} from 'react'
import Filter from "./components/Filter.tsx";
import PersonForm from "./components/PersonForm.tsx";
import Persons from "./components/Persons.tsx";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState({ name: '', number: ''})
  const [nameFilter, setNameFilter] = useState('')

  const baseUrl = 'http://localhost:3001/persons'

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (!newPerson.name.trim()) return window.alert('No name entered')
    if (!newPerson.number.trim()) return window.alert('No number entered')

    if (persons.some(person => person.name === newPerson.name)) {
      return window.alert(`${newPerson.name} is already added to phonebook`)
    }

    if (persons.some(person => person.name === newPerson.name)) {
      return window.alert(`${newPerson.name} is already added to phonebook`)
    }

    setPersons([...persons, {
      id: persons.length + 1,
      name: newPerson.name,
      number: newPerson.number
    }])

    setNewPerson({ name: '', number: ''})
  }

  const handleAddName = (event) => {
  setNewPerson({
    ...newPerson,
    name: event.target.value
  })
  }

  const handleAddNumber = (event) => {
  setNewPerson({
    ...newPerson,
    number: event.target.value
  })
}

  const handleNameFilter = (event) => setNameFilter(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter nameFilter={handleNameFilter}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} handleAddName={handleAddName} handleAddNumber={handleAddNumber} newPerson={newPerson}/>
      <h2>Numbers</h2>
      <Persons persons={persons} nameFilter={nameFilter} />
    </div>
  )
}

export default App