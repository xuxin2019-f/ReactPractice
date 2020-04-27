import React, { Component, useState, useCallback, useMemo } from 'react'
export default function Parent() {
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  //此时不论是触发change1还是change2，由于都改变了数据，整个组件重新刷新
  //导致Parent组件整个重新刷新，两个Child组件的随机数都发生改变
  // const change1 = () => {
  //   setCount1(count1 + 1)
  // }
  // const change2 = () => {
  //   setCount2(count2 + 1)
  // }
  const change1 = () => {
    setCount1(count1 + 1)
  }
  //只有当count2发生改变的时候，change2才会返回新的函数，否则一直缓存着旧的函数
  //即当change1被触发时，不改变第二个Child组件，但change2触发时，两个组件会同时更新
  const change2 = useCallback(() => {
    setCount2(count2 + 1)
  }, [count2])
  const result = useMemo(() => {
    return Math.random().toString().slice(2)
  }, [count2])
  return (
    <div>
      {result}
      <Child onClick={change1}>增加count1</Child>
      <Child onClick={change2}>增加count2</Child>
    </div>
  )
}

const Child = React.memo(function ({ onClick, children }) {
  return (
    <div>
      <button onClick={onClick}>{children}</button>
      <span>{Math.random()}</span>
    </div>
  )
})
