import { useState } from 'react'
import Person from "./components/Person.tsx";

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

  const addName = (event) => {
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

  const namesToShow = persons.filter(p =>
    p.name.toLowerCase().includes(nameFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <div>filter shown with <input onChange={handleNameFilter}/></div>

      <h2>add a new</h2>
      <form onSubmit={addName}>
        <div>name: <input value={newName} onChange={handleAddName}/></div>
        <div>number: <input value={newNumber} onChange={handleAddNumber}/></div>
        <div><button type="submit">add</button></div>
      </form>
      <h2>Numbers</h2>
      <div>
        {namesToShow.map(person =>
          <Person key={person.id} person={person}/>
        )}
      </div>
    </div>
  )
}

export default App