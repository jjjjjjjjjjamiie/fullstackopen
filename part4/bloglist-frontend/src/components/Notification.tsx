const Notification = ({message}) => {
  if (message === null) {
    return null
  }

  return (
    <p>
      {message}
    </p>
  )
}

export default Notification