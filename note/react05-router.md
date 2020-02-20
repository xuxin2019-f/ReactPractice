# 路由

## 路由插件相关

## 1.使用react-router-dom实现路由跳转

### 基本使用

1. react-router-dom（在浏览器使用）

2. react-router-native（开发手机原生应用使用

   ​    推荐使用react-native

使用流程

下载yarn add react-router-dom -S

引入对象，**按需引入HashRouter、BrowserRouter（更常用、Route**

+ HashRouter：是一个路由的跟容器，一个应用程序中，一般只需要唯一的一个HashRouter容器即可！将来，所有的Route和Link都要在HashRouter中进行使用

 - 注意：**HashRouter、BrowserRouter中，只能有唯一的一个子元素**
 - 
 - BrowserRouter最终没有#的方式，原理基于click+history.pushState

+ Link：是相当于超链接a一般的存在；点击Link，跳转到相应的路由页面！负责进行路由地址的切换！

+ NavLink，类似于Link，**但可以加上活动的样式**

  ```
  <NavLink to="/a/man" activeStyle={{color:'red'}}>男样式</NavLink>
  
  <NavLink to="/a/woman" activeClassName="selected">女类名</NavLink>
  ```

  

+ Route：**是路由匹配规则，当路由地址发生切换的时候，就会来匹配这些定义好的Route规则，如果有能匹配到的路由规则，那么，就会展示当前路由规则所对应的页面！**

+ Route：**除了是一个匹配规则之外，还是一个占位符，将来，此Route所匹配到的组件页面，将会展示到Route所在的这个位置！(代表秒点及组件和填入的位置)**

```
// 其中path指定了路由匹配规则，component指定了当前规则所对应的组件

<Route path="" component={}></Route>

```

+ 注意：**react-router中的路由匹配，是进行模糊匹配的**！可以通过`Route`身上的`exact`属性，来表示当前的`Route`是进行精确匹配的

+ 所谓模糊匹配，指的就是只要是path中以该路由开头的都能匹配的到

  ```
  <Router>
            <React.Fragment>
              <Route path="/" component={Home} />
              <Route path="/a" component={Home}/>
            </React.Fragment>
          </Router>
          
          则当路由是/a时，两条路由规则都能匹配到，会加载两个Home组件
  ```

+ 所谓精确匹配，就是指必须路由完全相同才能匹配

  ```
   <Route path="/"  exact component={Home} /> /为首页
   <Route path="/a"  component={Home}/>
  ```

  

+ 可以使用`Redirect`实现路由重定向

```
    // 导入路由组件

    //import {Route, Link, Redirect} from 'react-router-dom'
// Route相当于规则+坑
import { HashRouter,BrowserRouter as Router, Route, NavLink, Switch, Redirect } from 'react-router-dom'


    <Redirect to="/movie/in_theaters"></Redirect>

```



## 2.Switch 选择一个

**控制横向匹配**一个，被其包裹的Router从上到下，只会匹配一个（选其一

```
<Switch>
      <Route path='/a/man' component={woman}/>
      <Route path='/a/man' component={man}/>
</Switch>
与顺序有关，哪个在前就匹配哪个
```



## 3.Exact精确匹配

**控制纵向（深入）匹配**一个，精确匹配锚点

应用场景：首页“/”需要使用，因为/范围太大，模糊匹配会匹配很多页面

   其他路由不适用，为了能使用嵌套路由

```
<Route path="/"  exact component={Home} /> /为首页
 <Route path="/a" component={Home}/> 为了可以深入匹配，如/a/b。所以不加exact
```

出现的问题

```
 <Route path='/a/man' component={woman}/>
 <Route path='/a/man' component={man}/>
 当访问该路由时，会加载两个组件，如果用exact精准匹配，又阻止了深入嵌套，此时用swich，从上到下只匹配一个
```



## 4.重定向

```
<Redirect to="/"/>
在所有路由规则都不匹配的情况下，重定向到首页
```

或者运用到404页面

设定一个没有path的路由在路由列表最后面，表示一定匹配

```
<Switch>
...
...
<Route component = {()=><h3>页面不存在</h3>}</Route>
</Switch>
```



## 5.路由传参

1. 需要把路由规则中，对应参数的片段区域，使用`:`指定为参数：

   ```
   <Route exact path="/movie/:type/:id" component={Movie}></Route>
   ```

2. match方法传递

   通过 `this.props.match.params`获取路由规则中传递给该组件的参数

   ```
   在movie组件里的规则（如componentDidMounted）可以通过
   this.props.match.params.type/id获取
   如果是function组件
   function({match}){
   match.params.type/id获取
   }
   ```

   3.location方法传递

   **适合传递复杂的对象参数**

```
<NavLink to={path}>传参给女人</NavLink>

 var data = {id:3}
    var path= {
      pathname: '/a/woman',
      query: data
    }
    
 则传递的参数可以通过this.props.location.query获得
```

​     4.history方法

通过 `this.props.history`对象提供的方法， 可以实现编程式导航：

1. `this.props.history.go(n)` 前进或后退N个历史记录
2. `this.props.history.goBack()`后退1个历史记录
3. `this.props.history.goForward()`前进1个历史记录
4. `this.props.history.push('url地址')`跳转到哪个路由超链接中去

**同理，构造函数组件会接收三个参数：**

```
functionDetail({match,history,location}){
console.log(match,history,location);
return(
<div>
ProductMgt
<p>{match.params.name}</p></div>
);}
```

## 6.嵌套

见pdf

## 7.路由守卫

核心思想：通过组件包装Route，得到一个ProvateRoute，为其扩展一个用户鉴权（状态检查）功能

```
// 路由守卫：定义一个PrivateRoute组件
// 为其扩展一个用户状态检查功能
// component作别名，因为小写的在下面的组件渲染不能用，rest是其他的属性，如exact等
function PrivateRoute({ component: Component, isLogin, ...rest }) {
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
}
```

## 扩展

### react-router原理

react-router秉承一切皆组件，因此实现的核心就是BrowserRouter，Router，Link

**BrowserRouter**：将match、历史记录管理对象history、location变更监听**初始化**及向下组件传递（相当于创建了个context上下文）

创建MyRouterTest.js,**首先实现BrowserRouter**

创建上下文

**实现Route组件**

**match的实现是根据pathname（即url）和用户传递的属性（这里应该比较的是传递过来的path属性）获得match对象，需要引用matchPath.js工具**

从this.props中解构出三个函数：children，component，render（条件渲染）（**意思就是如果父组件在调用Route的时候，传递了这三个函数的某一个，则就会被解构出来**），**这三个属性都接收一个函数作为值，都可以接收route的三个参数：history、location、match。优先级：children>component>render**

如果children是个函数，将history，location，match作为参数传递进去

**实现Link组件**

从this.props中解构出to作为跳转的属性