import {useEffect, useState} from 'react'
import Filter from "./components/Filter.tsx";
import PersonForm from "./components/PersonForm.tsx";
import Persons from "./components/Persons.tsx";
import personService from "./services/persons.ts"

const App = () => {
  const [persons, setPersons] = useState([])
  const [newPerson, setNewPerson] = useState({ name: '', number: ''})
  const [nameFilter, setNameFilter] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    const { name, number } = newPerson

    if (!name.trim()) return window.alert('No name entered')
    if (!number.trim()) return window.alert('No number entered')

    const existingPerson = persons.find(person => person.name === name)
    if (existingPerson) {
      const updateConfirmed = window.confirm(`${existingPerson?.name} is already added to phonebook, replace the old number with a new one?`)
    if (existingPerson && updateConfirmed) {
      personService
        .update(existingPerson.id, { name, number })
        .then(response => {
          setPersons(prevState =>
            prevState.map(person =>
              existingPerson.id === person.id ? response.data : person)
          )
        })
    } else {
      personService
        .create(newPerson)
        .then(response => {
          setPersons(persons.concat(response.data))
        })
    }

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

  const deletePerson = (id) => {
    const person = persons.find(person => person.id === id)
    if (!person) return window.alert(`Person not found`)

    if (window.confirm(`Delete ${person.name}?`)) {
       personService
        .deleteNumber(person.id)
        .then(setPersons(prevState => prevState.filter(p => p.id !== id)))
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter nameFilter={handleNameFilter}/>
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} handleAddName={handleAddName} handleAddNumber={handleAddNumber} newPerson={newPerson}/>
      <h2>Numbers</h2>
      <Persons persons={persons} nameFilter={nameFilter} deletePerson={deletePerson} />
    </div>
  )
}

export default App