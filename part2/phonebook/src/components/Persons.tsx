import Person from "./Person.tsx";

const Persons = ({ persons, nameFilter }) => {
  const filter = nameFilter ? nameFilter.toLowerCase() : ''
  const namesToShow = persons.filter(person => {
    return person?.name?.toLowerCase().includes(filter);
  })

  return (
    namesToShow.map(person =>
      <Person key={person.id} person={person}/>
    )
  )
}

export default Persons