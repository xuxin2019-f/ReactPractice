import { connect } from 'dva'
import styles from './goods.css';
import {useEffect} from 'react'

export default connect(
   state => ({
     goodsList: state.goods,//获取指定命名空间的模型状态
     loading:state.loading}),
  {
    addGood:title => ({
      type:'goods/addGood',
      payload:title
    }),
    getLists: ()=>({
      type:'goods/getLists'
    })
  }
)(function({goodsList,addGood,getLists,loading}) {
  useEffect(()=>{
    // 实现第一次初始化
    getLists()
  },[])

  console.log(loading)
  if (loading.models.goods) {
    return <div>加载中</div>
  }
  return (
    <div className={styles.normal}>
        <ul>
          {goodsList.map(good => (<li key={good.title}>{good.title}</li>))}
        </ul>
      <button onClick={() => addGood('商品'+new Date().getTime())}>新增</button>
    </div>
  );
})
