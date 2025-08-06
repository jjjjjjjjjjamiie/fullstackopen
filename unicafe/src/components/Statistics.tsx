import StatisticLine from "./StatisticLine.tsx";

const Statistics = ({good, neutral, bad, total, average, positive}) => {
  if (total === 0) {
    return (
      <p>No feedback given</p>
    )
  }

  return (
    <table>
      <tbody>
      <StatisticLine counter={good} text={'good'}/>
      <StatisticLine counter={neutral} text={'neutral'}/>
      <StatisticLine counter={bad} text={'bad'}/>
      <StatisticLine counter={total} text={'total'}/>
      <StatisticLine counter={average} text={'average'}/>
      <StatisticLine counter={positive} text={'positive'}/>
      </tbody>
    </table>
  )
}

export default Statistics