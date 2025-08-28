import Person from "./Person.tsx";

const Persons = ({ persons, nameFilter, deletePerson }) => {
  const filter = nameFilter ? nameFilter.toLowerCase() : ''
  const namesToShow = persons.filter(person => {
    return person?.name?.toLowerCase().includes(filter);
  })

  return (
    namesToShow.map(person =>
      <Person key={person.id} person={person} deletePerson={() => deletePerson(person.id)}/>
    )
  )
}

export default Persons