# 移动App第3天

## ReactJS简介
+ React 起源于 Facebook 的内部项目，因为该公司对市场上所有 JavaScript MVC 框架，都不满意，就决定自己写一套，用来架设 Instagram 的网站。做出来以后，发现这套东西很好用，**就在2013年5月开源了**。
+ 由于 React 的设计思想极其独特，属于革命性创新，性能出众，代码逻辑却非常简单。所以，越来越多的人开始关注和使用，认为它可能是将来 Web 开发的主流工具。
+ library
+ Framework


## 前端三大主流框架
+ Angular.js：出来最早的前端框架，学习曲线比较陡，NG1学起来比较麻烦，NG2开始，进行了一系列的改革，也开始启用组件化了；在NG中，也支持使用TS（TypeScript）进行编程；
+ Vue.js：最火的一门前端框架，它是中国人开发的，对我我们来说，文档要友好一些；
+ React.js：最流行的一门框架，因为它的设计很优秀；
+ windowsPhone 7    7.5   8   10


## React与vue.js的对比
### 组件化方面
1. 什么是模块化：从 **代码** 的角度，去分析问题，把我们编程时候的业务逻辑，分割到不同的模块中来进行开发，这样能够**方便代码的重用**；
2. 什么是组件化：从 **UI** 的角度，去分析问题，把一个页面，拆分为一些互不相干的小组件，随着我们项目的开发，我们手里的组件会越来越多，最后，我们如果要实现一个页面，可能直接把现有的组件拿过来进行拼接，就能快速得到一个完整的页面， 这样方**便了UI元素的重用**；**组件是元素的集合体**；
3. 组件化的好处：
4. **Vue是如何实现组件化的：.vue 组件模板文件，浏览器不识别这样的.vue文件，所以，在运行前，会把 .vue 预先编译成真正的组件；**
 + template： UI结构
 + script： 业务逻辑和数据
 + style： UI的样式
5. **React如何实现组件化：在React中实现组件化的时候，根本没有 像 .vue 这样的模板文件，而是，直接使用JS代码的形式，去创建任何你想要的组件；**
 + React中的组件，都是直接在 js 文件中定义的；
 + **React的组件，并没有把一个组件 拆分为 三部分（结构、样式、业务逻辑），而是全部使用JS来实现一个组件的；（也就是说：结构、样式、业务逻辑是混合在JS里面一起编写出来的）**

### 数据流方面

1. 在 Vue 中，默认提供了`v-model`指令，可以很方便的实现 `数据的双向绑定`；

2. 但是，在 React 中，默认只是`单向数据流`，也就是 只能把 state 上的数据绑定到 页面，无法把 页面中数据的变化，自动同步回 state ； 如果需要把 页面上数据的变化，保存到 state，则需要程序员手动监听`onChange`事件，拿到最新的数据，手动调用`this.setState({ })` 更改回去；

3. 案例：

   ```
   <input type="text" style={{ width: '100%' }} value={this.state.msg} onChange={() => this.textChanged()} ref="mytxt" />
   
    // 响应 文本框 内容改变的处理函数
     textChanged = () => {
       // console.log(this);
       // console.log(this.refs.mytxt.value);
       this.setState({
         msg: this.refs.mytxt.value
       })
     }
   ```

   

### 开发团队方面
+ React是由FaceBook前端官方团队进行维护和更新的；因此，React的维护开发团队，技术实力比较雄厚；
+ Vue：第一版，主要是有作者 尤雨溪 专门进行维护的，当 Vue更新到 2.x 版本后，也有了一个小团队进行相关的维护和开发；

### 社区方面
+ 在社区方面，React由于诞生的较早，所以社区比较强大，一些常见的问题、坑、最优解决方案，文档、博客在社区中都是可以很方便就能找到的；
+ Vue是近两年才诞生开源出来的，所以，它的社区相对于React来说，要小巧一些，所以，可能有的一些坑，没人踩过；

### 移动APP开发体验方面
+ Vue，结合 Weex 这门技术，提供了 迁移到 移动端App开发的体验（Weex，目前只是一个 小的玩具， 并没有很成功的 大案例；）
+ React，结合 ReactNative，也提供了无缝迁移到 移动App的开发体验（RN用的最多，也是最火最流行的）；



