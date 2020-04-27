import React, { Component } from 'react'
// export default class Parent extends Component {
//   constructor(props) {
//     super(props)
//     // this.inputRef = React.createRef()
//     this.inputRef = null
//   }
//   focus = () => {
//     this.inputRef.focus()
//   }
//   render() {
//     return (
//       <div>
//         {/* {回调ref} */}
//         <input ref={(el) => (this.inputRef = el)} type="text" />
//         <button onClick={this.focus}>聚焦</button>
//       </div>
//     )
//   }
// }
const FancyButton = React.forwardRef((props, ref) => {
  return <input type="text" ref={ref} {...props} />
})
// const inputRef = React.createRef()
export default function Parent(props) {
  const inputRef = React.useRef()
  React.useEffect(() => {
    //此时inputRef.current指向input
    console.log(inputRef.current)
  })
  return (
    <div>
      <FancyButton ref={inputRef} />
    </div>
  )
}
