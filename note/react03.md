组件化02

## 表单组件设计思路

1.表单组件要求实现数据收集、校验、提交等特性，可通过**高阶组件扩展**

2.高阶组件给表单组件传递一个input组件包装函数接管其输入事件并同意管理表单数据

3.高阶组件给表单组件传递一个校验函数使其具备数据校验功能

### 检查点

尝试实现form（布局、提交）、formitem（错误信息）、input（前缀图标）

大致过程：

在高阶组件里将传入的组件（commentlist/KFormlist)：

- 实现全局校验：在全局校验里接收一个回调函数作为参数，把配置里的所有项都进行单项校验，根据单项校验是否都通过，执行回调的不同逻辑
- 实现单项校验：触发的条件是最后表单组件进行提交或者是在字段装饰器里返回的input组件里触发了变更通知，变更通知会把value值传给单项校验函数再一次进行校验。校验的逻辑就是**用every遍历这个要校验的项的所有规则**，比如规则里是否有required，如果有则检查当前项的值是否为空，如果为空则设置报错信息,并返回false。通过every这个逻辑，如果所有规则都返回true，才算这个单项校验通过
- **字段装饰器**：**期望的格式：getFieldDec(field,option)(Comp).**接收field和option，初始化数据，并根据第二级参数返回一个包装后的组件，这个组件的属性是只读的，所以只能克隆，并添加变更通知
- 变更通知：每次都重新赋值this.state[field],并将这个值传入单项校验进行校验

```js
import React, { Component } from 'react'

//高阶组件实现扩充
function WrapForm(Comp) {
  return class extends Component {
    constructor(props) {
      super(props)
      //配置项
      this.options = {}
      //表单的值
      this.state = {}
    }
    //全局校验,接收一个回调作为参数，根据单项校验是否都通过，执行回调的不同逻辑
    validateFields = (cb) => {
      //遍历options的所有属性名组成数组，让里面的每个值都去单项校验
      const rets = Object.keys(this.options).map((field) => {
        this.validateField(field)
      })
      const ret = rets.every((v) => v)
      cb(ret, this.state)
    }
    //单项校验
    validateField = (field) => {
      const { rules } = this.options[field]
      const ret = rules.every((rule) => {
        if (rule.required) {
          if (!this.state[field]) {
            //如果没值则设置报错信息：
            this.setState({
              [field + 'Message']: rule.message,
            })
            return false
          }
        }
        return true
      })
      // 若校验成功,清理错误信息
      if (ret) {
        this.setState({
          [field + 'Message']: '',
        })
      }
      return ret
    }
    //变更通知，如果变更就重新请求单项校验
    handleChange = (e) => {
      const { name, value } = e.target
      //赋值
      this.setState(
        {
          // 相当于this.state[field]=value.因为name永久保存着相对应的field的值
          [name]: value,
        },
        () => {
          //解决setState异步问题，确保能拿到this.state[field]
          this.validateField(name)
        }
      )
    }
    //字段装饰器,在里面克隆子组件，并为其添加name、value属性和监听事件
    getFieldDec = (field, option) => {
      this.options[field] = option
      // 返回一个装饰器(其实就是一个高阶组件）
      return (InputComp) => {
        return (
          <div>
            {/*传递的组件的属性是只读的，不能修改，所以只能克隆,第一个参数为克隆的元素，第二个参数可以进行修改*/}
            {React.cloneElement(InputComp, {
              name: field, //控件name，这个属性保存了field
              //即一开始state下没有field，value为空，当输入值时触发onChange才开始校验
              value: this.state[field] || '',
              onChange: this.handleChange, //输入值变化的监听回调
            })}
            {/*校验错误信息*/}
            {this.state[field + 'Message'] && (
              <p style={{ color: 'red' }}>{this.state[field + 'Message']}</p>
            )}
          </div>
        )
      }
    }
    render() {
      return (
        <div>
          <Comp
            {...this.props}
            validateFields={this.validateFields}
            getFieldDec={this.getFieldDec}
          />
        </div>
      )
    }
  }
}

//FormItem只展示内容
function FormItem(props) {
  return <div>{props.children}</div>
}

//对外暴露的组件Form
class KFormTest extends Component {
  onLogin = () => {
    // 校验 参数接收validateFields的函数参数cd传递来的参数
    this.props.validateFields((isValid, data) => {
      if (isValid) {
        console.log('登录！')
      } else {
        alert('校验失败')
      }
    })
  }

  render() {
    //是通过高阶组件实现的！
    const { getFieldDec } = this.props
    return (
      <div>
        <FormItem>
          {/*接收两个参数，返回一个装饰器*/}
          {getFieldDec('username', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(<input type="text" />)}
          {getFieldDec('password', {
            rules: [{ required: true, message: '请输入密码' }],
          })(<input type="password" />)}
          {/*<Input type="password"/>*/}
          <button onClick={this.onLogin}>登录</button>
        </FormItem>
      </div>
    )
  }
}
const KFormlist = WrapForm(KFormTest)
export default KFormlist

```

