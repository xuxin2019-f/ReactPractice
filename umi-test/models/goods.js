import axios from 'axios'

// api
function getGoods() {
  //axios返回了一个promise
  console.log(axios.get('/api/goods'))
  return axios.get('/api/goods')
}
export default {
    namespace: 'goods', //model的命名空间，区分多个model
    state:[],//初始状态
    effects:{// 副作用
        *getLists(action,{call,put}) {
         // call调用
         const res = yield call(getGoods)
          // put派发reducer
          yield put({type:'init',payload:res.data.result})
        }
    },//异步操作
    reducers:{
        init(state,action) {
          return action.payload
        },
        addGood(state,action) {
            return [...state,{title:action.payload}]
        }
    }    //更新状态
}
