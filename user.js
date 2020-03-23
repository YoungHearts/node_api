/*
 * @Author: yangj
 * @Date: 2020-01-21 09:53:10
 * @LastEditors: yangj
 * api.js
 */
const { pool, router, Result } = require("./connect")

//注册
var addSql = `INSERT INTO user SET ?`;
router.post('/register', (req, res) => {
  pool.getConnection((err, conn) => {
    conn.query(addSql, req.body, (e, r) => {
      if(e){
        return res.json(new Result({code:e.errno,msg:e.sqlMessage}))
      }else{
        return res.json(new Result())
      }
    });
    pool.releaseConnection(conn);
  })
});
//登录
router.post('/login', (req, res) => {
  let {account='',password=''}=req.body||{};
  if(account&&password){
    let select = "select * from user where account = '"+account+"' and password = '"+password+"'";
    // let select = `select * from user where account = ${account} and password = ${password}`;//错误
    pool.getConnection((err, conn) => {
      conn.query(select, (e, r) => {
        if(e){
          return res.json(new Result({code:e.errno,msg:e.sqlMessage}));
        }else{
          return res.json(new Result((r&&r.length>0)?{data:{user_name:r[0].user_name||''}}:{code:403,msg:'账号或密码错误'}));
        }
      });
      pool.releaseConnection(conn);
    })
  }else{
    return res.json(new Result({code:403,msg:'请完善账号和密码'}))
  }
});
//修改密码
router.post('/change_password',(req,res)=>{
    let {account,password}=req.body||{};
    if(account&&password){
      let update_user='update user set ? where account=?';
      pool.getConnection((err,conn)=>{
        conn.query(update_user, [{ password}, account],(e,r)=>{
          if(e){
            return res.json(new Result({code:e.errno,msg:e.sqlMessage}));
          }else{
            return res.json(r.affectedRows>0?new Result({msg:'修改成功'}):new Result({code:0,msg:'没有此账号'}));
          }
        })
      })
    }else{
      return res.json(new Result({code:403,msg:'请完善账号和密码'}))
    }
})

module.exports = router;