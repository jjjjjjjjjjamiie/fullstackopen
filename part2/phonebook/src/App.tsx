import { useState } from 'react'
import Person from "./components/Person.tsx";

const App = () => {
  const [persons, setPersons] = useState([
    {
      id: '1',
      name: 'Arto Hellas',
      number: '39-44-53223523'
    }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

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
      id: String(persons.length + 1),
      name: newName,
      number: newNumber
    }])

    setNewName('')
    setNewNumber('')
  }

  const handleAddName = (event) => setNewName(event.target.value)

  const handleAddNumber = (event) => setNewNumber(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>name: <input value={newName} onChange={handleAddName}/></div>
        <div>number: <input value={newNumber} onChange={handleAddNumber}/></div>
        <div><button type="submit">add</button></div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map(person =>
          <Person key={person.id} person={person}/>
        )}
      </div>
    </div>
  )
}

export default App