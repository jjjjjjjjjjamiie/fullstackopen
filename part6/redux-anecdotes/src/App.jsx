import {useDispatch, useSelector} from 'react-redux'
import {increaseVote} from "./reducers/anecdoteReducer.js";
import AnecdoteForm from "./components/AnecdoteForm.jsx";

const App = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state)

  const vote = id => dispatch(increaseVote(id))

  return (
    <div>
      <h2>Anecdotes</h2>
      {[...anecdotes].sort((a, b) => b.votes - a.votes).map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      <AnecdoteForm />
    </div>
  )
}

export default App
