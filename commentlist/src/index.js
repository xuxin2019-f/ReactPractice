import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import CMTList from './CmtList'
import Context from './Context'
import * as serviceWorker from './serviceWorker'
import Test from './Test'
import Inputparent from './Inputparent'
import HocTest from './HocTest'
import KFormlist from './KFormlist'

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
ReactDOM.render(<KFormlist />, document.getElementById('root'))
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
