import React, { Component } from "react";
import styles from "./login.css";
import router from 'umi/router'
import { Login } from "ant-design-pro";
import { connect } from "dva";
// 解构出用户名密码提交组件
const { UserName, Password, Submit } = Login;

export default connect()(function(props) {
  //let from=props.location.state.from||"/";//重定向地址
  const onSubmit=(err,values)=>{
    console.log(err,values);
    props.dispatch({type:'user/login',payload:values})
  };
  return(
    <div className ={styles.loginForm}>
      {/*logo*/}
    <img className ={styles.logo}
         src="https://img.kaikeba.com/logo-new.png"/>
      {/*登录表单*/}
      <Login onSubmit ={onSubmit}>
        <UserName
        name="username"
        placeholder="xuxin"
        rules={[{required:true,message:"请输入用户名"}]}
      />
        <Password
          name="password"
          placeholder="123"
          rules={[{required:true,message:"请输入密码"}]}
        />
        <Submit>登录</Submit>
      </Login>
    </div>
  );
})
