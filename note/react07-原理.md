## 高阶函数与高阶组件

- react中频繁出现的高阶组件指的是一个组件（类）接收一个组件为参数，然后return一个全新的组件。**高阶组件也是高阶函数**。

- 高阶函数是不止存在于react中的含义，只要满足参数或返回值为函数就可以成为高阶函数，如数组中的map、sort、reducer、filter；promise等

##  最核心的api

React.createElement: 创建虚拟DOM

React.Component: 实现自定义组件

ReactDOM.render:渲染真实DOM

## JSX

### 1.什么是JSX

**每个 JSX 元素只是调用 `React.createElement(component, props, ...children)` 的语法糖**。，即JavaScript XML，一种可以在react组件内部构建标签的类xml语法，实现在js中嵌入html标签，增强了组件的可读性

React用JSX来替代常规的JavaScript

JSX是一个看起来很像XML的JavaScript语法扩展

**在不使用jsx的react中创建组件的方法**：

官方例子：https://zh-hans.reactjs.org/docs/react-without-jsx.html#gatsby-focus-wrapper

```
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

ReactDOM.render(
  React.createElement(Hello, {toWhat: 'World'}, null),
  document.getElementById('root')
);
```



### 2.原理

**babel-loader会预编译JSX为React.createElement(...)**

```react
class App extends React.Component {
    render(){
        return(
         <div>
            Hello {this.props.name}, I am {2+2}years old
            </div>
        )
    }
}
ReactDOM.render(
 <App name='React' />
  mountNode
)
babel-loader编译后：
class App extends React.Component {
    render() {
        return React.createElement (
         'div',
          null,
          'Hello',
          this.props.name,
          ',I am',
          2+2,
          "years old"
        )
    }
}
ReactDom.render(React.createElement(App,{name:'React'}),mountNode)
```



### 3.与vue的异同

- react中虚拟dom+jsx的设计一开始就有，vue则是演进过程中才出现的（**即vue的ui也可以不写在template里，而是直接在export default下创建render函数里写**）
- jsx本来就是js扩展，转移过程简单直接的多（即jsx{}->React.createElement:)；vue把template编译为render函数的过程需要复杂的编译器转换：模板字符串->ast语法树->js函数

# kreact

由于最后的引入方式是：

`import React,{Component} from './kreact'`

所以要实现createElement和Component两个函数

## 模仿写React.createRlement

class-test创建kreact.js

实现目标：

```
实现<div id='demo'>
      <span>hi</span>
      <Comp name='kaikeba' />
   </div>
```

```
转变成
{
  $$type:'div',
  props:{
     id:'demo'
  },
  children:{
      {
        $$type:'span',
        props:{},
        children:'hi'
      },
      {
         $$type:Comp,
         props:{name:'kaikeba'}
      }
  }
}
```

**由jsx编译成的react.createElement:**

```react
ReactDOM.render(React.createElement) {
    'div',
    {id:'demo'},
        //发生了函数的嵌套
    React.createElement('span',null,'hi')
    React.createElement(Comp,{name:'kaikeba'})
}
参数1：类型；参数2：属性；参数3：孩子元素
```

执行时，从最里面开始执行，逐步执行到外部

**源码：**

想要接收的参数：

`React.createElement(type,props,...children)`

`React.createElement('div',{id:'demo},React.createElement(..))`

但是react中的createElement实际上把所有的children子元素又存放在了第二个参数props中,创建一个vtype变量，通过区分传进来组件的type值判断组件的类型是原生标签还是函数组件还是类组件（用到Component中的标识符），给vtype赋不同的值。最后createElement返回vtype、type、props

```react
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

```



## 实现React.Component

为所有继承Component的类组件提供一些方法，比如setState、forceUpdate,并创建了一个静态变量来判断传入createElement的组件的type类型是构造函数还是类组件

# kreact-dom

## 实现ReactDOM.render

创建kreact-dom，通过调用kvdom中的initVNode方法来将虚拟dom渲染成真实dom

