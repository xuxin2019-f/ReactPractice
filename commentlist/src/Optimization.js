import React, { Component, PureComponent, useEffect } from 'react'
// import { is } from 'immutable'
export default class Parent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      parentInfo: [{ name: '哈哈哈' }],
    }
  }
  changeParentInfo = () => {
    let temp = this.state.parentInfo
    temp[0].name = '呵呵呵：' + new Date().getTime()
    this.setState(
      {
        parentInfo: temp,
      },
      () => {
        this.ChildRef.updateChild()
      }
    )
  }

  render() {
    console.log('parent render')
    return (
      <div>
        <h1>父组件</h1>
        <button onClick={this.changeParentInfo}>改变父组件state</button>
        <br />
        <Child
          ref={(Child) => (this.ChildRef = Child)}
          parentInfo={this.state.parentInfo}
        ></Child>
      </div>
    )
  }
}
//用原生shouldComponentUpdate，
//如果不加这个生命周期判断，父组件渲染，无论子组件的props和state是否变化，子组件都会重新渲染
// class Child extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       cnum: 0,
//     }
//   }
//   shouldComponentUpdate(nextprops, nextstate) {
//     if (nextprops.pnum === this.props.pnum) {
//       return false
//     }
//     return true
//   }
//   render() {
//     console.log('child render')
//     return <div>{this.props.pnum[0].num}</div>
//   }
// }

//用pureComponent
class Child extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      cnum: 0,
    }
  }
  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     !(this.props === nextProps || is(this.props, nextProps)) ||
  //     !(this.state === nextState || is(this.state, nextState))
  //   )
  // }
  updateChild() {
    this.forceUpdate()
  }
  render() {
    console.log('Child Component render')
    return (
      <div>
        这里是child子组件：
        <p>{this.props.parentInfo[0].name}</p>
      </div>
    )
  }
}

//用React.memo
// const Child = React.memo(function (props) {
//   useEffect(() => {
//     console.log('child render')
//   })
//   return <div>{props.pnum}</div>
// })
