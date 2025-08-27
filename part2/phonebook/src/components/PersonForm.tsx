const PersonForm = ({ addPerson, newPerson, handleAddName, handleAddNumber }) => {
  return (
    <form onSubmit={addPerson}>
      <div>name: <input value={newPerson.name} onChange={handleAddName}/></div>
      <div>number: <input value={newPerson.number} onChange={handleAddNumber}/></div>
      <div><button type="submit">add</button></div>
    </form>
  )
}

export default PersonForm