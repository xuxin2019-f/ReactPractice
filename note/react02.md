# 移动App第4天


## 组件的生命周期
 + 概念：在组件创建、到加载到页面上运行、以及组件被销毁的过程中，总是伴随着各种各样的事件，这些在组件特定时期，触发的事件，统称为 组件的生命周期；
 + 组件生命周期分为三部分：
   - **组件创建阶段**：组件创建阶段的生命周期函数，有一个显著的特点：**创建阶段的生命周期函数，在组件的一辈子中，只执行一次；**
	
	  0.1 static props
	
	  0.2 this.state={}
	> 1.componentWillMount: 组件将要被挂载，**此时还没有开始渲染虚拟DOM（虚拟DOM是在render里执行的），此时无法获取到页面上的任何元素，在这个阶段不能操作页面的dom元素，但是能访问到props和state,也能访问组件上的所有函数。 所以这个函数等同于vue中的created**
	>
	> 官方不推荐在此时发请求，可能会造成渲染的阻塞
>2.render：第一次开始渲染真正的虚拟DOM，当render执行完，内存中就有了完整的虚拟DOM了，但此时虚拟DOM并没有挂载到真正的页面上
>
>可以做渲染过滤
>
>3.componentDidMount: 组件完成了挂载，此时，组件已经显示到了页面上，当这个方法执行完，组件就进入都了 运行中 的状态 **相当于vue中的mounted函数**
>
>在此处发网络请求
>
>在这个函数中，我们可以放心的去操作页面上 需要使用的DOM元素（最早也只能在此时）

   - **组件运行阶段**：**也有一个显著的特点，根据组件的state和props的改变，有选择性的触发0次或多次**；
   > componentWillReceiveProps: 组件将要接收新属性，此时，只要这个方法被触发，就证明父组件为当前子组件传递了新的属性值；
   > shouldComponentUpdate: 组件是否需要被更新，此时，组件尚未被更新，但是，state 和 props 肯定是最新的
   >
   > **如果return ture，则组件可以被更新；return false组件不被更新**
   >
   > componentWillUpdate: 组件将要被更新，此时，尚未开始更新，**内存中的虚拟DOM树还是旧的**
   > render: 此时，又要重新根据最新的 state 和 props 重新渲染一棵内存中的 **虚拟DOM树，当 render 调用完毕，内存中的旧DOM树，已经被新DOM树替换了！此时页面还是旧的**
   > componentDidUpdate: **此时，页面又被重新渲染了，state 和 虚拟DOM 和 页面已经完全保持同步**

   - **组件销毁阶段**：**也有一个显著的特点，一辈子只执行一次**；
   > componentWillUnmount: 组件将要被卸载，此时组件还可以正常使用；

