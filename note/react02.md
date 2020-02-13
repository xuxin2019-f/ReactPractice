# 移动App第4天


## 组件的生命周期
 + 概念：在组件创建、到加载到页面上运行、以及组件被销毁的过程中，总是伴随着各种各样的事件，这些在组件特定时期，触发的事件，统称为 组件的生命周期；
 + 组件生命周期分为三部分：
   - **组件创建阶段**：组件创建阶段的生命周期函数，有一个显著的特点：**创建阶段的生命周期函数，在组件的一辈子中，只执行一次；**
	
	  0.1 static props
	
	  0.2 this.state={}
	> 1.componentWillMount: 组件将要被挂载，**此时还没有开始渲染虚拟DOM（虚拟DOM是在render里执行的），此时无法获取到页面上的任何元素，在这个阶段不能操作页面的dom元素，但是能访问到props和state,也能访问组件上的所有函数。 所以这个函数等同于vue中的created**
	>
	> 官方不推荐在此时发请求，可能会造成渲染的阻塞
>2.render：第一次开始渲染真正的虚拟DOM，当render执行完，内存中就有了完整的虚拟DOM了，但此时虚拟DOM并没有挂载到真正的页面上
>
>可以做渲染过滤
>
>3.componentDidMount: 组件完成了挂载，此时，组件已经显示到了页面上，当这个方法执行完，组件就进入都了 运行中 的状态 **相当于vue中的mounted函数**
>
>在此处发网络请求
>
>在这个函数中，我们可以放心的去操作页面上 需要使用的DOM元素（最早也只能在此时）

   - **组件运行阶段**：**也有一个显著的特点，根据组件的state和props的改变，有选择性的触发0次或多次**；
   > componentWillReceiveProps: 组件将要接收新属性，此时，只要这个方法被触发，就证明父组件为当前子组件传递了新的属性值；
   > shouldComponentUpdate: 组件是否需要被更新，此时，组件尚未被更新，但是，state 和 props 肯定是最新的
   >
   > **如果return ture，则组件可以被更新；return false组件不被更新**
   >
   > componentWillUpdate: 组件将要被更新，此时，尚未开始更新，**内存中的虚拟DOM树还是旧的**
   > render: 此时，又要重新根据最新的 state 和 props 重新渲染一棵内存中的 **虚拟DOM树，当 render 调用完毕，内存中的旧DOM树，已经被新DOM树替换了！此时页面还是旧的**
   > componentDidUpdate: **此时，页面又被重新渲染了，state 和 虚拟DOM 和 页面已经完全保持同步**

   - **组件销毁阶段**：**也有一个显著的特点，一辈子只执行一次**；
   > componentWillUnmount: 组件将要被卸载，此时组件还可以正常使用；