## 为什么要学习React
1. 设计很优秀，是基于组件化的，方便我们UI代码的重用；
2. 开发团队实力强悍，不必担心短更的情况；
3. 社区强大，很多问题都能找到对应的解决方案；
4. 提供了无缝转到 ReactNative 上的开发体验，让我们技术能力得到了拓展；增强了我们的核心竞争力

## 复习导入import

react中的index.js导入放在最上方

1.默认导入

import xxx from ‘./xxxx’  对应 export default 数据

2.按需导入

import { a1, a2 } from ‘./xxxx’  对应按需导出：先定义再导出：let num = 1; export{num};或定义加导出：export let num = 2

3.全体导入

import * as 别名 from ‘./xxxx’

import是es6中的导入（属于浏览器），require属于nodejs的导入，

import属于加载前置的机制，因此将其全放在代码顶部，代码解析诸葛import获取一个引入的列表，先引入依赖，再向下执行代码，加载前置

require加载滞后，代码执行到哪一行才进行加载

## 复习类class

属于es6的语法

1.与构造函数对比创建属性和方法：

```
function obj() {
			
		}
		obj.prototype.age = 1;// 实例属性 在 prototype里能看到
		
		obj.statictest = 'abc'// 静态属性 在constuctor里能看到
		let o = new obj()
		console.log(o)
```

```
// class
		//实例可以访问静态属性(先有静态)
		//静态无法访问实例
		class obj1 {
			// 静态属性 构造函数
			static staticage = 999
			static statifn = function() {
				console.log('静态')
			}
			
			// 实例
			myage = 123;
			// myfn:function() {
			// 	这种写法不正确,要用es6的函数简写
			// }
			myfn() {
				// es6的函数简写的this和function是一致的,用的就是自己的，只有箭头函数才向上用别人的this
				console.log('实力函数',this.myage)
			}
		}
```

2.与构造函数相比的继承

构造函数的原型链继承：

a.prototype = new b()....

class的继承：

son extends father

在son中通过super()方法初始化父类的构造器

```
class person {
			age = 100;// 写死了
			// 动态的写
			constructor(props){
				this.age = props.age
				console.log('触发person')
			}
		}
		class boy extends person {
			// 这里的extends继承,类似于构造函数中的原型链继承
			name = 'jack';
			constructor(props){
				super(props); //初始化父类的构造器
				this.name = props.name;
				console.log('触发了boy')
			}
		}
		// let p = new boy()
		// console.log(p)
		let p = new boy({name:'micky',age:18})
		console.log(p)
```



## React中几个核心的概念
### 虚拟DOM（Virtual Document Object Model）
 + DOM的本质是什么：就是用JS表示的UI元素

 + **手动模拟DOM树的原理：**

    **使用JS创建一个对象，用这个对象，来模拟每个DOM节点，然后在每个DOM节点中，又提供了类似children这样的属性，来描述当前DOM节点的子节点，这样当DOM节点形成了嵌套关系，就模拟出了一颗DOM树**

   ![虚拟dom](F:\图片\虚拟dom.png)

 + DOM和虚拟DOM的区别：
   - DOM是由浏览器中的JS提供功能，所以我们只能人为的使用 浏览器提供的固定的API来操作DOM对象；
   - 虚拟DOM：并不是由浏览器提供的，而是我们程序员手动模拟实现的，类似于浏览器中的DOM，但是有着本质的区别；
 - 为什么要实现虚拟DOM：

 - 什么是React中的虚拟DOM：

 - 虚拟DOM的目的：

     为了实现DOM节点的高效更新

 - ![虚拟DOM - 表格排序案例](images/虚拟DOM引入图片.png)

### Diff算法
 - tree diff:**新旧DOM树，每一层逐层对比的方式，就叫做 tree diff**,每当我们从前到后，把所有层的节点对比完后，必然能够找到那些 需要被更新的元素；
 - component diff：**在对比每一层的时候，组件之间的对比，叫做 component diff**;当对比组件的时候，如果两个组件的类型相同，则暂时认为这个组件不需要被更新，如果组件的类型不同，则立即将旧组件移除，新建一个组件，替换到被移除的位置；
 - element diff:**在组件中，每个元素之间也要进行对比，那么，元素级别的对比，叫做 element diff**；
 - key：key这个属性，可以把 页面上的 DOM节点 和 虚拟DOM中的对象，做一层关联关系；
