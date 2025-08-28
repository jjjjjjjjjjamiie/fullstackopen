const Person = ({ person, deletePerson }) => {
  return (
    <div>
      {person.name} {person.number} <button type="button" onClick={deletePerson}>delete</button>
    </div>
  )
}

export default Person