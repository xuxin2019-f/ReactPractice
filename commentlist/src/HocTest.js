import React, { Component, useEffect } from 'react'
function Child(props) {
  return (
    <div>
      {props.num}-{props.count}-{props.data}
    </div>
  )
}

const listdata = [
  { num: 1, count: 1 },
  { num: 2, count: 2 },
  { num: 3, count: 3 },
]
// 这个高阶函数实现为子组件添加新的属性
const withComp = (Comp) => (props) => {
  const list = listdata[props.index]
  console.log(props.data)
  //除了新添加的属性，还要把原来的属性加上呀！
  return <Comp {...list} data={props.data} />
}

//这个高阶组件打印日志
const warpComp = (Comp) => (props) => {
  // 如果用函数组件就用useEffect，可以代替componentDidMount
  useEffect(() => {
    console.log('打印日志')
  })
  return <Comp {...props} />
}

const Lastchild = warpComp(withComp(Child))

export default class HocTest extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: 'data',
    }
  }
  render() {
    return (
      <div>
        {[0, 0, 0].map((item, index) => (
          <Lastchild data={this.state.data} index={index} />
        ))}
      </div>
    )
  }
}
