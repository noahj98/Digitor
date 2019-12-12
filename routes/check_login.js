var express = require('express');
var router = express.Router();
const pool = require('../app.js').pool;
let conn;

/* GET users listing. */
router.put('/', async function (req, res, next) {
  let data = req.body;
  console.log("checking login");
  let uid = await getUser(data.email, data.password);
  
  if (uid === undefined) {
    res.send({
      "uid": "-1",
      "message": "Incorrect email/password combination"
    })
  } else {
    res.send({
      "uid" : String(uid),
      "isMentor" : await getIsMentor(data.email)
    });
  }
});

let getIsMentor = async function (email) {
  let isMentor = false;
  try {
    conn = await pool.getConnection();
    isMentor = await conn.query(`
      SELECT U.isMentor
      FROM Users U
      WHERE U.email=?
    `,[email,])
  } catch (err) {
    console.log('error!!!');
  } finally {
    if (conn) conn.release();
    return isMentor[0]['isMentor'];
  }
}

let getUser = async function (email, password) {
  let uid=undefined;
  try {
    conn = await pool.getConnection();
    uid = await conn.query(`
      SELECT U.uid
      FROM Users U
      WHERE U.email=? AND U.password=?
    `, [email,password]);
  } catch (err) {
    console.log('error!!!');
  } finally {
    if (conn) conn.release();
    if (uid === undefined || uid[0] === undefined) return undefined;
    return uid[0]['uid'];
  }
};

module.exports = router;