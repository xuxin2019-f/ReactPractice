import { connect } from 'react-redux'
import React, { Component } from 'react'
import { asyncLogin } from './store'

class Reduxtest extends Component {
  render() {
    return (
      <div>
        <p>{this.props.name}</p>
        <p>{this.props.age}</p>

        <button onClick={this.props.asyncLogin({ name: 'xx', age: '21' })}>
          修改
        </button>
      </div>
    )
  }
}
const ReduxTest = connect((state) => state.user, { asyncLogin })(Reduxtest)
export default ReduxTest
