## 课堂目标

掌握redux

掌握redux中间件

实现redux、react-redux及其中间件原理

掌握react-router

掌握react-router原理

redux里的reducers相当于vuex的mutation，并且不应该改之前的值，而是返回一个完全全新的值

# Flux思想

Flux是一种思想，把一个应用分为4个部分：

-  View 视图（vue、react...），根据store里的数据的改变而改变
-  store 存储数据 Flux规定一个应用可以有多个store
-  Dispatcher接收action转发给store来进行数据的修改
-  action  view中通过触发action来修改store里的数据

![image.png | center | 827x250](https://user-gold-cdn.xitu.io/2018/12/18/167c11c13ef4e9a8?imageView2/0/w/1280/h/960/ignore-error/1)

**Flux最大的特点就是数据都是单向流动的，组件不允许直接修改属于store实例的state，必须通过action来修改，而store里的state的改变也只能通过action**

## redux上手

### ！ redux的设计思想

1.**单向数据流**：这一点和**Flux架构**如出一辙，要做到可预测，单向的数据流无疑是最保险的

2**.全局只有一个store**：redux认为单一的store可以将数据集中起来，更加方便管理和预测，而且redux认为store的唯一职责就是集中的存储状态，不需要做太多的操作

3.**读写分离**：这个思想可能是redux的核心，**状态是只读的**，你可以通过`store.getState()`读取，至于写这方面，redux摒弃了Flux的dispatcher的概念，取而代之的是reducer，reducer在createStore的时候作为参数传进去，这样就实现了读写分离

4.**reducer必须是纯函数**：如果改变状态的函数太复杂，那么状态管理肯定就不直观，还预测个锤子，所以这就是为什么Redux一直强调reducer必须是纯函数了，**但是实际业务肯定没这么顺利，至少会有请求数据吧，redux会认为这个是副作用，不归reducer管，但问题总要解决的，答案就是Middleware**

5.Middleware: **redux认为，通知reducer改变状态的唯一方式就是dispatch(action),为了解决副作用的问题，redux巧妙地引入了Middleware的概念**，**大概的逻辑就是允许用户在触发了dispatch(action)后到reducer更改状态之前的期间进行拦截，对action进行预处理，类似于管道拼接，**为了可预测，redux期望管道职责单一，且对于管道的拼接顺序是有要求的，比如**日志打印管道必须放在异步处理等管道之后（即拼接中间件时redux-logger要在redux-thunk之后）**，这样地设计解决了副作用的问题，又解决了扩展性的问题





需要学习很多概念，以一个累加器举例

1.需要一个store来存储数据

应用中所有的 state 都以一个对象树的形式储存在一个单一的 store 中。 惟一改变 state 的办法是触发 action (**描述如何处理state的对象，即dispatch**)。

**为了实现根据 action 的信息来改变 state 树，你需要编写 reducers。**

action 是一个哈希对象

2.store里的reducer（其实就是一个函数，接收一些action，**根据不同action对state进行不同操作）来初始化state并定义state修改规则**

3.改状态：通过dispatch派发一个action来提交对数据的修改

4.action提交到reducer函数里，根据传入的action 的type，返回新的state



### 起步：

先创建数据仓库：store文件夹，在里面创建一个index.js

见pdf

### 检查点

1.createStore 创建store

2.reducer 初始化、修改状态的函数

3.**getState 获取状态值(store.getState())**

4.dispatch 提交更新 **此时页面并不会更新（因为没有重新渲染，不同于vue 的双向数据绑定，要实现页面的更新必须要subscribe订阅render函数）**

**5.subscribe 变更订阅（实现强迫性重新渲染**

   **subscribe这个函数是用来订阅store的变化的，比如每次对store进行dispatch更改state，都会触发subscribe注册的函数调用（如store.subscribe(listen), function listen(){xxx},这里的listen函数就是subsc注册的调用函数）**



   **那么为了使redux和react连接在一起，需要：**

-    **把store.dispatch方法传递给组件使其内部可以调用**
-    **subscribe订阅render函数，实现每次修改都重新渲染**
-    redux的相关内容移到单独的文件中

**太麻烦了，所以需要react-redux 的支持**

### 为什么用react-redux代替redux

react、redux、react-redux关系：https://www.jianshu.com/p/728a1afce96d

redux的原理是设置一个createStore函数，在里面定义state作为私有变量，再在函数里通过定义**子函数**：getState、dispatch、subscribe等**实现闭包**，**来获取和操作私有变量**。**全局组件的使用都必须要引入store、获取state必须都要getState、派发都要用dispatch、并且每次更新state后必须要触发subscribe实现重新渲染，很麻烦。**

我们希望通过把store设置在**react组件的顶层props**上（**即在index.js中引入store，利用context.provider**）比如：

```
<TopWrapComponent store={store}>
 <App />
</TopWrapComponent>,
```

并让所有的子组件都能访问到即可。**则可以用react中的Context原理**,react-redux提供provider组件

```
import {Provider} from 'react-redux'
ReactDOM.render(<Provider store={store}><RouterTestsaga/></Provider>, document.getElementById('root'));
```

并利用connect高阶组件封装redux中createStore中的子函数，使子组件直接可以**通过props来获取数据和调用callback**，**就像没有store存在一样**

### react-redux原理

核心任务

- **实现一个高阶函数工厂connect，可以根据传入状态映射规则函数和派发映射规则函数映射需要的属性**，**可以处理变更监测和刷新任务**

- **实现一个Provider组件可以传递store**

***包装目的：自动刷新，react-redux替我们执行了subscribe订阅，使我们不需要再订阅***

**详细：简书查得**

React-Redux 将**所有组件**分成两大类：**UI 组件**（presentational component）和**容器组件**（container component）

### UI组件



- 只负责 UI 的呈现，不带有任何业务逻辑
- 没有状态（即不使用this.state这个变量）
- 所有数据都由参数（this.props）提供
- 不使用任何 Redux 的 API

### 容器组件



- 负责管理数据和业务逻辑，不负责 UI 的呈现
- 带有内部状态
- 使用 Redux 的 API

**UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑。**

如果一个组件既有 UI 又有业务逻辑，那怎么办？回答是，将它拆分成下面的结构：**外面是一个容器组件，里面包了一个UI 组件。前者负责与外部的通信，将数据传给后者，由后者渲染出视图。**

React-Redux 规定，**所有的 UI 组件都由用户提供，容器组件则是由 React-Redux 自动生成。也就是说，用户负责视觉层，状态管理则是全部交给它。**

### connect()



```javascript
import { connect } from 'react-redux'
const VisibleTodoList = connect()(TodoList);
```

上面VisibleTodoList 便是通过UI组件TodoList,通过connect方法自动生成的容器组件。
 但需要定义业务逻辑，组件才有意义。

**注意如果state后定义的是对象形式一定要用()包起来，否则直接识别成jsx了**

```
connect((state) => ({ isLogin: state.user.login })
```



```javascript
import { connect } from 'react-redux'

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)
或写成装饰器形式：
@connect(state=>({num:1,counter:0}),{add:()=>({type:'add'}),minus:()=>({type:minus})})
class RedexTest extends Component {
    render(){
        return....
    }
}
```

connect方法接受两个参数：**mapStateToProps和mapDispatchToProps。它们定义了 UI 组件的业务逻辑。前者负责输入逻辑，即将state映射到 UI 组件的参数（props），后者负责输出逻辑，即将用户对 UI 组件的操作映射成 Action**。

### mapStateToProps()

它是一个函数，建立一个从（外部的）state对象到（UI 组件的）props对象的映射关系。
 mapStateToProps执行后应该返回一个对象，里面的每一个键值对就是一个映射。



```jsx
const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}
```

mapStateToProps是一个函数，它接受state作为参数，返回一个对象。这个对象有一个todos属性，代表 UI 组件的同名参数，后面的getVisibleTodos也是一个函数，可以从state算出 todos 的值。

### mapDispatchToProps()

mapDispatchToProps是connect函数的第二个参数，**用来建立 UI 组件的参数到store.dispatch方法的映射。它定义了哪些用户的操作应该当作 Action，传给 Store。它可以是一个函数，也可以是一个对象。**

- 是函数则会得到dispatch和ownProps（容器组件的props对象）两个参数。



```tsx
const mapDispatchToProps = (
  dispatch,
  ownProps
) => {
  return {
    onClick: () => {
      dispatch({
        type: 'SET_VISIBILITY_FILTER',
        filter: ownProps.filter
      });
    }
  };
}
```

从上面代码可以看到，mapDispatchToProps作为函数，应该返回一个对象，该对象的每个键值对都是一个映射，定义了 UI 组件的参数怎样发出 Action。

### <Provider> 组件

connect方法生成容器组件以后，需要让容器组件拿到state对象，才能生成 UI 组件的参数。
 React-Redux 提供Provider组件，可以让容器组件拿到state。



```jsx
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import todoApp from './reducers'
import App from './components/App'

let store = createStore(todoApp);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

上面代码中，Provider在根组件外面包了一层，这样一来，App的所有子组件就默认都可以拿到state了。

### react-redux提供了两个api

1.Provider为后代组件提供store

2.connect为组件提供数据和变更方法（本身是一个装饰器工厂

connect需要配置 @connect（stats=>({}),{add: ()=>({type:’add’})})

**第一个参数mapStateToProps**

是状态值（**映射到合适的属性上，将来可以通过this.props.属性得到**）

简单来说可以通过this.props拿到这个connect

**第二个参数mapDispatchToProps**

**把dispatch映射到属性上**

是一个对象，对象里的每个值都是一个函数，每个函数返回一个对象

**即这里的每个对象都是一个action creator**

如果没有第二个参数，connect自动会定义dispatch，然后从store里查询type

所以只能用this.props.dispatch.(action.type)来设置

如果有第二个参数,直接用this.props.(action.type)来设置



### 异步操作：

安装中间件（**在组件和store之间对dispatch进行升级**）后

[常用的这三个中间件的比较](https://blog.csdn.net/weixin_44217741/article/details/88965868?depth_1-utm_source=distribute.pc_relevant.none-task-blog-OPENSEARCH-1&utm_source=distribute.pc_relevant.none-task-blog-OPENSEARCH-1)

**注意安装中间件后需要在applyMiddleware中开启**

**redux-logger**：每次action修改state后都会在控制台打印出prev和next的state值

**redux-thunk**：**因为原本action的值是一个对象，不接受函数类型，所以无法实现异步操作。**那么在action中实现异步操作的方法是：

import thunk from 'redux-thunk'

const store = createStore(CounterReducer, applyMiddleware(thunk))

```
{add:()=>dispatch=>{异步操作}}
```

**即需要返回的是一个函数，通过redux-thunk实现action返回的是一个函数**

注意：**不是redux-thunk实现了异步，而是实现了返回值是一个函数，通过在函数里写异步操作而实现了异步**

**redux-saga**：**底层原理是es6的generator**。解决redux-thunk每一个异步操作都要定义一个action，不易维护，形式不统一，操作太分散等缺陷。**redux-saga单独把异步逻辑分离到另一个文件去管理**（见react06）



注意：1.`createStore`方法可以接受整个应用的初始状态作为参数，那样的话，`applyMiddleware`就是第三个参数了

​            格式为：

```
const store = createStore(
  reducer,
  initial_state,
  applyMiddleware(logger)
);
```

​            2.中间件的次序有讲究：

```
const store = createStore(
  reducer,
  applyMiddleware(thunk, promise, logger)
);
```

在store中的index.js代码变为：

```
import { createStore, applyMiddleware, combineReducers } from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";

const counterReducer = (state = 0, action) => {
  const num = action.payload || 1
   switch (action.type) {
    case 'add':
      return state + num
    case 'minus':
      return state - num
    default:
      return state
  }
}

const store = createStore(counterReducer, applyMiddleware(logger, thunk))

export default store
```

在控制台会显示出prev state和next state，并显示action

在ReduxTest.js中的@connect中添加异步action，返回的是一个函数（异步

```
@connect(state=>({num:state}),{
  // 理解为vuex中的action
  add:(n)=>({type:'add',payload:n}),
  minus:(n)=>({type:'minus',payload:n}),
  // 异步返回的是函数
  asyncAdd: ()=>dispatch=> {
    // 异步调用
    setTimeout(()=>{
      dispatch({type:'add'})
    },1000)
  }
})
```

### 代码优化（抽离代码）

**抽离reducer和action**，创建store/counter.js

1.把ReducTest里@connect中的action参数全部放进counter里

2.把store下index.js中的reducer参数全部放进counter里

```
export const add = num => ({ type: "add", payload: num }); // action creator
export const minus = () => ({ type: "minus" }); // action creator

// 异步的返回的是函数
export const asyncAdd = (dispatch, getState) => dispatch => {
  // 异步调用在这里
  setTimeout(() => {
    dispatch({ type: "add" });
  }, 1000);
};

export const counterReducer = function(state = 0, action) {
    const num = action.payload || 1;
    switch (action.type) {
      case "add":
        return state + num;
      case "minus":
        return state - num;
      default:
        return state;
    }
  };
```

### 模块化

实现将多个reducer整合（就是给每个reducer起名字

```
import {  combineReducers } from "redux";
const store = createStore(
    combineReducers({counter: counterReducer}), 
    applyMiddleware(logger, thunk)
);
```

在ReduxTest映射时：

改为：

```
@connect(state=>({num:state.counter}),
```

## Mobx

### ！！原理

-   mobx中**可以实现多个store**，核心概念有state数据状态、derivations（分为computed和reactions副作用）衍生、actions改变状态的函数。

-   mobx通过暴露mobx.observable(或简写成@observable 变量xxx)来创建**可观察的state**

  - observable实际上是**函数createObservable**的引用，这个函数本身不提供转换功能，只是起到转发的作用，通过判断传入的对象类型（装饰器模式、Object、Array、Map）转发给具体的转换函数：

    ![trend](https://segmentfault.com/img/remote/1460000015894699?w=640&h=218)

  - 再利用函数是特殊的对象这一特性将**observableFactories这个对象**的属性遍历的挂在observable的属性下，通过看源码发现这个对象里的方法基本都是对应与createObservable中判断类型后对应的调用方法，如：deepDecorator、object、array、map、box等

  **注意！**

  1. **Mobx4是根据Object.defineProperty实现观察者，Mobx5而替换成了Proxy的写法，但大致思想一致**

  ​    2.mobx在很多框架中都可以使用，如果在react中使用结合mobx-react使用

     

https://www.zcfy.cc/article/mobx-ten-minute-introduction-to-mobx-and-react-4306.html?t=new

上手：

- **@observable** 监听数据

- Action：定义改变状态的动作函数，包括如何变更状态；


- Store：集中管理模块状态（State）和动作（action）；


- Derivation（衍生）：从应用状态中派生而出，且没有任何其他影响的数据，我们称为derivation（衍生），衍生在以下情况下存在：


1. 用户界面；

2. 衍生数据；

   衍生主要有两种：

   1. Computed Values（计算值）：计算值总是可以使用纯函数（pure function）从当前可观察状态中获取；**相当于vue中的computed**
   
   ​         @computed get xxx() {
   
   ​             return xxxx 
   
   ​          }
   
      2.Reactions（反应）（autorun）：反应指状态变更时需要自动发生的副作用，这种情况下，我们需要实现其读写操作；**相当于vue中的watch**
   
   ​               **mobx.autorun(()=>{})创建一个响应（reaction）并执行一次，之后这个函数中任何observable数据变更时，相应都会被自动执行。**

![Mobx Philosophy](https://user-gold-cdn.xitu.io/2018/2/11/1618360a9dd4583e?imageView2/0/w/1280/h/960/ignore-error/1)

### Mobx-react 

#### Observer

是mobx-react包单独提供的 **Observer是用来将React组建转变成响应式**（**你不再需要调用 `setState`，也不必考虑如何通过配置选择器或高阶组件来订阅应用程序 state 的适当部分。**）的组件，**内部通过mobx.autorun包装了组件的 render函数，来确保store的数据更新时来刷新组件** @observer 是observer(**class** {})的注解形式，用来观察组件

***注意：@observable是属于mobx的，@observer是属于Mobx-react的***



 **高阶组件  @observer classTest extends React.Component{}**

 **无状态组件 const Test = observer(() => <div>test</div>)**

#### Provider                

```
Provider函数为connect函数提供store参数，本身connect函数就是用来连接视图和数据层的方法。

在跟组件外层包一层provider，使得所有的子组件默认都可以拿到state

使用：

import { Provider } from 'mobx-react';
import store from '../stores';

<Provider {...store}>
    ...
</Provider>
```

#### inject               

```
引入数据的方式，@inject(stores); 使得数据被自动保存在组件的this.props中
eg:
@inject('testStore')
@observer class Test extends React.Component{} 
```

#### componentWillReact

```
mobx-react新增的生命周期钩子，当组件重新render的时候会被触发，但在初始渲染前是不会被触发的
```

#### onError

```
mobx-react提供的错误钩子函数来收集错误

用法： 

import { onError } from 'mobx-react';
onError((error) => {
    consol.log(error);
})
```

例子：

```js
import React from 'react'
import { observable, configure, action, computed, autorun } from 'mobx'
import { observer } from 'mobx-react'
// 不再用useStrict了
configure({ enforceActions: true })

class MyState {
  @observable num = 0
  @action addNum = () => {
    this.num++
  }
  @computed get nownum() {
    return this.num * 3
  }
  constructor() {
    autorun(() => console.log(this.num))
  }
}

const newState = new MyState()

export default
@observer
class App extends React.Component {
  render() {
    return (
      <div>
        <p>{newState.num}</p>
        <button onClick={newState.addNum}>+1</button>
      </div>
    )
  }
}

```

另一个例子

**在这个例子中，通过创建的assignee属性与另一个store关联在了一起**

```js
import React from 'react'
import ReactDOM from 'react-dom'
import { observable, configure, action, computed, autorun } from 'mobx'
import { observer, inject, Provider } from 'mobx-react'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import Test from './Test'

class ObservableTodoStore {
  @observable todos = []
  @observable pendingRequests = 0

  constructor() {
    autorun(() => console.log(this.report))
  }

  @computed get completedTodosCount() {
    return this.todos.filter((todo) => todo.completed === true).length
  }

  @computed get report() {
    if (this.todos.length === 0) return '<none>'
    return (
      `Next todo: "${this.todos[0].task}". ` +
      `Progress: ${this.completedTodosCount}/${this.todos.length}`
    )
  }

  @action addTodo(task) {
    this.todos.push({
      task: task,
      completed: false,
      assig: null,
    })
  }
}

const observableTodoStore = new ObservableTodoStore()

observableTodoStore.addTodo('read MobX tutorial')
observableTodoStore.addTodo('try MobX')
observableTodoStore.todos[0].completed = true
observableTodoStore.todos[1].task = 'try MobX in own project'
observableTodoStore.todos[0].task = 'grok MobX tutorial'

var peopleStore = observable([{ name: 'Michel' }, { name: 'Me' }])
observableTodoStore.todos[0].assig = peopleStore[0]
observableTodoStore.todos[1].assig = peopleStore[1]
peopleStore[0].name = 'Michel Weststrate'

@inject('observableTodoStore')
@observer
class TodoList extends React.Component {
  render() {
    return (
      <div>
        {this.props.observableTodoStore.report}
        <ul>
          {this.props.observableTodoStore.todos.map((todo, idx) => (
            <TodoView todo={todo} key={idx} />
          ))}
        </ul>
        {this.props.observableTodoStore.pendingRequests > 0 ? (
          <marquee>Loading...</marquee>
        ) : null}
        <button onClick={this.onNewTodo}>New Todo</button>
        <small> (double-click a todo to edit)</small>
      </div>
    )
  }

  onNewTodo = () => {
    // const store = observableTodoStore
    this.props.observableTodoStore.pendingRequests++
    setTimeout(() => {
      this.props.observableTodoStore.addTodo(
        prompt('Enter a new todo', 'coffee plz')
      )
      this.props.observableTodoStore.pendingRequests--
    }, 1000)
  }
}

@observer
class TodoView extends React.Component {
  render() {
    const todo = this.props.todo
    return (
      <li onDoubleClick={this.onRename}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={this.onToggleCompleted}
        />
        {todo.task + '-----'}
        {todo.assig ? <small>{todo.assig.name}</small> : null}
      </li>
    )
  }

  onToggleCompleted = () => {
    const todo = this.props.todo
    todo.completed = !todo.completed
  }

  onRename = () => {
    const todo = this.props.todo
    todo.task = prompt('Task name', todo.task) || todo.task
  }
}

ReactDOM.render(
  <React.StrictMode>
    <Provider observableTodoStore={observableTodoStore}>
      <TodoList />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()

```

### 

### 坑

1.网上查的老版的mobx严格模式的写法都是

```
import {useStrict} from 'mobx'
useStrict(true)
```

新版用这个就报错，改成

```
import { configure } from 'mobx'
configure({ enforceActions: true })
```

2.严格模式下在store里对数据的操作必须要以action的形式，比如

```
 @action addTodo(task) {
    this.todos.push({
      task: task,
      completed: false,
      assignee: null,
    })
  }
  而不能写成
  addTodo(task) {
    this.todos.push({
      task: task,
      completed: false,
      assignee: null,
    })
  }报错
```

3.当在父组件外用inject将store作为props传进来时，子组件如果没有inject就会报错，正确的做法是在react最外层组件或者父组件外面加一层Provider

```js
import { observer, inject, Provider } from 'mobx-react'

@inject('observableTodoStore')
@observer
class TodoList extends React.Component {}

@observer
class TodoView extends React.Component {}

ReactDOM.render(
  <React.StrictMode>
    <Provider observableTodoStore={observableTodoStore}>
      <TodoList />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

```



# ！！Mobx与redux与vuex

1、**对比Redux**  conponent-->dispatch(action)-->reducer-->subscribe-->getState-->component  

**对比React-Redux**  component-->actionCreator(data)-->reducer-->component 

这里的reducer**在MobX里都给了action，直接通过action来更改状态**，不需要reducer来操作state了，也不需关注reducer纯不纯了 

- 且redux对ts支持不友好，mobx完美支持ts
- redux和react-redux都需要reducer定义不同action对state的操作，mobx中没有

- redux引入中间件来解决异步，也可以通过约定晚上许多复杂的工作，mobx没有中间件机制。
- redux中只有一个store，可以有多个reducer，而mobx中存在多个独立的store，没有reducer
- redux需要手动追踪所有状态对象的变更（getState），mobx中是**监听可观察对象（observable）**，变更时自动触发监听
- **redux中状态是不可变的，即无法直接操作状态对象，必须是在原来状态对象基础上返回一个新的状态对象（如case add: return num:num+1),而mobx中可以直接操作状态对象**
- **redux和react连接时，需要用到react-redux提供的provider和connect，provider将store注入react应用，connect将store的state和action注入容器组件，并作为props传递；mobx而言，使用mobx-react的provider将store注入应用，用inject将特定store注入某组件，然后利用observer保证组件能响应store中的可观察对象（observable）变更，实现响应式更新**

当应用公共状态的组件在状态发生变化的时候，会自动完成与状态相关的所有事情，例如自动更新View,自动缓存数据，自动通知server等。 **例如React的体系，react + redux + react-redux + redux-saga, view层触发一个action，中间件会将这个动作进行dispatch，然后reducer执行相应的更新状态方法**，使得store的状态更新。

**在react中，数据流不复杂的情况下使用mobx，如果及其复杂，使用redux**

2、**对比Vuex** component-->dispatch(action)-->mutation--(mutate)-->state-->component vuex中提出了同步mutation和异步action，

现在mobx也无需mutaiton，但借鉴了computed这个纯函数。 相比这两个工具，MobX内置了数据变化监听机制，使得在实际应用的时候一切都是那么的顺其自然。



## 扩展



### redux原理

手写原理 实现createStore

createStore暴露了三个接口：分别是getState，dispatch，subscribe

 

#### 核心实现

- 存储状态state
- 获取状态getState
- 更新状态dispatch
- 变更订阅subscribe

**定义createStore**

**见store/kredux.js**

实现createStore

**第一个参数可以是combineReducer，第二个参数就是applyMiddleware**

```js
export function createStore(reducer,enhancer){
    if(enhancer){
        // 如果存在中间件，则强化
        return enhancer(createStore)(reducer)
    }
    //设初始化的state数据为undefined
    let currentState = undefined
    //每次变更都要执行的回调函数组
    const currentListeners = []
    //获取数据
    function getState(){
        return currentState
    }
    //变更订阅，参数是一个回调，把这个回调添加到函数组中
    function subscribe(cb){
        currentListeners.push(cb)
    }
    //派发，实现操作state
    function dispatch(action){
        //首先通过reducer来赋值
        let currentState = reducer(currentState,action)
        //遍历函数组的每一个函数，全部执行
        currentListeners.forEach(v=>v)
        return action
    }
    //由于初始currentState为undefined，利用reducer中switch语句的default下的默认state来给currentState赋值，这个时候随便写一个没有的type即可
    dispatch({type:'2edsa0'})
    return {
        getState,
        subscribe,
        dispatch
    }
}
```

实现applyMiddleware

```js
//首先实现将数组中的多个项合并的功能
export function compose(...fns){
    if(fns.length === 0){
        //执行fns里操作
        return v=>v
    }
    if(fns.length === 1){
        return fns[0]
    }
    return fns.reducer((left,right)=>(...args)=>right(left(...args)))
}
export function applyMiddleware(...middlewares){
    return (createStore)=>(...args)=>{
        const store = createStore(...args)
        let dispatch = store.dispatch
        const midApi = {
            getState:store.getState,
            dispatch:(...args)=>dispatch(...args)
        }
        const chain = middlewares.map((mw=>mw(midApi))
        dispatch = compose(...chain)(store.dispatch)
    }
    return {
        ...store,
        dispatch
    }
}
```

1.enhancer相当于强化器，**即中间件**

2.dispatch的参数永远是action，定义dispatch函数时将action返回了，便于中间件的操作

3.**强化器的定义函数中定义midApi来给若干中间件传参数dispatch和getState，使所有中间件拥有这两个能力，**所以在MyReduxTest中定义的中间件logger和thunk里都可以接受这两个参数。同时，这两个中间件都在最后返回了dispatch(action)，因为在kredux的dispatch函数定义中，最终会返回action，便于下一个中间件的执行

4.MyReduxTest中thunk中间件的定义，判断如果action类型是函数的话，传入两个参数，因此在下面render界面可以直接接收到。

##### 传入reducer

##### 模拟页：

MyReduxTest中创建store

```
const  store = createStore(counterReducer)
获取并派发
 render() {
    return (
      <div>
        {store.getState()}
        <button onClick={()=>store.dispatch({type:'add'})}>+</button>
      </div>
    );
  }
  更改订阅
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }
```

##### 实现中间件

redux中间件机制

不加之前 action=>store.dispatch=>直接到store的若干reducer

**加了之后 dispatch通过appllyMiddleware这个函数形成了一个superDispatch（强化dispatch）,功能强大，然后action=>若干中间件再到store里的reducer**

redux中的数据流大致是：

***UI—————>action（plain）—————>reducer——————>state——————>UI\***

**但是如果存在副作用，比如ajax异步请求等等，那么应该怎么做？**

**如果存在副作用函数，那么我们需要首先处理副作用函数，然后生成原始的js对象。如何处理副作用操作，在redux中选择在发出action，到reducer处理函数之间使用中间件处理副作用。**

redux增加中间件处理副作用后的数据流大致如下：

**UI——>action(side function)—>middleware—>action(plain)—>reducer—>state—>UI**

**在有副作用的action和原始的action之间增加中间件处理，从图中我们也可以看出，中间件的作用就是：**

***转换异步操作，生成原始的action，这样，reducer函数就能处理相应的action，从而改变state，更新UI。\***

作业：用redux实现一个小项目

见class-test/todolist.js

#### redux-logger

```js
import {applyMiddleware} from '../store/redux'

function logger({getState,dispatch}){
    return dispatch => action =>{
        //执行中间件任务
        console.log(action.type+'执行了')
        //下一个中间件
        return dispatch(action)
    }
}
const store = createStore(counterReducer,applyMiddleware(logger))
```

#### redux-thunk

```js
function thunk({getState,dispatch}){
    return dispatch => aciton =>{
        if(typeof action === 'function'){
            return action({getState,dispatch})
        }
        return dispatch(action)
    }
}
```



### react-redux原理

#### 核心任务

实现一个**高阶函数工厂connect**，可以根据传入状态映射规则函数和派发起映射规则函数映射需要的属性，**可以处理变更检测和刷新任务**

- Provider利用**react的context和this.props.children插槽**，从最外部封装了整个应用，将store和store中的数据全部传递给各个组件（**此时组件可以通过this.context.store拿到Provider提供的所有属性**），并向connect模块传递store，接收到状态改变时更新store

```js
//Provider本质上是一个react组件,简易实现
class Provider extends React.Component{
    constructor(props){
        super(props)
        const {store} = props
        this.state = {
            storeState:store.getState(),
            store
        }
    }
    xxxxx
    render(){
        const Context = this.props.context
        return (
         <Context.Provider store={this.state} >
            {this.props.children}
         </Context.Provider>
         )
    }
}

```



- connect接收状态映射函数和派发映射规则，并返回一个高阶函数组件，在最后返回的组件内从this.context解构出store，然后通过store执行store.subscribe()、store.getState()和store.dispatch等操作，最后将这两个规则函数计算后的值映射到props上，在这个最后返回的组件上通过赋予{...this.state.props}将**mapStateToProps和mapDispatchToProps全部映射成该组件的props属性，此时组件可以通过this.props.xxx拿到store中的数据了。**

```js
// connect本身是个高阶函数工厂，接收StateToProps和mapDispatchToProps后返回一个高阶组件，这个高阶组件内部最后返回一个新生成的组件，在这个组件上赋予props
//简易实现：
  const connect = (mapStateToProps = state=>state,mapDispatchTopROPS = {}) =>(WrapComponent) => {
      return class ConnectComponent extends React.Component{
          constructor(props,context){
              super(props，context)
              this.state = {
                  props:{}
              }
          }
          componentDidMount(){
              //解构出store
              const {store} = this.context
              //订阅update,自动重新渲染
              store.subscrbe(()=>this.update())
              this.update()
          }
          update(){
              //解构出store
              const {store} = this.context
              const stateProps = mapStateToProps(store.getState())
              const dispatchProps = 
                    //这是额外定义的一个函数，实现将actionCreator转换为派发函数
                    bindActionCreators(mapDiapatchToProps,store.dispatch)
              
              this.setState({
                  props:{
                      ...this.state.props,
                      ...stateProps,
                      ...dispatchProps
                  }
              })
          }
          render(){
              return <WrapComponent {...this.state.props} />
          }
      }
  }
```

更新原理：为了解决原生redux的使用：在每个要使用状态的组件都要进行引入，获取状态都要调用getState，并且每次页面更新都要调用subscribe通知订阅，很麻烦。为了解决这个问题，利用react中的Context钩子这一概念，在react-redux中实现了直接在index.js中引入react-redux提供的Provider来把所有的数据和方法传给react的顶层props，**由于connect函数在接收两个映射函数后，返回的是一个高阶函数组件，所以最后所有的子组件可以直接通过props来访问数据和方法**

见pdf

其中update（）中

**stateProps**得到的是一个对象，如

```
state => ({num:state.counter})
```

**dispatchProps**得到的也是一个对象

```
// {add:(...args)=>({type:'add'})}
转化成
// {add:(...args)=> dispatch(creator(...args))}
```

在setState中

```
props:{...this.state.props,// 展开之前的值
       ...stateProps, //展开 num:state.counter
       ...dispatchProps //展开派发函数add:(...args)=>
                         dispatch(creator(...args))
```

实现一个	Provider组件可以传递store

## 用redux结合router实现登录跳转页面

#### 1.创建/store/index.js

创建reducer（直接写在这个页面了），导入中间件thunk（为了能实现异步操作login), 创建store实例，导出store

#### 2.在RouterTest中实现页面

从react-redux中导入connect实现自动刷新等功能

创建异步操作login（action creator）

```
// 创建一个异步操作
const login = ()=> dispatch =>{
  dispatch({type:'request'})
  setTimeout(()=>{
    dispatch({type:'login'})
  },2000)
}
```

想要实现功能的代码：

```
<PrivateRoute path="/management" component={ProductMgt} />
<Route path="/login" component={Login} />
```

其中路由守卫：

```
const PrivateRoute = connect(state => ({isLogin: state.user.login}))(
  ({ component: Component, isLogin, ...rest })=>{
    return (
    //利用Route中的render属性做条件渲染
    <Route
      {...rest}
      render={
        // props === ({ match, history, location })
        props =>
          isLogin ? (
            <Component />
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                //  如果登陆成功，回跳到当前这个地址
                state: { redirect: props.location.pathname }
              }}
            />
          )
      }
    />
  );
  })
```

其中Login组件的定义：

```
const Login = connect(
  state => ({isLogin:state.user.login,
    loading:state.user.loading}),
  {login}
  // 发现这里的location就是上面路由守卫里传的to属性的参数
)(({location,login,isLogin,loading})=> {
  const redirect = location.state.redirect || '/'
  if(isLogin) {
    return <Redirect to={redirect}/>
  }
  return (
    <div>
      <div>Login</div>
      <button onClick={login} disabled={loading} >
        {loading ? '登陆中...' : '登录'}
      </button>
    </div>
  )
})
```

在index入口文件中导入Provider和store（注意react-redux需要用provider提供数据）

```
import {Provider} from 'react-redux'
import store from './store/index'
ReactDOM.render(<div>
  <Provider store={store}>
  <RouterTest />
  </Provider>
</div>, document.getElementById('root'));
```

