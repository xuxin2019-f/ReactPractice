// 假设这里是数据库 模拟数据接口
let data=[
  {title:"web全栈"},
  {title:"java架构师"}
]

export default {
  //"methodurl":Object或Array
  // "get/api/goods":{result:data},
  //"methodurl":(req,res)=>{}
  "get /api/goods": function(req,res) {
    setTimeout(()=>{
      res.json({ result:data })
    },1000)
  }
}
