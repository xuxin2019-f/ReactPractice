// import React from 'react'
import React, { Component } from './kreact'
// import ReactDOM from 'react-dom'
import ReactDOM from './kreact-dom'
import './index.css'
import CMTList from './CmtList'
import Context from './Context'
import * as serviceWorker from './serviceWorker'
import Test from './Test'
import Inputparent from './Inputparent'
import HocTest from './HocTest'
import KFormlist from './KFormlist'
import Optimization from './Optimization'
import UseCallback from './UseCallback'
import Ref from './Ref'

//ReactDOM.render(<CMTList />, document.getElementById('root'));
// ReactDOM.render(<Context/>, document.getElementById('root'));
// ReactDOM.render(
//   <Test header={<div>头部</div>} num={2}>
//     子内容
//   </Test>,
//   document.getElementById('root')
// )
// ReactDOM.render(<Inputparent />, document.getElementById('root'))
// ReactDOM.render(<HocTest />, document.getElementById('root'))
// ReactDOM.render(<KFormlist />, document.getElementById('root'))
// ReactDOM.render(<Optimization />, document.getElementById('root'))
// ReactDOM.render(<UseCallback />, document.getElementById('root'))
// ReactDOM.render(<Ref />, document.getElementById('root'))
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

function Comp(props) {
  return <h2>{props.name}</h2>
}
class Comp2 extends Component {
  render() {
    return <h2>xxxx</h2>
  }
}
const jsx = (
  <div id="demo">
    <span>hi</span>
    <Comp name="text"></Comp>
    <Comp2></Comp2>
  </div>
)
console.log(jsx)
ReactDOM.render(jsx, document.getElementById('root'))