通过container.appendChild把虚拟dom转换成真实dom

```react
import { initVNode } from './kvdom'
function render(vdom, container) {
  // container.innerHTML = `<pre>${JSON.stringify(vdom, null, 2)}</pre>`
  const dom = initVNode(vdom)
  container.appendChild(dom)
}
export default { render }

```

### 实现initVNode

**创建kvdom来实现initVnode初始化虚拟节点，将vdom转换成dom**

```react
export function initVNode(vnode) {
  let { vtype } = vnode

  if (!vtype) {
    // 是文本节点
    return document.createTextNode(vnode)
  }

  if (vtype === 1) {
    // 原生元素
    return createElement(vnode)
  } else if (vtype === 2) {
    // 类组件
    return createClassComp(vnode)
  } else if (vtype === 3) {
    // 类组件
    return createFuncComp(vnode)
  }
}

function createElement(vnode) {
  const { type, props } = vnode
  // 'div'  {id:'demo",children:[],key,ref}
  const node = document.createElement(type)
  const { key, children, ...rest } = props
  Object.keys(rest).forEach((k) => {
    // 给原生标签添加属性
    if (k === 'className') {
      node.setAttribute('class', rest[k])
    } else if (k === 'htmlFor') {
      node.setAttribute('for', rest[k])
    } else {
      node.setAttribute(k, rest[k])
    }
  })

  // 递归子元素
  children.forEach((c) => {
    node.appendChild(initVNode(c))
  })

  return node
}

function createClassComp(vnode) {
  const { type, props } = vnode
  // clas xxx  {...}
  const comp = new type(props)
  // vdom
  const newVNode = comp.render()
  return initVNode(newVNode)
}

function createFuncComp(vnode) {
  const { type, props } = vnode
  // function xxx  {...}
  const newVNode = type(props)
  return initVNode(newVNode)
}

```

由于node节点内可能存在子元素，**所以要递归子元素->foreach**

对于createFunComp和createClassComp这两个函数定义的不同，可以理解成，type虽然都是function，但是一个是初始化构造函数的方法，一个是初始化类的方法。

   **类方法中，通过new一个函数，再执行这个函数里的render方法渲染dom**

即这种类型的代码：

```
class Comp extends Component {
   render() {
   return ......
   }
}
```

  构造函数方法中，直接传参给函数并执行即可

**所以构造函数可以看做是class类中的render方法**

```
"@babel/plugin-proposal-decorators":"^7.8.3",
"babel-plugin-import":"^1.13.0",
"customize-cra":"^0.9.1",
"react-app-rewired":"^2.1.5"
```

# setState

class组件的特点，就是拥有特殊状态并且可以通过setState更新状态并重新渲染视图

## setState特点

**批量，异步**（解决异步：定时器，原生事件（click执行等）,**或者直接把setState的第一个参数改成函数来得到上一次更新的最新值进行操作，解决批量**

```js
//异步
setState({foo:'bar'})
console.log(foo) //'foo'

//不异步
setTimeout(()=>{
    setState({foo:'bar'})
},1000)
//原生事件
dom.addEventListener('click',()=>{
    setState({foo:'bar'})
})
```

```react
class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0
    };
  }
  
  componentDidMount() {
    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 1 次 log

    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 2 次 log

    setTimeout(() => {
      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 3 次 log

      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 4 次 log
    }, 0);
  }
  render() {
    return null;
  }
};
//输出0023
```

## 性能优化：

react会在setState之后，对state进行diff，判断是否有改变，然后再去diff dom判断是否要重新玄反ui，如果每次都更新state，造成dom重绘频繁，会非常损耗性能。因此，将setState设置成异步且批量是一种性能优化。

这一过程包含组件的四个生命周期函数。

- shouleComponentUpdate
- componentWillUpdate
- render
- componentDidUpdate

## **具体实现原理**：

每一个组件都有一个updater更新器。

