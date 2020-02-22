# 课堂目标

1.掌握redux异步方案 -redux-saga(和thunk都可以实现异步)

2.掌握数据流方案 -dva（里面用到了-redux-saga）

3.掌握企业级应用框架 -umi

## 知识要点

1.generator

2.redux-saga

3.umi

4.dva

## redux-thunk的缺点

**缺点也是很明显的，thunk仅仅做了执行这个函数，并不在乎函数主体内是什么，也就是说thunk使 得redux可以接受函数作为action，但是函数的内部可以多种多样。比如下面是一个获取商品列表的异步操作所对应的action**：

export default ()=>(dispatch)=>{
    fetch('/api/goodList',{ //fecth返回的是一个promise
      method: 'get',
      dataType: 'json',
    }).then(function(json){
      var json=JSON.parse(json);
      if(json.msg==200){
        dispatch({type:'init',data:json.data});
      }
    },function(error){
      console.log(error);
    });
};

从这个具有副作用的action中，我们可以看出，函数内部极为复杂。如果需要为每一个异步操作都如此定义一个action，显然action不易维护。

action不易维护的原因：

action的形式不统一
就是异步操作太为分散，分散在了各个action中

## redux-sage使用

底层使用的es6 的generator

redux-saga使副作用（数据获取、浏览器缓存获取）易于管理、执行、测试和失败处理

安装 yarn add --save redux-saga

**原理：redux-saga提供一个中间件，并且在清单中记录若干action，并监听这些action，代码运行时，如果监听到清单中的action，则执行响应的函数，如果监听到action不在清单中，则放行**

**action1(plain object)——>redux-saga监听—>执行相应的Effect方法——>返回描述对象—>恢复执行异步和副作用函数—>action2(plain object)**

### effect类方法

对比redux-thunk我们发现，**redux-saga中监听到了原始js对象action，并不会马上执行副作用操作，会先通过Effect方法将其转化成一个描述对象，然后再将描述对象，作为标识，再恢复执行副作用函数。**

通过使用Effect类函数，可以方便单元测试，我们不需要测试副作用函数的返回结果。只需要比较执行Effect方法后返回的描述对象，与我们所期望的描述对象是否相同即可。

- take

take这个方法，是用来监听action，返回的是监听到的action对象

- call(apply)



call和apply方法与js中的call和apply相似，我们以call方法为例：

call(fn, ...args)

call方法调用fn，参数为args，**返回一个描述对象。不过这里call方法传入的函数fn可以是普通函数，也可以是generator。call方法应用很广泛，在redux-saga中使用异步请求等常用call方法来实现。**

yield call(fetch,'/userInfo',username)

- put


  在前面提到，redux-saga做为中间件，工作流是这样的：

  UI——>action1————>redux-saga中间件————>action2————>reducer..

  从工作流中，我们发现redux-saga执行完副作用函数后，必须发出action，然后这个action被reducer监听，从而达到更新state的目的。**相应的这里的put对应与redux中的dispatch**

- select


  put方法与redux中的dispatch相对应，同样的如果我们想在中间件中获取state，那么需要使用select。**select方法对应的是redux中的getState**，用户获取store中的state，使用方法：

  const state= yield select()

- fork

  fork方法相当于web work，fork方法不会阻塞主线程，在非阻塞调用中十分有用。

- takeEvery和takeLatest


  takeEvery和takeLatest用于监听相应的动作并执行相应的方法，是构建在take和fork上面的高阶api，比如要监听login动作，好用takeEvery方法可以：

  ```
  takeEvery('login',loginFunc)
  ```

  **takeEvery监听到login的动作，就会执行loginFunc方法，除此之外，takeEvery可以同时监听到多个相同的action。**

  takeLatest方法跟takeEvery是相同方式调用：

  ```
  takeLatest('login',loginFunc)
  ```

  与takeLatest不同的是，takeLatest是会监听执行最近的那个被触发的action。
  

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

### 扩展路由（重要）

约定式路由虽然能节省冗杂的路由配置，但也不如直接配置 **routes** 来的灵活

Umi 的解决方案是，通过 [yaml](http://www.ruanyifeng.com/blog/2016/07/yaml.html?f=tt) 注释（**注意空格**）来扩展约定式路由的功能

Umi 约定路由文件的首个注释如果包含 yaml 格式的配置，则会被用于扩展路由

比如修改页面的 title，可以直接通过添加 yaml 注释搞定

```
/**
 * title: AboutPage
 * Routes:
 * - ./routes/PrivateRoute.js
*/

```

**这样一来，当前组件就会作为子组件嵌套在 PrivateRoute.js 中**

然后在 PrivateRoute.js中添加校验权限的逻辑，见代码

**所有** **routes** **字段可以配置的参数，都可以通过注释来扩展**（如redirect重定向等）

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

**注意：effects里的函数是通过generator函数实现的，要遵循generator语法**

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

#### 测试1：404页面的快速构建

修改404页面提示内容，404.js

**Exception为ant design pro提供的异常页**

```
import {Exception} from 'ant-design-pro'


export default function() {
  return (
    <Exception type="404"backText="返回首页"></Exception>
  );
}

exception组件的type404构建一个现成的404页面
```

#### 测试2：登录login页面的快速构建

**ant-design-pro提供了一个Login的组件，直接使用即可**

##### 思路

1.pages/login.js 渲染页面

2.mock/login.js模拟数据 （post /api/login)

3.models/login.js 创建状态（reducer

4.pages/login.js 通过connect拿到3中的状态，通过参数传递给function让其调用

这里在connect中没有传参数，则直接在function里通过props.dispatch进行派发

```
export default connect()(function(props) {
  //let from=props.location.state.from||"/";//重定向地址
  const onSubmit=(err,values)=>{
    console.log(err,values);
    props.dispatch({type:'user/login',payload:values})
  };
```

### 6.设置拦截器

在根目录下建立interaptor.js

### 7.使拦截器生效

在根目录下创建global.js，引入拦截器