优化：用装饰器，需要安装插件，见class-test/KFormTest

## 弹窗类组件设计与实现

### 设计思路

弹窗类组件的要求弹窗内容在A处声明，却在B处展示。react中相当于弹窗内容看起来被render到一个组件里面去，实际改变的是网页上另一处的dom结构，这显然不符合正常逻辑。但通过使用框架提供的特定API创建组件实例并指定挂在目标仍可完成任务。

#### 方案1：

portal传送门

传送门，react v16之后出现的portal可以实现内容传送功能。范例：Dialog组件



#### 方案2：

unstable_renderSubtreeIntoContainer
在v16之前，要用到react中两个秘而不宣的React API: unstable_renderSubtreeIntoContainer,unmountComponentAtNode

详情见pdf。总结来说就是dialog什么都不给自己画，render一个null，通过调用createPortal把要画的东西画在DOM树上另一个角落

## 树形组件设计与实现

### 设计思路

react中实现递归组件更加纯粹，就是组件递归渲染即可。假设我们的节点组件是TreeNode，它的render中只要发现当前节点拥有子节点就要继续渲染自己。节点的打开状态可以通过给组件一个open状态来维护



## 常见组件优化技术（重要）

见CommentList或commentlist在的Optimization.js

在子组件不增加shouldComponentUpdate的情况下，无论父组件的值是否变化、子组件的props和state是否变化，只要父组件重新渲染了，就会带动子组件重新渲染，性能很不好

```js
export default class Parent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pnum: 0,
    }
  }
  add = () => {
    this.setState({ pnum: this.state.pnum + 1 })
  }
  inial = () => {
    this.setState({ pnum: this.state.pnum })
  }
  render() {
    console.log('parent render')
    return (
      <div>
        <h1>父组件</h1>
        <button onClick={this.add}>增加</button>
        <button onClick={this.inial}>不改变</button>
        <Child pnum={this.state.pnum} />
      </div>
    )
  }
}
class Child extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cnum: 0,
    }
  }
  render() {
    console.log('child render')
    return <div>子组件</div>
  }
}
```

优化方案：

### 1.shouldComponentUpdate

通常网页为了实时更新留言板等数据，会隔1秒就会刷新数据，如果数据没更新，其实会进行许多重复繁琐无意义的工作。利用**shouldComponentUpdate(nextprops,nextstate)进行判断**，详情见pdf

如果props没改变则返回false，代表子组件不重新渲染，否则返回true，重新渲染

即子组件添加生命周期：

```js
class Child extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cnum: 0,
    }
  }
  shouldComponentUpdate(nextprops, nextstate) {
    if (nextprops.pnum === this.props.pnum) {
      return false
    }
    return true
  }
  render() {
    console.log('child render')
    return <div>子组件</div>
  }
}
```



### 2.PureComponent

定制了shouldComponentUpdate后的Component，即通过**浅比较state和props来自动实现了shouldComponentUpdate的功能**

