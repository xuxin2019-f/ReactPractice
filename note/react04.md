## 课堂目标

掌握redux

掌握redux中间件

实现redux、react-redux及其中间件原理

掌握react-router

掌握react-router原理

redux里的reducers相当于vuex的mutation，并且不应该改之前的值，而是返回一个完全全新的值



## redux上手

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

3.**getState 获取状态值**

4.dispatch 提交更新 此时页面并不会更新（因为没有重新渲染，不同于vue 的双向数据流）

5.subscribe 变更订阅（实现强迫性重新渲染

**太麻烦了，所以需要react-redux 的支持**

### 为什么用react-redux代替redux

react、redux、react-redux关系：https://www.jianshu.com/p/728a1afce96d

redux的原理是设置一个createStore函数，在里面定义state作为私有变量，再在函数里通过定义子函数：getState、dispatch、subscribe等实现闭包，来获取和操作私有变量。全局组件的使用都必须要引入store、获取state必须都要getState、派发都要用dispatch、并且每次更新state后必须要调用subscribe实现重新渲染，很麻烦。

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

**实现一个高阶函数工厂connect，可以根据传入状态映射规则函数和派发映射规则函数映射需要的属性**，**可以处理变更监测和刷新任务**

**实现一个Provider组件可以传递store**

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

所以只能用this.props.dispatch.action.type来设置

如果有第二个参数,直接用this.props.action.type来设置



### 异步操作：

安装中间件（**在组件和store之间对dispatch进行升级**）后

[常用的这三个中间件的比较](https://blog.csdn.net/weixin_44217741/article/details/88965868?depth_1-utm_source=distribute.pc_relevant.none-task-blog-OPENSEARCH-1&utm_source=distribute.pc_relevant.none-task-blog-OPENSEARCH-1)

**redux-logger**：每次action修改state后都会在控制台打印出prev和next的state值

**redux-thunk**：因为原本action的值是一个对象，不接受函数类型，所以无法实现异步操作。那么在action中实现异步操作的方法是：

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

