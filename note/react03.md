组件化02

## 表单组件设计思路

1.表单组件要求实现数据收集、校验、提交等特性，可通过高阶组件扩展

2.高阶组件给表单组件传递一个input组件包装函数接管其输入事件并同意管理表单数据

3.高阶组件给表单组件传递一个校验函数使其具备数据校验功能

### 检查点

尝试实现form（布局、提交）、formitem（错误信息）、input（前缀图标）

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



## 常见组件优化技术

见CommentList

### 1.shouldComponentUpdate

通常网页为了实时更新留言板等数据，会隔1秒就会刷新数据，如果数据没更新，其实会进行许多重复繁琐无意义的工作。利用shouldComponentUpdate进行判断，详情见pdf

### 2.PureComponent

定制了shouldComponentUpdate后的Componen

缺点 必须要用class形式，而且是浅比较，只比较第一层

### 3.React.memo

