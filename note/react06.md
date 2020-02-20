课堂目标

1.掌握redux异步方案 -redux-saga(和thunk都可以实现异步)

2.掌握数据流方案 -dva（里面用到了-redux-saga）

3.掌握企业级应用框架 -umi

知识要点

1.generator

2.redux-saga

3.umi

4.dva



redux-sage使用

底层使用的es6 的generator

redux-saga使副作用（数据获取、浏览器缓存获取）易于管理、执行、测试和失败处理

安装 yarn add --save redux-saga

原理：redux-saga提供一个中间件，并且可以监听若干action，在后来

使用：用户登录

在class-test下的store下创建saga.js