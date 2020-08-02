// 接收两个参数，callback和dependencies(为一个数组)
// 1.如果依赖为空，则每次渲染都会执行一次；2.如果依赖为一个空数组，相当于componentDidMounted，只执行一次
// 3.如果依赖不为空，则只有依赖改变才会执行callback

var _deps //记录上一次的依赖，用于比较依赖是否改变了
function useEffect(callback, dependencies) {
  var hasnoDep = !dependencies //判断是否依赖为空
  // 判断依赖是否改变了：如果没有_deps,说明为第一次或者没有依赖，直接为true，否则遍历dependencies的每一项
  var hasDepChange = _deps
    ? !dependencies.every((el, i) => el === _deps[i])
    : true
  //  如果依赖不存在，或者依赖发生改变了才执行回调函数
  if (hasnoDep || hasDepChange) {
    callback()
    // 记录上一次依赖
    _deps = dependencies
  }
}
// Q：为什么第二个参数是空数组，相当于 componentDidMount ？
// A：因为依赖一直不变化，callback 不会二次执行。
