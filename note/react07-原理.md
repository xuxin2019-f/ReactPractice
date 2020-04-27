## 最核心的api

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