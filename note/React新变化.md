# React新变化

## 1.React Fiber

![img](https://upload-images.jianshu.io/upload_images/7512510-eab82217abe7dc17.png?imageMogr2/auto-orient/strip|imageView2/2/w/586)

Fiber出现之前：组件同步渲染（因为react是单线程）、深层递归渲染，堵塞主线程

![img](https://upload-images.jianshu.io/upload_images/7512510-a622b2d69c5bf663.png?imageMogr2/auto-orient/strip|imageView2/2/w/1153)

出现之后：允许异步渲染，将组件的渲染过程分为phase1和phase2，phase1是可以被打断的（只允许做一些无副作用的操作），phase2不能被打断

![img](https://upload-images.jianshu.io/upload_images/7512510-e920709f62c769cb.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/720)

防止了客户端react在进行渲染的时候阻塞页面的其他交互行为

https://zhuanlan.zhihu.com/p/26027085

https://www.jianshu.com/p/bf824722b496

## 2.生命周期

官方文档：https://zh-hans.reactjs.org/docs/react-component.html

相较于16.0之前的版本，之后的版本由于React Fiber导致以前的生命周期可能出现问题：

因为render渲染之前可能会出现的生命周期有：

- componentWillmount（即将过期）
- componentWillRecieveProps（即将过期）
- shouldComponentUpd
- componentWillUpda（即将过期）

**如果开发者开了async rendering，而且又在以上这些render前执行的生命周期方法做AJAX请求的话，那AJAX将被无谓地多次调用。。。**明显不是我们期望的结果。而且在componentWillMount里发起AJAX，不管多快得到结果也赶不上首次render，而且componentWillMount在服务器端渲染也会被调用到（当然，也许这是预期的结果），这样的IO操作放在componentDidMount里更合适。
禁止不能用比劝导开发者不要这样用的效果更好，所以除了shouldComponentUpdate，其他在render函数之前的所有函数（**componentWillMount，componentWillReceiveProps，componentWillUpdate）都被getDerivedStateFromProps替代。**
也就是用一个**静态函数getDerivedStateFromProps来取代被deprecate的几个生命周期函数，就是强制开发者在render之前只做无副作用的操作**，而且能做的操作局限在根据props和state决定新的state



本来所有生命周期在一次渲染中只能执行一次，而这三个will的周期由于Fiber的出现可能会导致执行一半就中断后，无法再一次执行，导致出错

所以新加了两个生命周期：

- static getDerivedStateFromProps(props,state) 在组件创建时和更新时的**render方法之前**调用，*它应该返回一个对象来更新状态，或者返回null来不更新任何内容*。**此方法适用于罕见案例，即 state 的值在任何时候都取决于 props，但是props的更新、state的更新、以及forceUpdate强制更新都会重新加载这个生命周期。**

  https://zh-hans.reactjs.org/docs/react-component.html#static-getderivedstatefromprops

  **应用场景**：比如需要根据不同的用户id渲染不同的用户联系人，在父组件传递userid，在子组件根据props的不同改变state值

  **注意**：**在getDerivedStateFromProps中，在条件限制下(if/else)调用setState**。如果不设任何条件setState，这个函数超高的调用频率，不停的setState，会导致频繁的重绘，既有可能产生性能问题，同时也容易产生bug。

  ```js
  ......
  render(){
    return(
      <EmailList userid={id}/>
     )
  }
  
  class EmailList extends Component {
    constructor(props){
      super(props)
      this.state = {
        friends = []
      }
    }
    static getDerivedStateFromProps(nextprops,prevstate){
      //最好设if语句
        if(nextprops.userid !== this.props.userid){
            return axios.get(xxxxx,nextprops.userid)
        }
    }
  }
  ```

  另一个例子：

  值得注意的是：如果想要利用该生命周期靠父组件props的改变来reset子组件，可以在父组件加key值，值的内容就是props，这样当props值改变时，**由于key值改变，整个组件就会销毁重新render**，达到reset的目的

  https://blog.csdn.net/napoleonxxx/article/details/81120854

- getSnapshotBeforeUpdate在最近一次渲染输出（提交到 DOM 节点）之前调用(**即在render后，但在更新DOM之前**）。它使得组件能在发生更改之前从 DOM 中捕获一些信息（例如，滚动位置）。**此生命周期的任何返回值将作为参数传递给** `componentDidUpdate()`。

   **注意这个生命周期必须和componentDidUpdate配套使用，否则会报错**

- static getDerivedStateFromError()此生命周期会在后代组件抛出错误后被调用。 它将抛出的错误作为参数，并返回一个值以更新 state

在16.4中

![16.4生命周期](F:\图片\16.4生命周期.png)

**新的props、setState、forceUpdate强制更新都会触发getDerivedStateFromProps**

在16.3中![16.3生命周期](F:\图片\16.3生命周期.png)

**16.3只有父组件属性更新才会触发，跨度比较小**

### 用新周期在react中做模糊搜索

**效果：一开始在搜索框下显示所有数据，搜索时显示模糊搜索的数据，如果点重置则又显示所有数据**

在commentlist中建立两个组件Inputparent和Inputchild

父组件的重置按钮可以改变reset状态，再通过props传递给子组件，在子组件中通过static getDerivedStateFromProps函数来确定props是否改变，**如果改变则修改子组件里的content值为全部数组，如果没改变则返回null代表着不改变子组件的状态**

#### 遇到的坑

**在getDerivedStateFromProps里，只能通过return返回的对象来修改state中的值，不能用this.setState来修改，会报错undefined**

```react
//父组件
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


//子组件
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

```

## 3.Render可以返回数组和字符串

## 4.错误处理机制

react 16新增了一个componentDidCatch生命周期来捕捉错误

```react
class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      hasError:false
    }
  }
  componentDidCatch(err,info){
    console.log(err,info)
    this.setState({
      hasError:true
    })
  }
  render() {
    return this.state.hasError ?<h2>页面出错了！</h2> :(
      <div>
        <AuthRoute></AuthRoute>
        <Switch>
          <Route path="/bossinfo" component={BossInfo}></Route>
          <Route path="/geniusinfo" component={GeniusInfo}></Route>
          <Route path="/login" component={Login}></Route>
          <Route path="/register" component={Register}></Route>
          <Route path="/chat/:user" component={Chat}></Route>
          <Route component={Dashboard}></Route>
        </Switch>
      </div>
    )
  }
}
```



## 5.Portals组件

 可以渲染在它dom节点之外的元素，比如弹窗的灰色背景放在body之外

## 6.更好更快的服务端渲染（重要）

-   renderToString（只能解析成字符串）到renderToNodeString（解析成可读的字节流）的改变，直接渲染成node节点流
-  使用ReactDom.hydrate(注水）取代render

 作者：知乎用户
链接：https://www.zhihu.com/question/66068748/answer/238387766
来源：知乎
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。



1）React 的事件绑定，在服务端渲染时，并不会以 <div onclick="xxx" /> 这种内联事件形态出现。所以，ReactDOMServer 渲染的内容在「结构-样式-行为」铁三角关系里，缺失了「行为」



2）在 React v15 版本里，ReactDOM.render 方法可以根据 data-react-checksum 的标记，复用 ReactDOMServer 的渲染结果，不重复渲染，而是根据 data-reactid 属性，找到需要绑定的事件元素，进行事件绑定的处理。补完「结构-样式-行为」。



3）在 React v16 版本里，ReactDOMServer 渲染的内容不再有 data-react 的属性，而是尽可能复用 SSR 的 HTML 结构。



这就带来了一个问题，ReactDOM.render 不再能够简单地用 data-react-checksum 的存在性来判断是否应该尝试复用，如果每次 ReactDOM.render 都要尽可能尝试复用，性能和语义都会出现问题。所以， ReactDOM 提供了一个新的 API， ReactDOM.hydrate() 。



![img](https://pic4.zhimg.com/50/v2-3008f0991ca9df839f07810dc628b7c3_hd.jpg?source=1940ef5c)![img](https://pic4.zhimg.com/80/v2-3008f0991ca9df839f07810dc628b7c3_720w.jpg?source=1940ef5c)

4）在 React v17 版本里，ReactDOM.render 则直接不再具有复用 SSR 内容的功能。见：[https://github.com/facebook/react/blob/master/src/renderers/dom/shared/__tests__/ReactRenderDocument-test.js#L32-L34](https://link.zhihu.com/?target=https%3A//github.com/facebook/react/blob/master/src/renderers/dom/shared/__tests__/ReactRenderDocument-test.js%23L32-L34)



结论：**hydrate 描述的是 ReactDOM 复用 ReactDOMServer 服务端渲染的内容时尽可能保留结构，并补充事件绑定等 Client 特有内容的过程。**

## 7.协议完全开源，MIT协议