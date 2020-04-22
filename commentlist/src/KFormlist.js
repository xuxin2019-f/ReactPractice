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
