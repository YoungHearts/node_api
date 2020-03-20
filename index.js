/*
 * @Author: yangj
 * @Date: 2020-03-18 14:42:27
 * @LastEditors: yangj
 * index.js
 */

const {app}=require("./connect");
const api=require('./api');
const user=require('./user');
app.all('*',(req,res,next)=>{
    //这里处理全局拦截,一定要写在最上面，不然会被别的接口匹配到而没有执行next导致捕捉不到
    next();
  })
app.use('/api',api);
app.use('/user',user);
app.listen(81,()=>{
    console.log('服务启动了');
}); 