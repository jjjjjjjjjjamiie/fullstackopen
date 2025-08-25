const StatisticLine = ({counter, text}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{counter}{text == 'positive' ? '%' : ''}</td>
    </tr>
  )
}

export default StatisticLine