## 最核心的api

React.createElement: 创建虚拟DOM

React.Component: 实现自定义组件

ReactDOM.render:渲染真实DOM

## JSX

### 1.什么是JSX

语法糖

React用JSX来替代常规的JavaScript

JSX是一个看起来很像XML的JavaScript语法扩展

### 2.原理

**babel-loader会预编译JSX为React.createElement(...)**

### 3.与vue的异同

- react中虚拟dom+jsx的设计一开始就有，vue则是演进过程中才出现的
- jsx本来就是js扩展，转移过程简单直接的多（即jsx{}->React.createElement:)；vue把template编译为render函数的过程需要复杂的编译器转换：模板字符串->ast->js函数

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

**由jsx编译成的react.createelement:**

```
ReactDOM.render(React.createElement) {
    'div',
    {id:'demo'},
    React.createElement('span',null,'hi')
    React.createElement(Comp,{name:'kaikeba'})
}
参数1：类型；参数2：属性；参数3：孩子元素
```

执行时，从最里面开始执行，逐步执行到外部

## 实现React.Component

实现了虚拟dom的创建，

## 实现ReactDOM.render

创建kreact-dom

### 引入initVnode

通过container.appendChild把虚拟dom转换成真实dom

**创建kvdom来实现initVnode，将vdom转换成dom**

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

setState

class组件的特点，就是拥有特殊状态并且可以通过setState更新状态并重新渲染视图

setState特点：批量，异步（解决异步：定时器，原生事件（click执行等）