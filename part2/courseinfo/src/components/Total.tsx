const Total = ({parts}) => {
  const total = parts.reduce((s, p) =>{
    return s + p.exercises;
  }, 0)

  return (
    <p><strong>total of {total} exercises</strong></p>
  )
}

export default Total