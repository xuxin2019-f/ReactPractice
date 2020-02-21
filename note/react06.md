# 课堂目标

1.掌握redux异步方案 -redux-saga(和thunk都可以实现异步)

2.掌握数据流方案 -dva（里面用到了-redux-saga）

3.掌握企业级应用框架 -umi

## 知识要点

1.generator

2.redux-saga

3.umi

4.dva



## redux-sage使用

底层使用的es6 的generator

redux-saga使副作用（数据获取、浏览器缓存获取）易于管理、执行、测试和失败处理

安装 yarn add --save redux-saga

**原理：redux-saga提供一个中间件，并且在清单中记录若干action，并监听这些action，代码运行时，如果监听到清单中的action，则执行响应的函数，如果监听到action不在清单中，则放行**

### 使用：用户登录

在class-test下的store下创建saga.js

#### 1.模拟请求登陆的ajax，并创建workersaga和watchsaga

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

#### 2.在user.js中创建一个user 的reducer，并且创建一个action createor：login

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

#### 3.在store下的index.js中修改相关代码，用saga替换thunk

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

#### 4.创建RouterTestsaga来渲染

详情见代码



## dva

dva是一个基于redux和redux-saga的数据流方案，为了简化开发体验，dva内置了react-router和fetch。dva可以作为一个轻量级的应用程序框架



## umi

扩展了dva，dva只作为其中的一个小插件

### umi应用约定目录结构

- pages 页面
- components 组件
- layouts 布局
- models 状态
- config 配置
- mock 数据模拟
- test 测试等

### 小bug：

安装umi后显示不存在umi。用yarn global bin检查yarn的安装路径，配置到环境变量中，解决问题

### 安装

yarn add umi g 

md 项目名

cd 项目名

umi g page xxx 创建页面

**注意： umi自动支持less、sass，例如： umi g page detail --less ，则生成detail.js页面和detail.less 样式**

umi dev 启动

umi build 创建build

### 动态路由

umi g page users/$id

### 嵌套路由

umi g layout ./users  将/users转变成一个嵌套路由

此时出现_layout.js,它作为一个副业面把子页面包了起来：

```
{
    path: '/users',
    exact: false,
    component: require('../users/_layout.js').default,
    routes: [
      {
        path: '/users',
        exact: true,
        component: require('../users/index.js').default,
      },
      {
        path: '/users/:id',
        exact: true,
        component: require('../users/$id.js').default,
      },
     
```

再创建umi g page users/index 时，这个页面盛有users下的首页，和users/:id是兄弟页面

### 页面跳转

方法一

声明式

```
       import Link from 'umi/link'
       <li>
          <Link to='users/1'>tom</Link>
        </li> 
```

命令式

```
    import router from 'umi/router'
    <li onClick={()=>router.push('/users/2')}>jerry</li>
```

### 引入dva

yarn add umi-plugin-react -D

见pdf

#### 小bug 

创建的.umirc.js不起作用：应该放在umi-test文件夹下才能起作用，不能放在src这个第二级目录下！！所以我直接把src删了

#### 步骤

##### 1.创建models文件夹，在下面创建goods.js（管理状态）

参数：

- namespace：model的命名空间，只能用字符串，一个大型应用可能包含多个model，通过namespace区分
- state：保存数据状态
- reducers：用于修改state，由action触发，reducer是一个纯函数，它接受当前的state及一个action对象。action对象里面可以包含数据体（payload）作为入参，需要返回一个新的state
- effects：用于处理异步操作（例如与服务端交互）和业务逻辑，也是由action触发。但是它不可以修改state，要通过触发action调用reducer实现对state的简介操作

```
import axios from 'axios'

// api
function getGoods() {
  //axios返回了一个promise
  console.log(axios.get('/api/goods'))
  return axios.get('/api/goods')
}
export default {
    namespace: 'goods', //model的命名空间，区分多个model
    state:[],//初始状态
    effects:{// 副作用 //异步操作
        *getLists(action,{call,put}) {
         // call调用
         const res = yield call(getGoods)
          // put派发reducer
          yield put({type:'init',payload:res.data.result})
        }
    },
    reducers:{
        init(state,action) {
          return action.payload
        },
        addGood(state,action) {
            return [...state,{title:action.payload}]
        }
    }    //更新状态
}

```

##### 2.在mock文件夹下建立goods.js来模拟数据接口

```
// 假设这里是数据库 模拟数据接口
let data=[
  {title:"web全栈"},
  {title:"java架构师"}
]

export default {
  //"methodurl":Object或Array
  // "get/api/goods":{result:data},
  //"methodurl":(req,res)=>{}
  "get /api/goods": function(req,res) {
    setTimeout(()=>{
      res.json({ result:data })
    },1000)
  }
}
```

##### 3.在pages下建立good.js来模拟页面

**在这个页面下的connet的第二个参数映射下，要标明model的命名空间**

```
import { connect } from 'dva'
import styles from './goods.css';
import {useEffect} from 'react'

export default connect(
   state => ({goodsList: state.goods}), //注意加上命名空间
  {
    addGood:title => ({
      type:'goods/addGood',
      payload:title
    }),
    getLists: ()=>({
      type:'goods/getLists'
    })
  }
)(function({goodsList,addGood,getLists}) {
  useEffect(()=>{
    // 实现第一次初始化
    getLists()
  },[])
  return (
    <div className={styles.normal}>
        <ul>
          {goodsList.map(good => (<li key={good.title}>{good.title}</li>))}
        </ul>
      <button onClick={() => addGood('商品'+new Date().getTime())}>新增</button>
    </div>
  );
})
```

**严格来说，在实际开发中，会把api请求放在单独的services文件夹中保存，即models中的这段代码：**

```
// api
function getGoods() {
  //axios返回了一个promise
  console.log(axios.get('/api/goods'))
  return axios.get('/api/goods')
}
```

##### 加载状态

**不用像之前一样手写了，通过内置的dva-loading实现**

在pages/goods.js下

在state下添加一行新代码：

```
export default connect(
   state => ({
     goodsList: state.goods,//获取指定命名空间的模型状态
     loading:state.loading}),
  {
```

**在function中做判断，监听loading.models.goods,在这个数据里如果models.goods的状态里有任何异步操作正在执行，都会返回true**

```
(function({goodsList,addGood,getLists,loading}) {
  useEffect(()=>{
    // 实现第一次初始化
    getLists()
  },[])

  console.log(loading)
  if (loading.models.goods) {
    return <div>加载中</div>
  }
```

## 做项目

### 1.引入antd

yarn add antd -S

### 2.修改.umirc.js

添加 antd：true

### 3.在layouts文件夹下的index.js添加公共样式



### 4.希望首页直接跳转到商品页

在index.js最上方添加yaml格式的注释

```
/**
 * redirect: '/goods'
 */

```

### 5.用户登录认证

利用ant-design-pro中Login、Exception、图表等业务组件加速开发进度

引入ant-design-pro，安装： yarn add ant-design-pro --save