```
export default class Component{
	static isReactComponent = {}

	constructor(props, context){
		// 创建一个更新器实例
		this.$updater = new Updater(this)
		this.$cache = { isMounted: false }
		this.props = props
		this.state = {}
		this.refs = {}
		this.context = context
	}
```

当setState后，

### ***关于批量：***

- 会触发这个更新器将newState**存入待处理状态数组pendingStates中，目的是为了之后可以批量操作**。

- 然后把更新器存入updateQueue（类似VUE中Dep）**更新队列**中。

  更新时循环更新器存放数组的所有项，执行一遍，并**调用updateComponent，更新实例、属性、状态、上下文，执行回调函数**，其中的**getState**会将penddingStates中的所有state拿出来做遍历进行**合并**，**实现一次更新**，如果是函数形式的，则直接调用实例来执行，从而拿到最新值；最后调用forceUpdate执行新旧vdom比对Diff以及实际更新操作

### ***关于异步：***

**setState本身的执行过程是同步的，只是因为在react的合成事件与钩子函数中执行顺序在更新之前**

React中封装的合成事件（onClick等）以及生命周期钩子里默认的异步操作是因为会首先调用batchUpdate函数，这个函数实现异步；而在React中的原生事件（dom.addEventListner(xxx)）和定时器不会触发batchUpdate函数，导致setState是同步更新的



