import {useState, useEffect} from 'react'
import Filter from "./components/Filter.tsx";
import PersonForm from "./components/PersonForm.tsx";
import Persons from "./components/Persons.tsx";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (!newName.trim()) {
      return window.alert('No name entered')
    }

    if (!newNumber.trim()) {
      return window.alert('No number entered')
    }

    if (persons.some(person => person.name === newName)) {
      return window.alert(`${newName} is already added to phonebook`)
    }

    setPersons([...persons, {
      id: persons.length + 1,
      name: newName,
      number: newNumber
    }])

    setNewName('')
    setNewNumber('')
  }

  const handleAddName = (event) => setNewName(event.target.value)

  const handleAddNumber = (event) => setNewNumber(event.target.value)

  const handleNameFilter = (event) => setNameFilter(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter nameFilter={handleNameFilter}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} handleAddName={handleAddName} handleAddNumber={handleAddNumber} newName={newName} newNumber={newNumber}/>
      <h2>Numbers</h2>
      <Persons persons={persons} nameFilter={nameFilter}/>
    </div>
  )
}

export default App