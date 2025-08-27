import {useState} from 'react'
import Filter from "./components/Filter.tsx";
import PersonForm from "./components/PersonForm.tsx";
import Persons from "./components/Persons.tsx";

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [nameFilter, setNameFilter] = useState('')

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