![img](https://upload-images.jianshu.io/upload_images/5256541-992ce78e70151b57.jpg?imageMogr2/auto-orient/strip|imageView2/2/w/720)

```js
	setState(nextState, callback) {
		// 添加异步队列  不是每次都更新
		this.$updater.addCallback(callback)
		this.$updater.addState(nextState)
	}
	
    addState(nextState) {
		if (nextState) {
			// 存入pendingStates，为了待会批量处理
			this.pendingStates.push(nextState)
			if (!this.isPending) { // 如果没有在工作
				this.emitUpdate()//提交更新
			}
		}
	}
	
	emitUpdate(nextProps, nextContext) {
		this.nextProps = nextProps
		this.nextContext = nextContext
		// receive nextProps!! should update immediately，如果父组件传递了属性，直接走updateComponent，而不进队列
		nextProps || !updateQueue.isPending
		? this.updateComponent()
        //setState走进队列这条路，把当前更新器push到updateQueue更新队列
		: updateQueue.add(this)
	}

// 更新队列
export let updateQueue = {
	//所有的更新器的存放组件
	updaters: [],
	isPending: false,
	add(updater) {
        //push更新器
		this.updaters.push(updater)
	},
    //重要 实现异步
	batchUpdate() {
		if (this.isPending) {
			return
		}
		//如果不在挂载状态，则改变状态
		this.isPending = true
		let { updaters } = this
		let updater
		//循环更新器组件的所有项，执行一遍
		while (updater = updaters.pop()) {
            //执行更新
			updater.updateComponent()
		}
		// 重新变为非挂载态
		this.isPending = false
	}
}

	updateComponent() {
		// this指当前updater，instance为当前组件实例，pendingStates为要更新的状态数组
		let { instance, pendingStates, nextProps, nextContext } = this
		if (nextProps || pendingStates.length > 0) {
			nextProps = nextProps || instance.props
			nextContext = nextContext || instance.context
			this.nextProps = this.nextContext = null
			// getState 合并所有的state的数据，一次更新 
			// shouldUpdate更新实例、属性、状态、上下文，执行回调函数
			shouldUpdate(instance, nextProps, this.getState(), nextContext, this.clearCallbacks)
		}
	}

//重点：实现了批量操作，其中如果发现pendingStates中的一项nextState类型是函数类型，直接执行
  getState() {
		// 拿出实例和待更新状态数组
		let { instance, pendingStates } = this
		// 从组件实例中拿出现有state和props
		let { state, props } = instance
		if (pendingStates.length) {
			// 讲之前的state先做个深拷贝
			state = {...state}
			// setState({foo:'bla', bar:'lala'}) 
			// setState({foo:'dfdf', bar:'dfdfdf'})
			// setState((ns)=>({foo:ns.foo+'dfdf', bar:'dfdfdf'}))
			//则pandingStates里存放的就是[{foo:'bla', bar:'lala'},{foo:'dfdf', bar:'dfdfdf'},(ns)=>({foo:ns.foo+'dfdf', bar:'dfdfdf'})]
			pendingStates.forEach(nextState => {
				// 如果是数组则做替换
				let isReplace = _.isArr(nextState)
				if (isReplace) {
					nextState = nextState[0]
				}
				// 如果传递的是函数  setState((ns)=>({foo:ns.foo+'dfdf', bar:'dfdfdf'}))
				if (_.isFn(nextState)) {
					//直接执行，此时由于pandingStates已经遍历循环了两次，此时state已经是{foo:'dfdf', bar:'dfdfdf'}
					//所以直接执行时可以拿到上次更新的最新值
					nextState = nextState.call(instance, state, props)
				}
				// replace state
				if (isReplace) {
					state = {...nextState}
				} else {
					state = {...state, ...nextState}
				}
			})
			// 全部执行完后，清空数组
			pendingStates.length = 0
		}
		return state
	}

function shouldUpdate(component, nextProps, nextState, nextContext, callback) {
	// 是否应该更新 判断shouldComponentUpdate生命周期
	let shouldComponentUpdate = true
	// 首先判断组件是否存在shouldComponentUpdate
	if (component.shouldComponentUpdate) {
		shouldComponentUpdate = component.shouldComponentUpdate(nextProps, nextState, nextContext)
	}
	if (shouldComponentUpdate === false) {
		component.props = nextProps
		component.state = nextState
		component.context = nextContext || {}
		return
	}
	let cache = component.$cache
	cache.props = nextProps
	cache.state = nextState
	cache.context = nextContext || {}
	// 如果为true，则执行强制更新操作，并传递回调函数
	component.forceUpdate(callback)
}
```

### 解读为什么直接修改this.state无效

> 要知道setState本质是通过一个队列机制实现state更新的。 执行setState时，会将需要更新的state合并后放入状态队列，而不会立刻更新state，队列机制可以批量更新state。
>  如果不通过setState而直接修改this.state，那么这个state不会放入状态队列中，下次调用setState时对状态队列进行合并时，会忽略之前直接被修改的state，这样我们就无法合并了，而且实际也没有把你想要的state更新上去。



# 虚拟DOM原理

为什么要有虚拟dom

因为真实的DOM操作很慢，而且轻微的操作都会导致页面重新排版、重绘，非常消耗性能。而如果可以通过diff算法对比新旧vdom的差异，可以批量的、最小化的执行dom操作来提高性能。

在哪里生成的？

react中用jsx语法描述视图，通过babel-loader转译后它们变成React.createElement(...)形式，该函数将生成的vdom来描述真是dom，假如状态变化，vdom则做出响应改变，再通过diff算法对比新旧vdom区别从而做出最终dom操作

# ！Hooks原理（数据结构）

可以见react文件夹下的test文件夹下的一些实现和笔记

好文章:https://github.com/brickspert/blog/issues/26

hooks实现了函数组件的生命状态，最重要的有useState和useEffect

### 待回答的问题

- **为什么只能在函数最外层调用Hook？为什么不要在循环、条件判断或子函数中调用？**

​       因为react会根据hook定义的顺序来放置数据，重新render时又会根据顺序来重新执行，如果放在内层，hook顺序变化，react不会感知

- **自定义的hook是如何影响使用它的函数组件？**

与react自带的hook共用同一个顺序

- **为什么useEffect的第二个参数是空数组时相当于ComponentDidMount，只会执行一次？**

因为它只会在初次渲染时执行一次（hasDepChange这时为true），然后再也不会改变了（hasDepChange为false）

- **“Capture Value” 特性是如何产生的？**

这个特性指的是每次触发副作用时，都会保留触发时刻的state和props，在触发期间（如定时器的延时期间）更改的state和props并不会保留在这次副作用上

例子：https://cloud.tencent.com/developer/article/1607256

```react
import React, { useState, useEffect, useCallback, useRef } from "react";
import ReactDOM from "react-dom";

function Example() {
  const [count, setCount] = useState(0);

  // useEffect(() => {
  //   setTimeout(() => {
  //     alert("count: " + count);
  //   }, 3000);
  // }, [count]);
  const handleClick = useCallback(() => {
    setTimeout(() => {
      alert("COUNT" + count);
    }, 3000);
  }, [count]);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        增加 count
      </button>
      <button onClick={() => setCount(count - 1)}>减少 count</button>
      <button onClick={() => handleClick()}>显示</button>
    </div>
  );
}
const rootElement = document.getElementById("root");
ReactDOM.render(<Example />, rootElement);

```



   **产生原因**：每次re Render时，都会重新去执行函数组件

   **解决方法**：借助ref类型变量绕过Capture Value

```react
import React, { useState, useEffect, useCallback,useRef } from "react";
import ReactDOM from "react-dom";

function Example() {
  const [count, setCount] = useState(0);

  // useEffect(() => {
  //   setTimeout(() => {
  //     alert("count: " + count);
  //   }, 3000);
  // }, [count]);
  const countRef = useRef(null)
  const handleClick = useCallback(()=>{
    setTimeout(()=>{
     
      alert('COUNT'+countRef.current)
    },3000)
  },[count])

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => {
        countRef.current = count+1
        setCount(count + 1)}}>增加 count</button>
      <button onClick={() => setCount(count - 1)}>减少 count</button>
     <button onClick={()=>handleClick()}>显示</button>
    </div>
  );
}
const rootElement = document.getElementById("root");
ReactDOM.render(<Example />, rootElement);
```



1.初步实现useState

```
var _state
function useState(initialValue) {
  _state = _state || initialValue // 第一次没有_state时初始化赋值
  function setState(newState) {
    _state = newState
    render()
  }
  return [_state, setState]
}

```

2.初步实现useEffect

```js
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

```

3.出现的问题：

到现在为止，我们已经实现了可以工作的 useState 和 useEffect。但是有一个很大的问题：它俩都只能使用一次，因为只有一个 _state 和 一个 _deps。比如



```
const [count, setCount] = useState(0);
const [username, setUsername] = useState('fan');
```



count 和 username 永远是相等的，因为他们共用了一个 _state，并没有地方能分别存储两个值。我们需要可以存储多个 _state 和 _deps。



如 《[React hooks: not magic, just arrays](https://medium.com/@ryardley/react-hooks-not-magic-just-arrays-cd4f1857236e)》所写，我们可以使用数组，来解决 Hooks 的复用问题。



demo6：https://codesandbox.io/s/50ww35vkzl



代码关键在于：



1. 初次渲染的时候，按照 useState，useEffect 的顺序，把 state，deps 等按顺序塞到 memoizedState 数组中。
2. 更新的时候，按照顺序，从 memoizedState 中把上次记录的值拿出来。
3. 如果还是不清楚，可以看下面的图。



```
let memoizedState = []; // hooks 存放在这个数组
let cursor = 0; // 当前 memoizedState 下标

function useState(initialValue) {
  memoizedState[cursor] = memoizedState[cursor] || initialValue;
  const currentCursor = cursor;
  function setState(newState) {
    memoizedState[currentCursor] = newState;
    render();
  }
  return [memoizedState[cursor++], setState]; // 返回当前 state，并把 cursor 加 1
}

function useEffect(callback, depArray) {
  const hasNoDeps = !depArray;
  const deps = memoizedState[cursor];
  const hasChangedDeps = deps
    ? !depArray.every((el, i) => el === deps[i])
    : true;
  if (hasNoDeps || hasChangedDeps) {
    callback();
    memoizedState[cursor] = depArray;
  }
  cursor++;
}
```



我们用图来描述 memoizedState 及 cursor 变化的过程。



**1. 初始化**




 [![1](https://user-images.githubusercontent.com/12526493/56090138-6871ae80-5ed0-11e9-8ffe-2056411a19d3.png)](https://user-images.githubusercontent.com/12526493/56090138-6871ae80-5ed0-11e9-8ffe-2056411a19d3.png)



**2. 初次渲染**



[![2](https://user-images.githubusercontent.com/12526493/56090141-71628000-5ed0-11e9-9ac9-3a766be35941.png)](https://user-images.githubusercontent.com/12526493/56090141-71628000-5ed0-11e9-9ac9-3a766be35941.png)



**3. 事件触发**



[![3](https://user-images.githubusercontent.com/12526493/56090143-745d7080-5ed0-11e9-8d05-c66053a15b63.png)](https://user-images.githubusercontent.com/12526493/56090143-745d7080-5ed0-11e9-8d05-c66053a15b63.png)



**4. Re Render**

[![4](https://user-images.githubusercontent.com/12526493/56090147-78898e00-5ed0-11e9-8b8c-8768c7651044.png)](https://user-images.githubusercontent.com/12526493/56090147-78898e00-5ed0-11e9-8b8c-8768c7651044.png)

### hooks实际原理

React 中是通过类似**单链表**的形式来代替数组的。通过 next 按顺序串联所有的 hook。

```js
type Hooks = {
	memoizedState: any, // 指向当前渲染节点 Fiber
  baseState: any, // 初始化 initialState， 已经每次 dispatch 之后 newState
  baseUpdate: Update<any> | null,// 当前需要更新的 Update ，每次更新完之后，会赋值上一个 update，方便 react 在渲染错误的边缘，数据回溯
  queue: UpdateQueue<any> | null,// UpdateQueue 通过
  next: Hook | null, // link 到下一个 hooks，通过 next 串联每一 hooks
}
 
type Effect = {
  tag: HookEffectTag, // effectTag 标记当前 hook 作用在 life-cycles 的哪一个阶段
  create: () => mixed, // 初始化 callback
  destroy: (() => mixed) | null, // 卸载 callback
  deps: Array<mixed> | null,
  next: Effect, // 同上 
};
```

# ！Fiber原理

fiber之前，react是同步渲染，如果层级过深，容易造成堵塞主线程

而fiber实现异步渲染，将组件的渲染过程分为两个部分：reconciliation Phase 和Commit Phase

Reconciliation Phase的任务干的事情是，找出要做的更新工作（Diff Fiber Tree），就是一个计算阶段，计算结果可以被缓存**，也就可以被打断**；Commmit Phase 需要提交所有更新并渲染，为了防止页面抖动，**被设置为不能被打断**。

**fiber的数据结构：**

1.**fiber实际上是一个链表，有child、sibling、return属性**。

-  child指向第一个子节点
-  sibling指向第一个兄弟节点
-  return指向parent节点

2.更新队列，`updateQueue`，是一个链表，有`first`和`last`两个属性，指向第一个和最后一个`update`对象。[详见源码](https://github.com/facebook/react/blob/v16.3.2/packages/react-reconciler/src/ReactFiberUpdateQueue.js#L49)。

3.每个fiber有一个属性`updateQueue`指向其对应的更新队列。

4.每个fiber（当前fiber可以称为`current`）有一个属性`alternate`，开始时指向一个自己的clone体，`update`的变化会先更新到`alternate`上，当更新完毕，`alternate`替换`current`。

![这里写图片描述](https://img-blog.csdn.net/20180428113734143?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FpcWluZ2ppbg==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

### 中心思想

保留一个指向当前被处理fiber node的**引用**，随着深度优先的向下遍历，不断地修正这个引用，直到遍历触及到这个树分支的叶子节点。一旦到底，再通过return字段层层地返回到上一层的parent fiber node上去