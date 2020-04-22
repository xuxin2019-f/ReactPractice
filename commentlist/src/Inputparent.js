import React, { Component } from 'react'
import Inputchild from './Inputchild'
export default class Inputparent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      // 默认不重置
      reset: false,
    }
  }
  resetInput = () => {
    this.setState({ reset: true })
  }
  render() {
    return (
      <div>
        <Inputchild reset={this.state.reset} />
        <button onClick={this.resetInput}>重置</button>
      </div>
    )
  }
}
