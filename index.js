/*
 * @Author: yangj
 * @Date: 2020-03-18 14:42:27
 * @LastEditors: yangj
 * index.js
 */

const {app}=require("./connect");
const api=require('./api');
app.use('/api',api);
app.listen(81,()=>{
    console.log('服务启动了');
}); 