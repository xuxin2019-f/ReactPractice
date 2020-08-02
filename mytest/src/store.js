import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const userRedecers = (state = { name: 'name', age: 18 }, action) => {
  switch (action.type) {
    case 'login':
      return action.payload
    default:
      return state
  }
}
export function asyncLogin(data) {
  return (dispatch) => {
    setTimeout(() => {
      dispatch({ type: 'login', payload: data })
    }, 1000)
  }
}
export const store = createStore(
  combineReducers({ user: userRedecers }),
  applyMiddleware(thunk)
)
