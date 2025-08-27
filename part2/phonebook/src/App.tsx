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
  const [newPerson, setNewPerson] = useState({ name: '', number: ''})
  const [nameFilter, setNameFilter] = useState('')

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