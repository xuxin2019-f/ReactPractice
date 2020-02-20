课堂目标

1.掌握redux异步方案 -redux-saga(和thunk都可以实现异步)

2.掌握数据流方案 -dva（里面用到了-redux-saga）

3.掌握企业级应用框架 -umi

知识要点

1.generator

2.redux-saga

3.umi

4.dva



redux-sage使用

底层使用的es6 的generator

redux-saga使副作用（数据获取、浏览器缓存获取）易于管理、执行、测试和失败处理

安装 yarn add --save redux-saga

**原理：redux-saga提供一个中间件，并且在清单中记录若干action，并监听这些action，代码运行时，如果监听到清单中的action，则执行响应的函数，如果监听到action不在清单中，则放行**

使用：用户登录

在class-test下的store下创建saga.js

1.模拟请求登陆的ajax，并创建workersaga和watchsaga

```
// worker saga
//generator，用同步方式写异步代码
function* login(action) {
  try {
    //请求登录
    yield put({type:'requestLogin'})
    // 调用异步的登录请求，并传参数
    const result = yield call(UserService.login,action.uname)
    // 调用成功，请求更新
    yield put({type:'loginSuccess',result})
  } catch(message) {
    //丢错误信息
    yield put({type:'loginFailure',payload:message})
  }
}
```

登陆请求调用的是模拟登陆的ajax函数：

```
// 模拟登陆,模拟ajax
const UserService = {
  login(uname) {
    return new Promise((resolve,reject) => {
     var timer= setTimeout(()=>{
        if(uname === 'Jerry') {
          resolve({id:1,name:'Jerry',age:18})
        }else {
          reject('用户名或密码错误')
        }
      },1000)
    })
  }
}
```

在watchersaga中

```
//takeEvery的作用：一直监听login这个action（定义在user.js里），一旦监听到这个类型，就执行login迭代器这个函数
  //在这个迭代器中以action中传来的uname为参数，调用了我们在saga里定义的login方法
  yield takeEvery('login',login)
```

2.在user.js中创建一个user 的reducer，并且创建一个action createor：login

```
//导出user的reducer
export const user=(
  state={isLogin:false,loading:false,error:""},
  action
)=>{
  switch (action.type) {
    case"requestLogin":
      return{isLogin:false,loading:true,error:""};
    case"loginSuccess":
      return{isLogin:true,loading:false,error:""};
    case"loginFailure":
      return{isLogin:false,loading:false,error:"用户名或密码错误"};
    default:
      return state
  }
}
//派发动作依然是对象而非函数
export function login(uname) {
  return {type:'login',uname}
}
```

3.在store下的index.js中修改相关代码，用saga替换thunk

```
import createSagaMiddleware from 'redux-saga'
import mySaga from './saga'
import {user} from './user'

// 1.创建中间件
const mid = createSagaMiddleware();
// const store = createStore(combineReducers({counter: counterReducer}), applyMiddleware(logger, thunk))
const store = createStore(combineReducers({counter: counterReducer,user}), applyMiddleware(logger, mid))
//2.运行saga监听
mid.run(mySaga)
```

4.创建RouterTestsaga来渲染

详情见代码



dva

dva是一个基于redux和redux-saga的数据流方案，为了简化开发体验，dva内置了react-router和fetch。dva可以作为一个轻量级的应用程序框架



umi

扩展了dva，dva只作为其中的一个小插件

umi应用约定目录结构

- pages 页面
- components 组件
- layouts 布局
- models 状态
- config 配置
- mock 数据模拟
- test 测试等