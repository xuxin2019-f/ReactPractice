function createElement(type, props, ...children) {
  props.children = children
  //删除现在不必要的属性，这步可写可不写
  delete props._self
  delete props._source
  //通过vtype区分三种组件：1：元素 2：class组件 3：函数组件
  let vtype
  if (typeof type === 'function') {
    if (type.isReactComponent) {
      vtype = 2
    } else {
      vtype = 3
    }
  } else if (typeof type === 'string') {
    vtype = 1
  }
  return { vtype, type, props }
}
// 具名导出
export class Component {
  // 标识符 静态变量 区分class和函数组件
  static isReactComponent = true
  constructor(props) {
    this.props = props
  }
  //所有继承Component的类组件都可以使用的方法
  setState = {}
  forceUpdata = {}
}

export default { createElement }