![Diff算法图](images/Diff.png)

### 事件绑定

1.React中，提供的事件绑定机制，使用的是驼峰命名，基本上传统的js事件都被react重新定义成了驼峰命名的onMouseMove 。 如onclick->onClick

2.在React提供的事件绑定机制中，事件的处理函数必须直接给定一个function，而不能给函数名称,需要通过this.函数名把函数的引用交给事件： a：onClick = { this.fn}  b：onClick = {(e)=>this.fn(e)}

## React项目的创建

### 开课吧的教程

#### 脚手架

内部如果依赖yarn工具

先npm i yarn -g

下载npm i -g create-react-app

使用：

任意项目内create-react-app 项目名 （options） 构建项目结构

cd 项目目录 && npm i 安装依赖包

运行：用yarn！！！

npm/yarn run start启动

npm run build 生成dist

发现其实生成的index.js里就是黑马的基础语法

其中app.js中的代码块属于**jsx语法**

```
<div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
```



### 黑马的教程（细节）

1. 运行 `cnpm i react react-dom -S` 安装包
2. 在项目中导入两个相关的包：
```
// 1. 在 React 学习中，需要安装 两个包 react  react-dom
// 1.1 react 这个包，是专门用来创建React组件、组件生命周期等这些东西的；
// 1.2 react-dom 里面主要封装了和 DOM 操作相关的包，比如，要把 组件渲染到页面上
import React from 'react'
import ReactDOM from 'react-dom'
```
3. 使用JS的创建虚拟DOM节点：
```
    // 2. 在 react 中，如要要创建 DOM 元素了，只能使用 React 提供的 JS API 来创建，不能【直接】像 Vue 中那样，手写 HTML 元素
    // React.createElement() 方法，用于创建 虚拟DOM 对象，它接收 3个及以上的参数
    // 参数1： 是个字符串类型的参数，表示要创建的元素类型
    // 参数2： 是一个属性对象，表示 创建的这个元素上，有哪些属性
    // 参数3： 从第三个参数的位置开始，后面可以放好多的虚拟DOM对象，这写参数，表示当前元素的子节点
    // <div title="this is a div" id="mydiv">这是一个div</div>

    var myH1 = React.createElement('h1', null, '这是一个大大的H1')

    var myDiv = React.createElement('div', { title: 'this is a div', id: 'mydiv' }, '这是一个div', myH1)
```
4. 使用 ReactDOM 把元素渲染到页面指定的容器中：
```
    // ReactDOM.render('要渲染的虚拟DOM元素', '要渲染到页面上的哪个位置中')
    // 注意： ReactDOM.render() 方法的第二个参数，和vue不一样，不接受 "#app" 这样的字符串，而是需要传递一个 原生的 DOM 对象
    ReactDOM.render(myDiv, document.getElementById('app'))
```


## JSX语法 js+xml
1. 如要要使用 JSX 语法，必须先运行 `cnpm i babel-preset-react -D`，然后再 `.babelrc` 中添加 语法配置；（脚本架里就不用了）
2. **JSX语法的本质：还是以 React.createElement 的形式来实现的，并没有直接把 用户写的 HTML代码，渲染到页面上；**
3. **如果要在 JSX 语法内部，书写 JS 代码了，那么，所有的JS代码，必须写到 {} 内部；**
4. **当 编译引擎，在编译JSX代码的时候，如果遇到了`<`那么就把它当作 HTML代码去编译，如果遇到了 `{}` 就把 花括号内部的代码当作 普通JS代码去编译；**
5. 在{}内部，可以写任何符合JS规范的代码；
6. **在JSX中，如果要为元素添加`class`属性了，那么，必须写成`className`，因为 `class`在ES6中是一个关键字；和`class`类似，label标签的 `for` 属性需要替换为 `htmlFor`.**
7. 在JSX创建DOM的时候，**所有的节点，必须有唯一的根元素进行包裹**；
8. 如果要写注释了，注释必须放到 {} 内部



## React中创建组件的方式

## 第一种基本组件的创建方式

在react中，**构造函数或者是类就是一个基本的组件**

