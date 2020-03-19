/*
 * @Author: yangj
 * @Date: 2020-01-21 09:53:10
 * @LastEditors: yangj
 * api.js
 */
const { pool, router, Result } = require("./connect")

router.get('/query', (req, res) => {
  pool.getConnection((err, conn) => {
    conn.query(`SELECT * FROM websites`, (e, r) => res.json(new Result({data:{list:r}})));
    // conn.release()//此方式断开连接池据说高并发时候会无法断开，导致无法继续执行pool.getConnection;
    pool.releaseConnection(conn)//暂时改为此方式断开;
  })
});
var addSql = `INSERT INTO websites SET ?`;
router.post('/add', (req, res) => {
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
router.delete('/delete', (req, res) => {
  pool.getConnection((err, conn) => {
    conn.query(`DELETE FROM websites where id=${req.body&&req.body.id||0}`, req.body, (e, r) => res.json(r));
    pool.releaseConnection(conn);
  })
});
module.exports = router;