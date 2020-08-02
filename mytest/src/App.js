import React, { useState, useEffect, useContext, useReducer } from 'react'

class Testone extends React.Component {
  constructor() {
    super()
    this.state = {
      count: 0,
    }
  }
  add() {
    this.setState({ count: this.state.count + 1 }, () => {
      console.log(this.state.count)
    })
    this.setState({ count: this.state.count + 1 }, () => {
      console.log(this.state.count)
    })
  }
  render() {
    console.log(this.state.count)
    return (
      <div>
        {this.state.count}
        <button onClick={() => this.add()}>添加</button>
      </div>
    )
  }
}

const fruitReducer = (state, action) => {
  switch (action.type) {
    case 'init':
      return action.payload
    case 'add':
      return [...state, action.payload]
    default:
      return state
  }
}
const Context = React.createContext()
function FruitList({ fruits, onSetFruit }) {
  return (
    <div>
      <ul>
        {fruits.map((f) => (
          <li key={f} onClick={() => onSetFruit(f)}>
            {f}
          </li>
        ))}
      </ul>
    </div>
  )
}
function Hookstest() {
  const [fruit, setFruit] = useState('')
  const [fruits, dispacth] = useReducer(fruitReducer, [])

  useEffect(() => {
    setTimeout(() => {
      dispacth({ type: 'init', payload: ['香蕉', '苹果'] })
    }, 1000)
  }, [])

  useEffect(() => {
    document.title = fruit
  }, [fruit])

  return (
    <Context.Provider value={{ fruits, dispacth }}>
      <div>
        <FruitList fruits={fruits} onSetFruit={setFruit} />
      </div>
    </Context.Provider>
  )
}

export default Hookstest
