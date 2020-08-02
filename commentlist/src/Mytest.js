import React, { Component,u } from 'react'

 class Testone extends Component {
  constructor() {
    this.state = {
      count: 0,
    }
  }
  add = () => {
    this.setState({ count: this.state.count++ }, () => {
      console.log(this.state.count)
    })
    this.setState({ count: this.state.count++ }, () => {
      console.log(this.state.count)
    })
  }
  render() {
    return <div>{this.state.count}</div>
  }
}
export Testone