如果要把组件放到页面中，可以把构造函数或者是类的名称当做组件的名称，以html标签形式引入页面中

注意react在解析所有标签是，是以标签的首字母来区分的，如果首字母大写，则按照组件的形式去解析，如果是小写，则按照html标签来解析，**所以组件首字母必须大写**

```
// 这就是一个组件
function Hello() {
	return 123
}
ReactDOM.render(<div><Hello></Hello></div>, document.getElementById('root'));
```

### 父组件向子组件传递数据

为组件传递数据：

```
// 使用组件并 为组件传递 props 数据
<Hello name={dog.name} age={dog.age} gender={dog.gender}></Hello>

// 在构造函数中，使用 props 形参，接收外界 传递过来的数据
function Hello(props) {
  // props.name = 'zs'
  console.log(props)
  // 结论：不论是 Vue 还是 React，组件中的 props 永远都是只读的；不能被重新赋值；

  return <div>这是 Hello 组件 --- {props.name} --- {props.age} --- {props.gender}</div>
}
```

还可以传递方法，子组件再通过方法的参数传递给父组件信息

```
父组件
<Clock change={date => console.log(date.toLocaleTimeString())}/>
子组件
 //定时器
    this.timerid = setInterval(()=>{
      this.setState({
        date: new Date()
      },()=>{
        // 每次状态更新就通知父组件
        this.props.change(this.state.date);//直接把最新的state数据 传递给父组件
      })
    },1000)
```



### 属性扩散

...obj语法，表示把这个对象上的所有属性展开放在这个位置

<Hello name={dog.name} age={dog.age} gender={dog.gender}></Hello>相等于<Hello {...dog}></Hello>


### 将组件封装到单独的文件中



## React中：第二种创建组件的方式

使用 class 关键字来创建组件

ES6 中 class 关键字，是实现面向对象编程的新形式；

### 了解ES6中class关键字的使用


### 基于class关键字创建组件
+ 使用 class 关键字来创建组件
```
class Person extends React.Component{
    // 通过报错提示得知：在class创建的组件中，必须定义一个render函数
    render(){
        // 在render函数中，必须返回一个null或者符合规范的虚拟DOM元素
        return <div>
            <h1>这是用 class 关键字创建的组件！</h1>
        </div>;
    }
}
开课吧的教程：APP.js里：
import React, { Component } from 'react';

class App extends Component{
	constructor() {
		// 必须要写super
		super();
	    // 初始化属于组件的属性
		this.state = {
			num: ""
		}
	}
	changeHandler(e) {
		console.log(e.target.value)
		// 此时只写this.state.num = e.target.value不起作用
		// this.state.num = e.target.value
		// 通知视图更新函数来实现双向数据绑定
		// this.setState({})
		 this.setState({
			 num: e.target.value
		 })
	}
	// 指定render内容
	render() {
		// 也要保证一个根节点
		return (
		     <div> 
		         大家好我是react
				 { this.state.num }
				 // 同时value里也要设置
				 <input type="text" value={this.state.num} onChange={(e)=>{
					 this.changeHandler(e)
				 }} />
			 </div>
		)
	}
}

export default App;

黑马：
import React from 'react'
基于class关键字创建组件
最基本的组件结构：

class 组件名称 extends React.Component {
    render(){
        return <div>这是 class 创建的组件</div>
    }
}
```

## Refs&DOM

下面是几个适合使用 refs 的情况：

- 管理焦点，文本选择或媒体播放。
- 触发强制动画。
- 集成第三方 DOM 库。

常用用法：

创建：this.myRef = React.createRef（）

添加：通过ref属性附加 ref={this.myRef}

访问：this.myRef.current

```react
import React, { Component } from 'react'
export default class Parent extends Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }
  focus = () => {
    this.inputRef.current.focus()
  }
  render() {
    return (
      <div>
        <input ref={this.inputRef} type="text" />
        <button onClick={this.focus}>聚焦</button>
      </div>
    )
  }
}
```

**注意**

ref 的值根据节点的类型而有所不同：

