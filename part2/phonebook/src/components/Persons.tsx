import Person from "./Person.tsx";

const Persons = ({ persons, nameFilter }) => {
  const namesToShow = persons.filter(person =>
    person.name.toLowerCase().includes(nameFilter.toLowerCase()))

  return (
    namesToShow.map(person =>
      <Person key={person.id} person={person}/>
    )
  )
}

export default Persons