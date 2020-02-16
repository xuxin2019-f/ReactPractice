## 课堂目标

掌握redux

掌握redux中间件

实现redux、react-redux及其中间件原理

掌握react-router

掌握react-router原理

redux里的reducers相当于vuex的mutation，并且不应该改之前的值，而是返回一个完全全新的值



## redux上手

需要学习很多概念，以一个累加器距离

1.需要一个store来存储数据

2.store里的reducer（其实就是一个函数，接收一些action，根据不同action进行不同操作）来初始化state并定义state修改规则

3.改状态：通过dispatch派发一个action来提交对数据的修改

4.action提交到reducer函数里，根据传入的action 的type，返回新的state



### 起步：

先创建数据仓库：store文件夹，在里面创建一个index.js

见pdf

### 检查点

1.createStore 创建store

2.reducer 初始化、修改状态的函数

3.getState 获取状态值

4.dispatch 提交更新 此时页面并不会更新（因为没有重新渲染，不同于vue 的双向数据流）

5.subscribe 变更订阅（实现强迫性重新渲染

**太麻烦了，所以需要react-redux 的支持**

### react-redux提供了两个api

1.Provider为后代组件提供store

2.connect为组件提供数据和变更方法（本身是一个装饰器工厂

connect需要配置 @connect（stats=>({}),{add: ()=>({type:’add’})})

第一个参数mapStateToProps

是状态值（映射到合适的属性上，将来可以通过this.props.属性得到）

简单来说可以通过this.props拿到这个connect

第二个参数mapDispatchToProps

把dispatch映射到属性上

是一个对象，对象里的每个值都是一个函数，每个函数返回一个对象

如果没有第二个参数，connect自动会定义dispatch，然后从store里查询type

所以只能用this.props.dispatch.action.type来设置

如果有第二个参数,直接用this.props.action.type来设置



异步操作：

安装中间件后

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

代码优化

抽离reducer和action，创建store/counter.js

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

模块化

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



扩展

redux原理

核心实现

- 存储状态state
- 获取状态getState
- 更新状态dispatch
- 变更订阅subscribe

见store/kredux.js

传入reducer

模拟页：MyReduxTest中创建store

```
const  store = createStore(counterReducer)
```

