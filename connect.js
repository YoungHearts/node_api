/*
 * @Author: yangj
 * @Date: 2020-01-20 14:41:15
 * @LastEditors: yangj
 * connect.js
 */
const mysql = require('mysql');
const express=require('express');
const cors=require('cors');
const bodyParser=require('body-parser');//解析参数
const app=express();
var connection = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'test1',
    connectTimeout: 5000,//连接超时
};
const router=express.Router();
let pool;
repool();
function repool(){//断线重连机制
    pool=mysql.createPool({
      ...connection,
      waitForConnections: true,//当无连接池可用时，等待(true)还是抛错（false)
      connectionLimit: 100,//连接数限制
      queueLimit: 0//最大连接等待数(0为不限制)
    });//创立连接池
    pool.on('error',err=>err.code === 'PROTOCOL_CONNECTION_LOST' && setTimeout(repool,2000));
    app.all('*',(_,__,next)=>pool.getConnection(err=>err && setTimeout(repool,2000) || next()));
  }
 
app.use(cors());//解决跨域
app.use(bodyParser.json());//json请求
app.use(bodyParser.urlencoded({extended:false}));//表单请求
function Result(obj={}){//统一的返回数据
    let {code=1,msg='',data={}}=obj;
    this.code=code;
    this.msg=msg;
    this.data=data;
  }
module.exports= {pool,router,app,Result}