[vue中的生命周期图](https://cn.vuejs.org/v2/guide/instance.html#生命周期图示)
[React Native 中组件的生命周期](http://www.race604.com/react-native-component-lifecycle/)


![React中组件的生命周期](./images/React中组件的生命周期.png)

### defaultProps
> 在组件创建之前，会先初始化默认的props属性，作用是防止组件中某些必须的属性外界没有传递时的报错问题。这是全局调用一次，严格地来说，这不是组件的生命周期的一部分。
>
> 在组件被创建并加载后，首先调用 constructor 构造器中的 this.state = {}，来初始化组件的私有数据，它定义在组件的constructor构造函数中。在class类中，只要new这个类，必然会优先调用constructor，所以this.state会在第一时间被初始化

React生命周期的回调函数总结成表格如下：
![React生命周期表格](./images/React生命周期表格.png)
组件生命周期的执行顺序：

- **initialization**
- constructor()

+ **Mounting**
 - componentWillMount()
 - render()
 - componentDidMount()
+ **Updating**
 - componentWillReceiveProps(nextProps)

 - shouldComponentUpdate(nextProps, nextState)

 - componentWillUpdate(nextProps, nextState)

 - render()

 - componentDidUpdate(prevProps, prevState)

   此时页面和内存中的数据都是最新的，可以直接从this.state和this.props直接获取了，所以旧的可以从参数列表中拿
+ **Unmounting**
 - componentWillUnmount()

   

## 通过Counter计数器的小案例 - 了解生命周期函数
1. 给 `props` 属性提供默认值 和 进行类型校验，需要先运行`cnpm i prop-types --save`

   **如果用脚手架，已经为我们包装好了在node-modules里的prop-types里** 只需引入：

   ```
   import PropTypes from 'prop-types'
   ```

   

2. 给组件的 `props` 提供默认值

   ```
     // 为组件提供 默认的 props 属性值
     static defaultProps = {
       initcount: 0 // 默认值为0    如果用户没有传递 ，则 默认就是0； 如果用户传递了，则 以用户传递的为准
     }
   ```

3. 给组件的 `props` 进行类型校验

   ```
     // 3. 进行 props 属性的类型校验,   static propTypes = {}  是固定写法
     static propTypes = {
       initcount: PropTypes.number.isRequired // 规定 外界在传递 initcount 的时候，必须是 number 值类型，否则 ，会在终端报警告
       // isRequired 表示 这个 props 属性值 是必须要传递的
     }
   ```


## 组件初始化时生命周期事件总结
1. componentWillMount：

2. render：

3. componentDidMount：

4. 注意：在**render函数中，不能调用`setState()`方法**

   **因为：setState 会触发 render 函数的执行，如果在 render 函数中，又调用了 setState ，则会进入死循环！**

   ```
   1.componentWillMount() { // 这个 函数，等同于 Vue 中的 created 生命周期函数
       // 此时，无法获取到 页面上的 任何元素，因为 虚拟DOM 和 页面 都还没有开始渲染呢！【在这个阶段中，不能去操作页面上的DOM元素】
       // console.log(document.getElementById('myh3'));拿不到
       // console.log(this.props.initcount);
       // console.log(this.state.msg);
       // this.myselfFunc()
     }
     
   2.render() {
       // 在 return 之前，虚拟DOM还没有开始创建，页面上也是空的，根本拿不到任何的 元素
       // console.log(document.getElementById('myh3'));
   
       // 在 组件运行阶段中，每当调用 render 函数的时候，页面上的 DOM元素，还是之前旧的
       // console.log(this.refs.h3 && this.refs.h3.innerHTML);
   
       // 不要在 render 中使用 this.setState,因为 会陷入死循环
      /*  this.setState({
         count: this.state.count + 1
       }) */
   3.componentDidMount() {
       // 在这个函数中，我们可以放心的去 操作 页面上你需要使用的 DOM 元素了；
       // 如果我们想操作DOM元素，最早，只能在 componentDidMount 中进行；
       // componentDidMount 相当于 Vue 中的 mounted 函数
       // console.log(document.getElementById('myh3'));
       
   这里注意，如果不用箭头函数，this的指向是id为btn的button元素，所以用箭头函数，指向当前组件
       /* document.getElementById('btn').onclick = () => {
         // console.log('ok');
         // console.log(this);
         // this.props.initcount++
         this.setState({
           count: this.state.count + 1
         })
       } */
     }
     
    4. shouldComponentUpdate(nextProps最新的props, nextState最新的state) {
       // 1. 在 shouldComponentUpdate 中要求必须返回一个布尔值
       // 2. 在 shouldComponentUpdate 中，如果返回的值是 false，则 不会继续执行后续的生命周期函数，而是直接退回到了 运行中 的状态，此时有序 后续的 render 函数并没有被调用，因此，页面不会被更新，但是， 组件的 state 状态，却被修改了；
       // return false
   
       // 需求： 如果 state 中的 count 值是偶数，则 更新页面，如果 count 值 是奇数，则不更新页面，我们想要的页面效果：4，6，8，10，12....
       // 经过打印测试发现，在 shouldComponentUpdate 中，通过 this.state.count 拿到的值，是上一次的旧数据，并不是当前最新的；
       // console.log(this.state.count + ' ---- ' + nextState.count);
       // return this.state.count % 2 === 0 ? true : false
       // return nextState.count % 2 === 0 ? true : false
       return true
     }
     
    5.// 组件将要更新，此时尚未更新，在进入这个 生命周期函数的时候，内存中的虚拟DOM是旧的，页面上的 DOM 元素 也是旧的
     componentWillUpdate() {
       // 经过打印分析，得到，此时页面上的 DOM 节点，都是旧的，应该慎重操作，因为你可能操作的是旧DOM
       // console.log(document.getElementById('myh3').innerHTML)
       // console.log(this.refs.h3.innerHTML);
     }
     
    6.// 组件完成了更新，此时，state 中的数据、虚拟DOM、页面上的DOM，都是最新的，此时，你可以放心大胆的去操作页面了
     componentDidUpdate(nextProps) {
       // console.log(this.refs.h3.innerHTML);
     }
     7.componentWillReceiveProps
     父组件最初始传递给子组件的属性并不会导致这个钩子函数的触发，只有当父组件中，通过没写事件，重新修改了传递给子组件的props数据之后，才会触发
    在被出发时，如果使用this.props来获取属性值，获取的是旧属性值，如果想要获取最新值，要通过出参数列表获取:nextProps.属性值
     
     componentWillReceiveProps(nextProps) {
       console.log('触发啦！！最新的props值是:'+ nextProps.pmsg + '旧的props值为：'+ this.props.pmsg)
     }
   ```
   



## Hook

**Hook 使用了 JavaScript 的闭包机制，而不用在 JavaScript 已经提供了解决方案的情况下，还引入特定的 React API。**

### useState

### useEffect

#### 解决了class的一些问题

1.如果class要实现首次渲染和每次更新的相同逻辑，要复用代码两次，而useEffect不用

2.class中相关逻辑可能分散在不同的生命周期，不相关逻辑又可能都在一个生命周期，useEffect可以多次声明来解决这个问题

3.class中如果忘记在componentDidUpdate中书写相关数据更新后的操作，很可能会导致页面组件渲染的错误等，利用useEffect中每次首次渲染后都会执行的清除函数会避免这个问题的发生（**并且useEffect可以通过设置第二个参数来优化**）





在 React 的 class 组件中，**`render` 函数是不应该有任何副作用的。**一般来说，在这里执行操作太早了，我们基本上都希望在 React 更新 DOM 之后才执行我们的操作。这**就是为什么在 React class 中，我们把副作用操作放到 `componentDidMount` 和 `componentDidUpdate` 函数中**。**如果在class中想实现首次渲染和每次更新都执行相同代码，需要重复写两次代码**

**`useEffect` 做了什么？** 通过使用这个 Hook，你可以告诉 React 组件需要在渲染后执行某些操作。React 会保存你传递的函数（我们将它称之为 “effect”），**并且在执行 DOM 更新之后调用它。**

**为什么在组件内部调用 `useEffect`？** 将 `useEffect` 放在组件内部让我们可以在 effect 中直接访问 `count` state 变量（或其他 props）。我们不需要特殊的 API 来读取它 —— 它已经保存在函数作用域中。**Hook 使用了 JavaScript 的闭包机制，而不用在 JavaScript 已经提供了解决方案的情况下，还引入特定的 React API。**

**`useEffect` 会在每次渲染后都执行吗？** 是的，默认情况下，它在第一次渲染之后*和*每次更新之后都会执行。（我们稍后会谈到[如何控制它](https://zh-hans.reactjs.org/docs/hooks-effect.html#tip-optimizing-performance-by-skipping-effects)。）你可能会更容易接受 effect 发生在“渲染之后”这种概念，不用再去考虑“挂载”还是“更新”。React 保证了每次运行 effect 的同时，DOM 都已经更新完毕。

#### 不需要清除的副作用

不需要return

#### 需要清除的副作用

return一个函数，**React将会在执行清除操作（在每次重新渲染时都会执行）时调用它**

**为什么要在 effect 中返回一个函数？** 这是 effect 可选的清除机制。每个 effect 都可以返回一个清除函数。如此可以将添加和移除订阅的逻辑放在一起。它们都属于 effect 的一部分。

#### 多个effect声明

将不相关的逻辑声明在不同的effect中，react会按照声明的顺序从上到下依次执行，解决了class中不相关的逻辑在一个生命周期里，相关的逻辑又分散在不同的生命周期里的这个问题



#### 性能优化：使用参数

#### 提示: 通过跳过 Effect 进行性能优化

在某些情况下，每次渲染后都执行清理或者执行 effect 可能会导致性能问题。在 class 组件中，我们可以通过在 `componentDidUpdate` 中添加对 `prevProps` 或 `prevState` 的比较逻辑解决：

```
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

这是很常见的需求，所以它被内置到了 `useEffect` 的 Hook API 中。如果某些特定值在两次重渲染之间没有发生变化，你可以通知 React **跳过**对 effect 的调用，只要传递数组作为 `useEffect` 的第二个可选参数即可：

```
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新
```

**如果只写成[]，代表该副作用只在首次渲染时执行**

#### 规则

- 只能在react中用
- 只能在构造函数组件中用
- **只能在函数的顶层逻辑用，不能在子函数或者是条件语句中用**

​    原因是：react知道哪个state对应哪个useState是通过每次重新渲染都是同样的Hook调用顺序实现的，如果某一个Hook放在了子函数或者是条件语句中，调用时会忽略这个Hook，导致后面所有的Hook都提前了，产生bug

https://zh-hans.reactjs.org/docs/hooks-rules.html

### useContext

接收一个 context 对象（`React.createContext` 的返回值）并返回该 context 的当前值。当前的 context 值由上层组件中距离当前组件最近的 `的 `value`prop 决定。

当组件上层最近的 ` 更新时，该 Hook 会触发重渲染，并使用最新传递给 `MyContext` provider 的 context `value` 值。即使祖先使用 [`React.memo`](https://zh-hans.reactjs.org/docs/react-api.html#reactmemo) 或 [`shouldComponentUpdate`](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate)，也会在组件本身使用 `useContext` 时重新渲染。

别忘记 `useContext` 的参数必须是 *context 对象本身*：

**即首先要用Context（自己定义的）=React.createContext创建一个上下文环境，然后在Context.Provider中通过value来传递给子组件，然后子组件中才能使用useContext（Context）来获取数据**

### useReducer

一定程度上是useState的替代方案。它接收一个类似于(state,dispatch)=>changestate的reducer作为第一个参数，第二个参数是state的初始值，第三个参数init是选择是否要惰性加载

```
const [state, dispatch] = useReducer(reducer, initialArg, init);
```



## HOC：高阶组件函数调用（重要

为了提高组件的复用率，就要保证组件功能单一性，若要满足复杂需求就需要扩展功能单一的组件，于是有了HOC高阶组件。高阶组件是一个工厂函数，它接收一个组件并返回另一个组件

高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式

具体而言，**高阶组件是参数为组件，返回值为新组件的函数。**



```
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```



组件是将 props 转换为 UI，而高阶组件是将组件转换为另一个组件。

请注意，HOC 不会修改传入的组件，也不会使用继承来复制其行为。相反，HOC 通过将组件*包装*在容器组件中来*组成*新组件。HOC 是纯函数，没有副作用。

**注意：1.不要试图在 HOC 中修改组件原型（或以其他方式改变它）HOC 不应该修改传入组件，而应该使用组合的方式，通过将组件包装在容器组件中实现功能：**

​            2.**不要在render方法中使用HOC，会报错**

**解决方法是在别的组件中定义HOC后export暴露，在当前组件用import引用；或者直接在当前组件中定义后，再将该HOC用另一个变量名引用，再在render中用这个变量名作为标签名**

例子在class-text的comments.js中

```
class Fn extends Component {
  render() {
    return (
      <div>
        <h3>hoc</h3>
      </div>
    );
  }
}
// 高阶组件
function enhance(Wrappedcommenlist) {
  return class temp extends Component {
    componentDidMount() {
      console.log('这个高阶组件被挂载了')
    }
    render() {
      return <Wrappedcommenlist />
    }
  }
}
let WrapCommentList = enhance(Fn)
引用直接写成：
 <WrapCommentList />
```

新版例子在class-tets的HocTest.js中

练习用函数写高阶组件并写成链式调用》commentlist下HocTest

```react
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

```



## 通过原生的方式获取元素并绑定事件

## React中使用ref属性获取DOM元素引用

和 Vue 中差不多，vue 为页面上的元素提供了 `ref` 的属性，如果想要获取 元素引用，则需要使用`this.$refs.引用名称`

在 React 中，也有 `ref`, 如果要获取元素的引用`this.refs.引用名称`


## 使用React中的事件，绑定count自增


## 组件运行中事件的对比
1. shouldComponentUpdate：
2. componentWillUpdate：
3. render：
4. componentDidUpdate：

## 绑定this并传参的三种方式

**如果直接写成onClick={this.handleMsg1()} />**

**然后handleMsg1的声明又是普通函数的声明，会导致在函数内部调用this时指向错误，如要修改state：this.setState，会直接报错**

1. 在事件中绑定this并传参：
```
    <input type="button" value="在事件中绑定this并传参" onClick={this.handleMsg1.bind(this, '🍕', '🍟')} />

    // 在事件中绑定this并传参
    handleMsg1(arg1, arg2) {
        console.log(this);
        // 此时this是个null
        this.setState({
            msg: '在事件中绑定this并传参：' + arg1 + arg2
        });
    }
```
2. 在构造函数中绑定this并传参:

**有一定的性能优化的作用，因为通过onClick={()=>this.hanleMsg()}的绑定方式，每次刷新时都是一个崭新的函数**

```
    // 修改构造函数中的代码：
    this.handleMsg2 = this.handleMsg2.bind(this, '🚗', '🚚');

    <input type="button" value="在构造函数中绑定this并传参" onClick={this.handleMsg2} />

    // 在构造函数中绑定this并传参
    handleMsg2(arg1, arg2) {
        this.setState({
            msg: '在构造函数中绑定this并传参：' + arg1 + arg2
        });
    }
```
3. 用箭头函数绑定this并传参：
```
    <input type="button" value="用箭头函数绑定this并传参" onClick={() => { this.handleMsg3('👩', '👰') }} />

    // 用箭头函数绑定this并传参
        handleMsg3(arg1, arg2) {
            this.setState({
                msg: '用箭头函数绑定this并传参：' + arg1 + arg2
            });
        }
```

## 绑定文本框与state中的值
1. 在Vue.js中，默认可以通过`v-model`指令，将表单控件和我们的`data`上面的属性进行双向数据绑定，数据变化和页面之间的变化是同步的！
2. 在React.js中，默认没有提供双向数据绑定这一功能，默认的，只能把`state`之上的数据同步到界面的控件上，但是不能默认实现把界面上数据的改变，同步到`state`之上，需要程序员手动调用相关的事件，来进行逆向的数据传输！
3. 绑定文本框和state的值：
```
    {/*只要将value属性，和state上的状态进行绑定，那么，这个表单元素就变成了受控表单元素，这时候，如果没有调用相关的事件，是无法手动修改表单元素中的值的*/}
    <input style={{ width: '100%' }} ref="txt" type="text" value={this.state.msg} onChange={this.handleTextChange} />

    // 这是文本框内容改变时候的处理函数
    handleTextChange = () => {
        this.setState({
            msg: this.refs.txt.value
        });
    }
```
4. 注意`setState的一个问题`：
```
// 保存最新的state状态值，在保存的时候，是异步地进行保存的，所以，如果想要获取最新的，刚刚保存的那个状态，需要通过回掉函数的形式去获取最新state
this.setState({
    msg: this.refs.txt.value
    // msg: e.target.value
}, function () {
    // 获取最新的state状态值
    console.log(this.state.msg);
});
```

## 发表评论案例

见代码

reload：把一个方法传递给子组件

```
<CMTBox reload={this.loadCmts}></CMTBox>

// 从本地存储中加载 评论列表
  loadCmts = () => {
    var list = JSON.parse(localStorage.getItem('cmts') || '[]')
    this.setState({
      list
    })
  }
  {/* 相对于 Vue 中，把 父组件传递给子组件的 普通属性 和 方法属性，区别对待， 普通属性用 props 接收， 方法 使用 this.$emit('方法名') */}
      {/* react 中，只要是传递给 子组件的数据，不管是 普通的类型，还是方法，都可以使用 this.props 来调用 */}
```




## 扩展
### context特性

- const Context = React.createContext(defaultValue);

创建一个 Context 对象。当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 `Provider` 中读取到当前的 context 值。

**只有当组件所处的树中没有匹配到 Provider 时，其 `defaultValue` 参数才会生效。**这有助于在不使用 Provider 包装组件的情况下对组件进行测试。注意：将 `undefined` 传递给 Provider 的 value 时，消费组件的 `defaultValue`不会生效。

- const Provider = Context.Provider

```
<Context.Provider value={某个值} 》
```

Provider 接收一个 `value` 属性，传递给消费组件。**一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。**

当 Provider 的 `value` 值发生变化时，它内部的所有消费组件都会重新渲染。Provider 及其内部 consumer 组件都不受制于 `shouldComponentUpdate` 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。

- const Consumer = Context.Consumer

```
<Context.Consumer>
 {value => 基于context值进行渲染}
</Context.Consumer>
```

这需要[函数作为子元素（function as a child）](https://zh-hans.reactjs.org/docs/render-props.html#using-props-other-than-render)这种做法。这个函数接收当前的 context 值，返回一个 React 节点。传递给函数的 `value` 值等同于往上组件树离这个 context 最近的 Provider 提供的 `value` 值。如果没有对应的 Provider，`value` 参数等同于传递给 `createContext()` 的 `defaultValue`。



在context模式下有两个角色：Provider：外层提供数据的组件

​                                                    Consumer：内层获取数据的组件



## 相关文章
[类型校验](https://facebook.github.io/react/docs/typechecking-with-proptypes.html)
[Animation Add-Ons](https://reactjs.org/docs/animation.html#high-level-api-reactcsstransitiongroup)