- 当 `ref` 属性用于 HTML 元素时，构造函数中使用 `React.createRef()` 创建的 `ref` 接收底层 DOM 元素作为其 `current` 属性。
- 当 `ref` 属性用于自定义 class 组件时，`ref` 对象接收组件的挂载实例作为其 `current` 属性。
- **你不能在函数组件上使用 `ref` 属性**，因为他们没有实例。但可以在函数组件内部使用ref属性，只要将它指向一个DOM元素或者class组件（**使用useRef**）

```react
function CustomTextInput(props) {
  // 这里必须声明 textInput，这样 ref 才可以引用它
  const textInput = useRef(null);

  function handleClick() {
    textInput.current.focus();
  }

  return (
    <div>
      <input
        type="text"
        ref={textInput} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );
}
函数组件
import React from 'react';

export default function MyInput(props) {
    const inputRef = React.useRef(null);
    React.useEffect(() => {
        inputRef.current.focus();
    });
    return (
        <input type="text" ref={inputRef} />
    )
}

```

#### 回调ref

不同于传递 `createRef()` 创建的 `ref` 属性，你会传递一个函数。这个函数中接受 React 组件实例或 HTML DOM 元素作为参数，以使它们能在其他地方被存储和访问

```react
import React, { Component } from 'react'
export default class Parent extends Component {
  constructor(props) {
    super(props)
    // this.inputRef = React.createRef()
    this.inputRef = null
  }
  focus = () => {
    this.inputRef.focus()
  }
  render() {
    return (
      <div>
        {/* {回调ref} */}
        <input ref={(el) => (this.inputRef = el)} type="text" />
        <button onClick={this.focus}>聚焦</button>
      </div>
    )
  }
}

```

React 将在组件挂载时，会调用 `ref` 回调函数并传入 DOM 元素，当卸载时调用它并传入 `null`。在 `componentDidMount` 或 `componentDidUpdate` 触发前，React 会保证 refs 一定是最新的。

你可以在组件间传递回调形式的 refs，就像你可以传递通过 `React.createRef()` 创建的对象 refs 一样。

#### 转发refs

**将 DOM Refs 暴露给父组件**

在极少数情况下，你可能希望在**父组件中引用子节点的 DOM 节点**。通常不建议这样做，因为它会打破组件的封装，但它偶尔可用于触发焦点或测量子 DOM 节点的大小或位置。

