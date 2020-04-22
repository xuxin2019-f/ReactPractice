import React, { Component, useState, useEffect } from 'react'
export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      num: 1,
    }
  }
  static getDerivedStateFromProps(nextprops, prevstate) {
    console.log(nextprops)

    console.log(prevstate)
    // if (nextprops.num !== prevstate.num) {
    //   console.log('不相等')
    //   return nextprops
    // }
    return null
  }
  // getSnapshotBeforeUpdate(prevprops, prevstate) {
  //   // console.log(prevprops)
  //   // console.log(prevstate)
  //   return prevstate.num
  // }
  // componentDidUpdate(prevprops, prevstate, snapshot) {
  //   console.log(`在更新里用prevstate：${prevstate.num}`)
  //   console.log(`在更新里用snapshot：${snapshot}`)
  // }
  ChangeHandle = (e) => {
    console.log(this.state.num)
  }
  render() {
    return (
      <div>
        <input value={this.state.num} onChange={this.ChangeHandle} />
        <button
          onClick={() => {
            this.setState({ num: this.state.num + 1 })
          }}
        >
          +1
        </button>
      </div>
    )
  }
}