[vue中的生命周期图](https://cn.vuejs.org/v2/guide/instance.html#生命周期图示)
[React Native 中组件的生命周期](http://www.race604.com/react-native-component-lifecycle/)


![React中组件的生命周期](./images/React中组件的生命周期.png)

### defaultProps
> 在组件创建之前，会先初始化默认的props属性，作用是防止组件中某些必须的属性外界没有传递时的报错问题。这是全局调用一次，严格地来说，这不是组件的生命周期的一部分。
>
> 在组件被创建并加载后，首先调用 constructor 构造器中的 this.state = {}，来初始化组件的私有数据，它定义在组件的constructor构造函数中。在class类中，只要new这个类，必然会优先调用constructor，所以this.state会在第一时间被初始化

React生命周期的回调函数总结成表格如下：
![React生命周期表格](./images/React生命周期表格.png)
组件生命周期的执行顺序：

+ **Mounting**
 - constructor()
 - componentWillMount()
 - render()
 - componentDidMount()
+ **Updating**
 - componentWillReceiveProps(nextProps)

 - shouldComponentUpdate(nextProps, nextState)

 - componentWillUpdate(nextProps, nextState)

 - render()

 - componentDidUpdate(prevProps, prevState)

   此时页面和内存中的数据都是最新的，可以直接从this.state和this.props直接获取了，所以旧的可以从参数列表中拿
+ **Unmounting**
 - componentWillUnmount()

   

## 通过Counter计数器的小案例 - 了解生命周期函数
1. 给 `props` 属性提供默认值 和 进行类型校验，需要先运行`cnpm i prop-types --save`

   **如果用脚手架，已经为我们包装好了在node-modules里的prop-types里** 只需引入：

   ```
   import PropTypes from 'prop-types'
   ```

   

2. 给组件的 `props` 提供默认值

   ```
     // 为组件提供 默认的 props 属性值
     static defaultProps = {
       initcount: 0 // 默认值为0    如果用户没有传递 ，则 默认就是0； 如果用户传递了，则 以用户传递的为准
     }
   ```

3. 给组件的 `props` 进行类型校验

   ```
     // 3. 进行 props 属性的类型校验,   static propTypes = {}  是固定写法
     static propTypes = {
       initcount: PropTypes.number.isRequired // 规定 外界在传递 initcount 的时候，必须是 number 值类型，否则 ，会在终端报警告
       // isRequired 表示 这个 props 属性值 是必须要传递的
     }
   ```


## 组件初始化时生命周期事件总结
1. componentWillMount：

2. render：

3. componentDidMount：

4. 注意：在**render函数中，不能调用`setState()`方法**

   **因为：setState 会触发 render 函数的执行，如果在 render 函数中，又调用了 setState ，则会进入死循环！**

   ```
   1.componentWillMount() { // 这个 函数，等同于 Vue 中的 created 生命周期函数
       // 此时，无法获取到 页面上的 任何元素，因为 虚拟DOM 和 页面 都还没有开始渲染呢！【在这个阶段中，不能去操作页面上的DOM元素】
       // console.log(document.getElementById('myh3'));拿不到
       // console.log(this.props.initcount);
       // console.log(this.state.msg);
       // this.myselfFunc()
     }
     
   2.render() {
       // 在 return 之前，虚拟DOM还没有开始创建，页面上也是空的，根本拿不到任何的 元素
       // console.log(document.getElementById('myh3'));
   
       // 在 组件运行阶段中，每当调用 render 函数的时候，页面上的 DOM元素，还是之前旧的
       // console.log(this.refs.h3 && this.refs.h3.innerHTML);
   
       // 不要在 render 中使用 this.setState,因为 会陷入死循环
      /*  this.setState({
         count: this.state.count + 1
       }) */
   3.componentDidMount() {
       // 在这个函数中，我们可以放心的去 操作 页面上你需要使用的 DOM 元素了；
       // 如果我们想操作DOM元素，最早，只能在 componentDidMount 中进行；
       // componentDidMount 相当于 Vue 中的 mounted 函数
       // console.log(document.getElementById('myh3'));
       
   这里注意，如果不用箭头函数，this的指向是id为btn的button元素，所以用箭头函数，指向当前组件
       /* document.getElementById('btn').onclick = () => {
         // console.log('ok');
         // console.log(this);
         // this.props.initcount++
         this.setState({
           count: this.state.count + 1
         })
       } */
     }
     
    4. shouldComponentUpdate(nextProps最新的props, nextState最新的state) {
       // 1. 在 shouldComponentUpdate 中要求必须返回一个布尔值
       // 2. 在 shouldComponentUpdate 中，如果返回的值是 false，则 不会继续执行后续的生命周期函数，而是直接退回到了 运行中 的状态，此时有序 后续的 render 函数并没有被调用，因此，页面不会被更新，但是， 组件的 state 状态，却被修改了；
       // return false
   
       // 需求： 如果 state 中的 count 值是偶数，则 更新页面，如果 count 值 是奇数，则不更新页面，我们想要的页面效果：4，6，8，10，12....
       // 经过打印测试发现，在 shouldComponentUpdate 中，通过 this.state.count 拿到的值，是上一次的旧数据，并不是当前最新的；
       // console.log(this.state.count + ' ---- ' + nextState.count);
       // return this.state.count % 2 === 0 ? true : false
       // return nextState.count % 2 === 0 ? true : false
       return true
     }
     
    5.// 组件将要更新，此时尚未更新，在进入这个 生命周期函数的时候，内存中的虚拟DOM是旧的，页面上的 DOM 元素 也是旧的
     componentWillUpdate() {
       // 经过打印分析，得到，此时页面上的 DOM 节点，都是旧的，应该慎重操作，因为你可能操作的是旧DOM
       // console.log(document.getElementById('myh3').innerHTML)
       // console.log(this.refs.h3.innerHTML);
     }
     
    6.// 组件完成了更新，此时，state 中的数据、虚拟DOM、页面上的DOM，都是最新的，此时，你可以放心大胆的去操作页面了
     componentDidUpdate(nextProps) {
       // console.log(this.refs.h3.innerHTML);
     }
     7.componentWillReceiveProps
     父组件最初始传递给子组件的属性并不会导致这个钩子函数的触发，只有当父组件中，通过没写事件，重新修改了传递给子组件的props数据之后，才会触发
    在被出发时，如果使用this.props来获取属性值，获取的是旧属性值，如果想要获取最新值，要通过出参数列表获取:nextProps.属性值
     
     componentWillReceiveProps(nextProps) {
       console.log('触发啦！！最新的props值是:'+ nextProps.pmsg + '旧的props值为：'+ this.props.pmsg)
     }
   ```
   



## 高阶组件函数调用

高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式

具体而言，**高阶组件是参数为组件，返回值为新组件的函数。**



```
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```



组件是将 props 转换为 UI，而高阶组件是将组件转换为另一个组件。

请注意，HOC 不会修改传入的组件，也不会使用继承来复制其行为。相反，HOC 通过将组件*包装*在容器组件中来*组成*新组件。HOC 是纯函数，没有副作用。

**注意：1.不要试图在 HOC 中修改组件原型（或以其他方式改变它）HOC 不应该修改传入组件，而应该使用组合的方式，通过将组件包装在容器组件中实现功能：**

​            2.**不要在render方法中使用HOC，会报错**

**解决方法是在别的组件中定义HOC后export暴露，在当前组件用import引用；或者直接在当前组件中定义后，再将该HOC用另一个变量名引用，再在render中用这个变量名作为标签名**

```
class Fn extends Component {
  render() {
    return (
      <div>
        <h3>hoc</h3>
      </div>
    );
  }
}
// 高阶组件
function enhance(Wrappedcommenlist) {
  return class temp extends Component {
    componentDidMount() {
      console.log('这个高阶组件被挂载了')
    }
    render() {
      return <Wrappedcommenlist />
    }
  }
}
let WrapCommentList = enhance(Fn)
引用直接写成：
 <WrapCommentList />
```



## 通过原生的方式获取元素并绑定事件

## React中使用ref属性获取DOM元素引用

和 Vue 中差不多，vue 为页面上的元素提供了 `ref` 的属性，如果想要获取 元素引用，则需要使用`this.$refs.引用名称`

在 React 中，也有 `ref`, 如果要获取元素的引用`this.refs.引用名称`


## 使用React中的事件，绑定count自增


## 组件运行中事件的对比
1. shouldComponentUpdate：
2. componentWillUpdate：
3. render：
4. componentDidUpdate：


## 绑定this并传参的三种方式
1. 在事件中绑定this并传参：
```
    <input type="button" value="在事件中绑定this并传参" onClick={this.handleMsg1.bind(this, '🍕', '🍟')} />

    // 在事件中绑定this并传参
    handleMsg1(arg1, arg2) {
        console.log(this);
        // 此时this是个null
        this.setState({
            msg: '在事件中绑定this并传参：' + arg1 + arg2
        });
    }
```
2. 在构造函数中绑定this并传参:
```
    // 修改构造函数中的代码：
    this.handleMsg2 = this.handleMsg2.bind(this, '🚗', '🚚');

    <input type="button" value="在构造函数中绑定this并传参" onClick={this.handleMsg2} />

    // 在构造函数中绑定this并传参
    handleMsg2(arg1, arg2) {
        this.setState({
            msg: '在构造函数中绑定this并传参：' + arg1 + arg2
        });
    }
```
3. 用箭头函数绑定this并传参：
```
    <input type="button" value="用箭头函数绑定this并传参" onClick={() => { this.handleMsg3('👩', '👰') }} />

    // 用箭头函数绑定this并传参
        handleMsg3(arg1, arg2) {
            this.setState({
                msg: '用箭头函数绑定this并传参：' + arg1 + arg2
            });
        }
```

## 绑定文本框与state中的值
1. 在Vue.js中，默认可以通过`v-model`指令，将表单控件和我们的`data`上面的属性进行双向数据绑定，数据变化和页面之间的变化是同步的！
2. 在React.js中，默认没有提供双向数据绑定这一功能，默认的，只能把`state`之上的数据同步到界面的控件上，但是不能默认实现把界面上数据的改变，同步到`state`之上，需要程序员手动调用相关的事件，来进行逆向的数据传输！
3. 绑定文本框和state的值：
```
    {/*只要将value属性，和state上的状态进行绑定，那么，这个表单元素就变成了受控表单元素，这时候，如果没有调用相关的事件，是无法手动修改表单元素中的值的*/}
    <input style={{ width: '100%' }} ref="txt" type="text" value={this.state.msg} onChange={this.handleTextChange} />

    // 这是文本框内容改变时候的处理函数
    handleTextChange = () => {
        this.setState({
            msg: this.refs.txt.value
        });
    }
```
4. 注意`setState的一个问题`：
```
// 保存最新的state状态值，在保存的时候，是异步地进行保存的，所以，如果想要获取最新的，刚刚保存的那个状态，需要通过回掉函数的形式去获取最新state
this.setState({
    msg: this.refs.txt.value
    // msg: e.target.value
}, function () {
    // 获取最新的state状态值
    console.log(this.state.msg);
});
```

## 发表评论案例

见代码

reload：把一个方法传递给子组件

```
<CMTBox reload={this.loadCmts}></CMTBox>

// 从本地存储中加载 评论列表
  loadCmts = () => {
    var list = JSON.parse(localStorage.getItem('cmts') || '[]')
    this.setState({
      list
    })
  }
  {/* 相对于 Vue 中，把 父组件传递给子组件的 普通属性 和 方法属性，区别对待， 普通属性用 props 接收， 方法 使用 this.$emit('方法名') */}
      {/* react 中，只要是传递给 子组件的数据，不管是 普通的类型，还是方法，都可以使用 this.props 来调用 */}
```




## 扩展
### context特性

在父组件上，直接共享一个context对象，子孙组件不需要逐层传递数据，可以直接获取

记住一串单词组合`getChildContextTypes`
前3个、后3个、后两个
一个方法、两个静态属性

```
//1.在父组件中，定义一个function，这个function有个固定的名称，叫做getChildContext,内部必须返回一个对象，这个对象，就是要共享给所有子孙组件的数据
  getChildContext() {
    return {
      color:this.state.color
    }
  }
  
  // 2.使用属性校验，规定一下传递给子组件的数据类型，需要定义一个静态的（static)childContextTypes（固定名称）
  
  static childContextTypes = {
    color:ReactTypes.string //规定了传递给子组件的数据类型
  }
  
  // 3.先属性校验，来校验一下父组件传递过来的参数类型
  static contextTypes = {
    color: ReactTypes.string //如果子组件想要使用父组件通过context共享的数据，一定要在使用前做一下数据校验
  }
```



## 相关文章
[类型校验](https://facebook.github.io/react/docs/typechecking-with-proptypes.html)
[Animation Add-Ons](https://reactjs.org/docs/animation.html#high-level-api-reactcsstransitiongroup)