虽然你可以[向子组件添加 ref](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html#adding-a-ref-to-a-class-component)，但这不是一个理想的解决方案，因为你只能获取组件实例而不是 DOM 节点。并且，它还在函数组件上无效。

如果你使用 16.3 或更高版本的 React, 这种情况下我们推荐使用 [ref 转发](https://zh-hans.reactjs.org/docs/forwarding-refs.html)。**Ref 转发使组件可以像暴露自己的 ref 一样暴露子组件的 ref**。关于怎样对父组件暴露子组件的 DOM 节点，在 [ref 转发文档](https://zh-hans.reactjs.org/docs/forwarding-refs.html#forwarding-refs-to-dom-components)中有一个详细的例子。



**refs转发：**

在 Hook 之前，高阶组件(HOC) 和 render `props` 是 React 中复用组件逻辑的主要手段。

尽管高阶组件的约定是将所有的 `props` 传递给被包装组件，但是 `refs` 是不会被传递的，事实上， `ref` 并不是一个 `prop`，和 `key` 一样，它由 React 专门处理。

这个问题可以通过 `React.forwardRef` (React 16.3中新增)来解决。

例子：

```react
const FancyButton = React.forwardRef((props, ref) => {
  return <input type="text" ref={ref} {...props} />
})
// const inputRef = React.createRef()
export default function Parent(props) {
  const inputRef = React.useRef()
  React.useEffect(() => {
    //此时inputRef.current指向input
    console.log(inputRef.current)
  })
  return (
    <div>
      <FancyButton ref={inputRef} />
    </div>
  )
}

```



# this.setState({})

1.里面可以直接传对象，也可以写一个方法，**写方法时要return**

```
changeHandler = (e)=> {
		//这里react默认方法中this指向undefined
		//console.log(e.target.value)
		//console.log(this)
		// this.setState({
		// 	num:e.target.value
		// })
        console.log(e.target.value)
		this.setState(function(prevState,props){
			// 在function的参数中，支持传递两个参数，其中第一个参数表示为修改之前的state
			// 第二个参数为props，是外界传递给当前组件的props数据
			console.log(prevState)
			console.log(props)
			return{
				num:'123'
			}
		},function(){
			// 由于setState是异步执行的，所以如果要拿到最新的修改结果，在回调函数里操作
			console.log(this.state.num)
		})
		// 经测试发现，this.setState在调用时内部是异步执行的，
		//所以当立即调用完this.setState后，输出的state可能是旧的
		//console.log(this.state.num)
	}
```

2.setState是批量操作的

3.this.setState通常是异步的：

**解决方法是第一个参数不以对象的形式来修改，而是以函数的形式修改**，函数参数(state,props),state代表**上一次更新后**的值，然后在函数里直接通过state.counter来修改，不要再拿this.state.counter修改（可能拿到旧值））

```
// 假如couter初始值为0，执行三次以后其结果是多少？
    // 若同一个key多次出现，最后那个起作用
    // this.setState({ counter: this.state.counter + 1 }, ()=>{
    //     console.log(this.state.counter); // 1
    // }); 
    // this.setState({ counter: this.state.counter + 1 }, ()=>{
    //     console.log(this.state.counter); // 1
    // }); 
    // this.setState({ counter: this.state.counter + 1 }, ()=>{
    //     console.log(this.state.counter); // 1
    // }); 
    这个回调函数会在值全部更新完才执行
    
    或者直接用函数的形式执行：
    this.setState((state,props)=>{拿到最新的值})
    
    this.setState(
      nextState => {
        console.log(nextState.counter); // 0
        return { counter: nextState.counter + 1 }; // 1
      },
      () => {
        console.log(this.state.counter); // 3
      }
    );
    this.setState(
      nextState => {
        console.log(nextState.counter); // 1
        return { counter: nextState.counter + 1 }; // 2
      },
      () => {
        console.log(this.state.counter); // 3
      }
    );
    this.setState(
      nextState => {
        console.log(nextState.counter); // 1
        return { counter: nextState.counter + 1 }; // 2
      },
      () => {
        console.log(this.state.counter); // 3
      }
    );
    所有的回调函数都是在所有state更新后才执行的，所以都是3
```



## 实现数据双向绑定

在react中，触发事件实际上是要将当前组件的引用传给函数。

第一种方法：

```
<input type="text" value={this.state.num} onChange={(e)=>{
					 this.changeHandler(e)
				 }} />箭头函数本身就是向上绑定，这里是window
				 
				 
				 changeHandler(e) {
		console.log(e.target.value)
		// 此时只写this.state.num = e.target.value不起作用
		// this.state.num = e.target.value
		// 通知视图更新函数
		// this.setState({})
		 this.setState({
			 num: e.target.value
		 })
	}
```

第二种：

```
<input type="text" value={this.state.num} onChange={
					 this.changeHandler
				 } />
				 
在constructor中提前绑定this：
constructor() {
		// 必须要写super
		super();
	    // 初始化属于组件的属性
		this.state = {
			num: ""
		}
		this.changeHandler = this.changeHandler.bind(this)
	}
	changeHandler(e) {
		console.log(e.target.value)
		console.log(this)
		this.setState({
			num:e.target.value
		})
	}
```

```
第三种：
直接将函数写成箭头函数的模式
changeHandler = (e)=> {
		//这里react默认方法中this指向undefined
		console.log(e.target.value)
		console.log(this)
		this.setState({
			num:e.target.value
		})
	}
	<input type="text" value={this.state.num} onChange={
					 this.changeHandler
				 } />
不论是 Vue 还是 React，组件中的 props 永远都是只读的；不能被重新赋值；
而React中的state相当于Vue中的data，可被重新赋值 
```

## 两种创建组件方式的对比

构造函数在外部定义时，要引入React；类在外部定义时，还要引入component，并继承

构造函数创造的组件如果想接受父组件传递的参数，必须在函数参数里预先定义props：function fn(props)

类中的render可以直接通过this.props（返回的是一个数组）访问到，不需要预先定义；但constructor还是要预定义props形参

注意：render中可以通过this.props.属性名拿到父组件传来的属性内容，通过this,props.children渲染父组件在子组件内部插入的内容

1. **用构造函数创建出来的组件：专业的名字叫做“无状态组件”**

   **更新：函数组件的状态管理：hooks**

     **主要api：useState，useEffect**

2. **用class关键字创建出来的组件：专业的名字叫做“有状态组件”**

   

   ***关于状态的最新笔记见pdf加router那个文件夹里的StateMgt.js***

   

> 用构造函数创建出来的组件，和用class创建出来的组件，这两种不同的组件之间的**本质区别就是**：有无state属性！！！
> 有状态组件和无状态组件之间的本质区别就是：有无state属性！
>
> **同时，class创建的组件有自己的生命周期函数，构造函数创建的组件没有生命周期函数**
>
> 如何区别使用这两种创建方法：
>
> 1.如果组件需要存放自己的私有数据，或者需要在组件的不同阶段执行不同的业务功能，创建类
>
> 2.如果一个组件只需要根据外界传递过来的props，渲染固定的页面结构，就用function，好处：由于剔除了组件的生命周期，所以运行速度会稍微快一点点

## this.props.children

父组件引用子组件标签时，在标签中间传递的标签或内容子组件可以通过this.props.children访问到

```
父组件：
ReactDOM.render(<CommentList header={<div>头部</div>}>
<ul><li>1</li><li>2</li><li>3</li></ul>
</CommentList>
, document.getElementById('root'));
子组件：
render() {
return
{this.props.header}
{this.props.children}
}
```

this.props.children有可能有三种数据结构：对象/数组/undefined

{React.Children.map(children（是this.props的引用),function[(thisArg)])} //返回数组

避免空节点和undefined

## 一个小案例，巩固有状态组件和无状态组件的使用

### 通过for循环生成多个组件
1. 数据：
```
CommentList = [
    { user: '张三', content: '哈哈，沙发' },
    { user: '张三2', content: '哈哈，板凳' },
    { user: '张三3', content: '哈哈，凉席' },
    { user: '张三4', content: '哈哈，砖头' },
    { user: '张三5', content: '哈哈，楼下山炮' }
]
```

2.渲染

```
import React,{Component} from 'react'
class CommentList extends Component {
	constructor(props) {
		super(props)
		
		this.state = {
			cmts:[
                  { user: '张三', content: '哈哈，沙发' },
                  { user: '张三2', content: '哈哈，板凳' },
                  { user: '张三3', content: '哈哈，凉席' },
                  { user: '张三4', content: '哈哈，砖头' },
                  { user: '张三5', content: '哈哈，楼下山炮' }
                  ]
		}
	}
	// 在有状态组件中，render函数是必须的，表示渲染哪些虚拟dom元素并展示出来
	render() {
		// js区域
		// 方式1 ，不好，要把jxs和js语法结合起来使用
		// var arr = []
		// this.state.cmts.forEach(item=>{
		// 	arr.push(<h1>{item.user}</h1>)
		// })
		return (<div>
		{this.state.cmts.map((item,i)=>{
					//{}里写jsx和js语法
			// 我们可以直接在jsx语法内部，使用数组的map函数来遍历数组的每一项并使用map返回操作后最新的数组
			// 循环要写唯一的key，在vue中要写成:key="i",react中要用{},且不用:
			return <div key={i}>
			<h1>{item.user}</h1>
			<h3>{item.content}</h3>
			</div>
		})}
		</div>)
	}
}
export default CommentList;
```

优化：将组件提取出来：

```
// 封装一个评论项组件， 此组件由于不需要自己的私有数据，直接定义为无状态组件
function CommentList1(props) {
	return <div>
	<h1>{props.user}</h1>
	<h3>{props.content}</h3>
	</div>
}

render() {
		return (<div>
		{this.state.cmts.map((item,i)=>{
			//return <CommentList1 user={item.user} content={item.content} key={i}></CommentList1>
			// 再优化：利用属性扩散
			return <CommentList1 {...item} key={i}></CommentList1>
		})}
		</div>)
	}
```



### style样式

1. 使用普通的 `style` 样式

   **如果要用style属性为jsx语法创建的dom元素设置样式，要用js语法来写**

   **style{{}}，外层花括号代表里面是js语法，里面的花括号代表是一个对象**

   **或者**

    新建一个js文件，里面用export default导出一个样式的对象

   ![img](file:///C:\Users\xuxin\AppData\Roaming\Tencent\Users\1263092750\QQ\WinTemp\RichOle\JA6]~6M8D`CE_IXKON9NGTQ.png)

   然后在组建中import ‘路径’

2. **启用 css-modules（避免css的冲突覆盖**

   ```
   import itemStyles from './css/commenItem.module.css'
    console.log(itemStyles)
    
    function CommentList1(props) {
   	return <div>
   	<h1 className={itemStyles.box}>{props.user}</h1>
   	<h3>{props.content}</h3>
   	</div>
   }
   ```

   黑马的教程是去修改webpack.config.js里的相关参数

   **而用脚手架时，其实已经为我们打包好了css模块化**

   在node_modules\react-scripts\config\webpack.config.js中找到：

   ![](F:\图片\webpack-config.png)

   

   ​                 ![cssmodules](F:\图片\cssmodules.png)

   **也就是说,用.module.css结尾的css文件,webpack打包时,会做css模块化处理,而已.css结尾的css文件(不包含.module.css,cssRegex中已经exclude)不会被处理.在开发时只要注意文件的命名就可以了.**

3. 使用localIdentName设置生成的类名称，可选的参数有：

   - [path] 表示样式表所在路径
   - [name] 表示 样式表文件名
   - [local] 表示样式的定义名称
   - [hash:length] 表示32位的hash值
   - 例子：`{ test: /\.css$/, use: ['style-loader', 'css-loader?modules&localIdentName=[path][name]-[local]-[hash:5]'] }`

4. 使用 `:local()` 和 `:global()`

   **:local()`包裹的类名，是被模块化的类名，只能通过`className={cssObj.类名}`来使用**

   **同时，`:local`默认可以不写，这样，默认在样式表中定义的类名，都是被模块化的类名； **

   **:global()`包裹的类名，是全局生效的，不会被 `css-modules` 控制，定义的类名是什么，就是使用定义的类名`className="类名"**

   ```
   :global(.box){
   	color:purple
   }
   .box {
   	color:pink
   }
   
   function CommentList1(props) {
   	return <div>
   	<h1 className={itemStyles.box}>{props.user}</h1>
   	<h3 className='box'>{props.content}</h3>
   	</div>
   }
   ```

   5.**注意：只有`.title`这样的类样式选择器，才会被模块化控制，类似于`body`这样的标签选择器，不会被模块化控制；**

## 针对每个组件根节点问题的解决

由于每个组件都有根节点div

当多组件套用时会形成许多不需要的div盒子，很冗杂

解决方案：

1. ```
   通用，且更灵活
   render() {
   return <React.Fragment>
             <h1>1</h1>
               .....
          </React.Fragment>
   }
   ```

2. ```
   在react16以后支持编写[]
   render() {
   return [<h1>1</h1>
               .....
          ]
   }
   ```

   

## 总结

理解React中虚拟DOM的概念
理解React中三种Diff算法的概念
使用JS中createElement的方式创建虚拟DOM
使用ReactDOM.render方法
使用JSX语法并理解其本质
掌握创建组件的两种方式
理解有状态组件和无状态组件的本质区别
理解props和state的区别

## 相关文章
+ [React数据流和组件间的沟通总结](http://www.cnblogs.com/tim100/p/6050514.html)
+ [单向数据流和双向绑定各有什么优缺点？](https://segmentfault.com/q/1010000005876655/a-1020000005876751)
+ [怎么更好的理解虚拟DOM?](https://www.zhihu.com/question/29504639?sort=created)
+ [React中文文档 - 版本较低](http://www.css88.com/react/index.html)
+ [React 源码剖析系列 － 不可思议的 react diff](http://blog.csdn.net/yczz/article/details/49886061)
+ [深入浅出React（四）：虚拟DOM Diff算法解析](http://www.infoq.com/cn/articles/react-dom-diff?from=timeline&isappinstalled=0)
+ [一看就懂的ReactJs入门教程（精华版）](http://www.cocoachina.com/webapp/20150721/12692.html)
+ [CSS Modules 用法教程](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)
+ [将MarkDown转换为HTML页面](http://blog.csdn.net/itzhongzi/article/details/66045880)
+ [win7命令行 端口占用 查询进程号 杀进程](https://jingyan.baidu.com/article/0320e2c1c9cf0e1b87507b26.html)