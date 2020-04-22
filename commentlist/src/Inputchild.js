import React, { Component } from 'react'
export default class Inputchild extends Component {
  constructor(props) {
    super(props)
    this.state = {
      arr: ['xuxin', 'wy'],
      content: ['xuxin', 'wy'],
    }
  }
  static getDerivedStateFromProps(nextprops, prevstate) {
    var that = this
    if (nextprops.reset === true) {
      //不能这么写,只能通过return的对象改变state的值
      // that.setState({ content: ['xuxin', 'wy'] })
      //说明点了重置按钮了
      return {
        content: ['xuxin', 'wy'],
      }
    } else {
      //即不做改变
      return null
    }
  }
  search = (e) => {
    // console.log('测试' + e.target.value.trim())
    if (e.target.value.trim() !== 0) {
      var result = this.state.arr.filter((item) => {
        if (item.indexOf(e.target.value.trim()) === 0) return item
      })
      console.log(result)
      this.setState(
        () => {
          return { content: result }
        },
        () => {
          console.log(this.state.content)
          this.setState({ reset: true })
        }
      )
    }
  }
  debouce = (fn, delay) => {
    var timer = null
    return function () {
      if (timer !== null) clearTimeout(timer)
      timer = setTimeout(fn, delay)
    }
  }
  match = (e) => {
    return this.debouce(this.search(e), 1000)
    //return this.search(e)
  }
  render() {
    return (
      <div>
        <input type="text" onInput={this.match} />
        <div>{this.state.content}</div>
      </div>
    )
  }
}
