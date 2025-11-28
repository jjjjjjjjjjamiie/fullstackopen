import {useDispatch, useSelector} from 'react-redux'
import {increaseVote, createAnecdote} from "./reducers/anecdoteReducer.js";

const App = () => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(state => state)

  const vote = id => dispatch(increaseVote(id))

  const create = event => {
    event.preventDefault()
    const content = event.target.anecdote.value
    console.log('content', content)
    event.target.anecdote.value = ''
    return dispatch(createAnecdote(content));
  }

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
      <h2>create new</h2>
      <form onSubmit={create}>
        <div>
          <input name="anecdote" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default App