缺点 必须要用**class形式**，而且PureComponent中的shouldComponentUpdate**仅作浅比较**，只比较第一层，仅在props和state较为简单时才是用，在深层比较时调用 **forceUpdate(）（不推荐）**来确保组件被正确地更新。你也可以考虑使用 **immutable 对象（推荐）**加速嵌套数据的比较。

即修改子组件代码为继承自PureComponent

```js
class Child extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      cnum: 0,
    }
  }

  render() {
    console.log('child render')
    return <div>子组件</div>
  }
}
```



### 3.React.memo

`React.memo` 为高阶组件。它与 `React.PureComponent` 非常相似，但只适用于函数组件，而不适用 class 组件。`React.memo` 仅检查 props 变更。如果函数组件被 `React.memo` 包裹，且其实现中拥有 useState 或 useContext 的 Hook，当 context 发生变化时，它仍会重新渲染。

即修改成：

```js
const Child = React.memo(function (props) {
  useEffect(() => {
    console.log('child render')
  })
  return <div>{props.pnum}</div>
})
```

[三者的比较](https://juejin.im/post/5e95b586e51d454719461b82)

注意：

`shouldComponentUpdate`和`PureComponent`是类组件中的优化方式，，而`React.memo`是函数组件中的优化方式。

`shouldComponentUpdate`和`PureComponent`都适用于父组件向子组件传递的是基本类型的数据，若传递的是引用类型的数据，则需要深层比较，要使用forceUpdate或immutable

例子：如果不加强制更新，父组件更新后子组件的内容并不会更新

```js
export default class Parent extends Component {
  constructor(props) {
    super(props)
    this.state = {
      parentInfo: [{ name: '哈哈哈' }],
    }
  }
  changeParentInfo = () => {
    let temp = this.state.parentInfo
    temp[0].name = '呵呵呵：' + new Date().getTime()
    this.setState(
      {
        parentInfo: temp,
      },
      () => {
        this.ChildRef.updateChild()
      }
    )
  }

  render() {
    console.log('parent render')
    return (
      <div>
        <h1>父组件</h1>
        <button onClick={this.changeParentInfo}>改变父组件state</button>
        <br />
        <Child
          ref={(Child) => (this.ChildRef = Child)}
          parentInfo={this.state.parentInfo}
        ></Child>
      </div>
    )
  }
}
```

Immutable 则提供了简洁高效的判断数据是否变化的方法，只需 === 和 is 比较就能知道是否需要执行 render()，而这个操作几乎 0 成本，所以可以极大提高性能。首先将`Parent`组件中调用子组件强制更新的代码`this.childRef.updateChild()`进行注释，再修改`Child`组件的`shouldComponentUpdate()`方法：

```
import { is } from 'immutable'

shouldComponentUpdate (nextProps = {}, nextState = {}) => {
  return !(this.props === nextProps || is(this.props, nextProps)) ||
      !(this.state === nextState || is(this.state, nextState))
}

```

此时我们再查看控制台和页面的结果可以发现，子组件进行了重新渲染。

### 4.useCallback

参考例子：https://juejin.im/post/5dd64ae6f265da478b00e639

https://juejin.im/post/5e78884c6fb9a07c8679220d

当父组件传递给子组件的参数是一个函数，且函数内存在修改state数据导致每次修改后，都会重新渲染父组件，导致每次这个函数都是一个重新创建的函数时，那么**子组件内通过shouldComponentUpdate、PureComponent、React.memo的优化将失效（因为每次都是不同的函数**

解决方法：**useCallback**，通过使用它的依赖缓存功能，在合适的时候将函数缓存起来。形式：`const memoizedCallback = useCallback(()=>{dosomething(a,b)},deps依赖项)`表示这个函数根据依赖项而变化，如果依赖项不发生变化，则会持续缓存该函数的相同引用；只有发生变化时，才会更新函数

例：

```js
import React, { Component, useState, useCallback, useMemo } from 'react'
export default function Parent() {
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  //此时不论是触发change1还是change2，由于都改变了数据，整个组件重新刷新
  //导致Parent组件整个重新刷新，两个Child组件的随机数都发生改变
   const change1 = () => {
     setCount1(count1 + 1)
   }
   const change2 = () => {
     setCount2(count2 + 1)
   }
  }, [count2])
  return (
    <div>
      {result}
      <Child onClick={change1}>增加count1</Child>
      <Child onClick={change2}>增加count2</Child>
    </div>
  )
}
//实现浅拷贝
const Child = React.memo(function ({ onClick, children }) {
  return (
    <div>
      <button onClick={onClick}>{children}</button>
      <span>{Math.random()}</span>
    </div>
  )
})

```

修改代码，实现如果点击第一个child组件，只更新第一个组件，**第二个子组件要实现只有在count2变化时才变化（即实现避免多次不必要渲染）**

```js
import React, { Component, useState, useCallback, useMemo } from 'react'
export default function Parent() {
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  const change1 = () => {
    setCount1(count1 + 1)
  }
  //只有当count2发生改变的时候，change2才会返回新的函数，否则一直缓存着旧的函数
  //即当change1被触发时，不改变第二个Child组件，但change2触发时，两个组件会同时更新
  const change2 = useCallback(() => {
    setCount2(count2 + 1)
  }, [count2])
  return (
    <div>
      {result}
      <Child onClick={change1}>增加count1</Child>
      <Child onClick={change2}>增加count2</Child>
    </div>
  )
}

const Child = React.memo(function ({ onClick, children }) {
  return (
    <div>
      <button onClick={onClick}>{children}</button>
      <span>{Math.random()}</span>
    </div>
  )
})

```

### 5.useMemo

`useMemo`和`useCallback`几乎是99%像是，当我们理解了useCallback后理解useMemo就非常简单。

他们的唯一区别就是：`useCallback`是根据依赖(deps)缓存第一个入参的(callback)。`useMemo`是根据依赖(deps)缓存第一个入参(callback)执行后的值。

比如，在上述例子中想要实现一个复杂算法：生成随机数，这个随机数只有在count2发生改变时才会触发

```js
增加：
  const result = useMemo(() => {
    return Math.random().toString().slice(2)
  }, [count2])
```

