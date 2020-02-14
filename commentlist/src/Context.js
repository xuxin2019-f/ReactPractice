import React from 'react'
import ReactTypes from 'prop-types'
// 在不用context属性的情况下，层层传递color数据，很麻烦
// export default class Com1 extends React.Component {
//   constructor() {
//     super();
//
//     this.state = {
//       color: 'red'
//     }
//   }
//   render() {
//     return (
//       <div>
//         <h2>这是父组件</h2>
//         <Com2 color={this.state.color}></Com2>
//       </div>
//     )
//   }
// }
// class Com2 extends React.Component {
//   render() {
//     return (
//       <div>
//         <h2>这是子组件</h2>
//         <Com3 color={this.props.color}></Com3>
//       </div>
//     )
//   }
// }
//
// class Com3 extends React.Component {
//   render() {
//     return (
//       <div>
//         <h3  style={{color:this.props.color}}>这是子孙组件</h3>
//       </div>
//     )
//   }
// }





// export default class Com1 extends React.Component {
//   constructor() {
//     super();
//
//     this.state = {
//       color: 'red'
//     }
//   }
//   //1.在父组件中，定义一个function，这个function有个固定的名称，叫做getChildContext,内部必须返回一个对象，这个对象，就是要共享给所有子孙组件的数据
//   getChildContext() {
//     return {
//       color:this.state.color
//     }
//   }
//   // 2.使用属性校验，规定一下传递给子组件的数据类型，需要定义一个静态的（static)childContextTypes（固定名称）
//   static childContextTypes = {
//     color:ReactTypes.string //规定了传递给子组件的数据类型
//   }
//   render() {
//     return (
//       <div>
//         <h2>这是父组件</h2>
//         <Com2></Com2>
//       </div>
//     )
//   }
// }
// class Com2 extends React.Component {
//   render() {
//     return (
//       <div>
//         <h2>这是子组件</h2>
//         <Com3></Com3>
//       </div>
//     )
//   }
// }
//
// class Com3 extends React.Component {
//   // 3.先属性校验，来校验一下父组件传递过来的参数类型
//   static contextTypes = {
//     color: ReactTypes.string //如果子组件想要使用父组件通过context共享的数据，一定要在使用前做一下数据校验
//   }
//   render() {
//     return (
//       <div>
//         <h3>这是子孙组件---{this.context.color}</h3>
//       </div>
//     )
//   }
// }

//模拟redux（新版）
const Context = React.createContext();

const Provider = Context.Provider
const Consumer = Context.Consumer

// withConsumer高阶组件，它根据配置返回一个高阶组件
function withConsumer(Consumer) {
  return Comp => props => {
    return <Consumer>{value => <Comp {...value}/>}</Consumer>
  }
}
const Child = withConsumer(Consumer)(function (props) {
  return <div onClick={()=>props.add()}>{props.counter}</div>
})
// function Child(props) {
//   return <div onClick={()=>props.add()}>{props.counter}</div>
// }
export default class Father extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      counter: 0
    }
  }

  add = () =>{
    this.setState({counter: this.state.counter + 1})
  }

  render() {
    return (
      <Provider value={{counter:this.state.counter, add:this.add }}>
        {/*<Consumer>{value=><Child {...value}></Child>}</Consumer>*/}
        <Child/>
      </Provider>
    )
  }
}