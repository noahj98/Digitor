const pool = require('../app.js').pool;

var express = require('express');
var router = express.Router();

let conn;

/* GET users listing. */
router.put('/', async function(req, res, next) {
  let data = req.body;
  const email = data['email'];
  const password = data['password'];
  try {
    conn = await pool.getConnection();
    let chats;
    const isMentor = (await conn.query(`
      SELECT U.isMentor
      FROM Users U
      WHERE U.email=? AND U.password=?
    `, [email, password]))[0]['isMentor'];
    if (isMentor == 1) {
      chats = await conn.query(`
        SELECT U2.fname, U2.lname, U2.major, U2.year, COUNT(*) as "numMsgs", U2.uid
        FROM Users U1, Users U2, Messages M
        WHERE U1.email=? AND U1.password=?
        AND U1.uid != U2.uid
        AND M.mentor_uid=U1.uid AND M.user_uid=U2.uid
        GROUP BY U2.uid
      `, [email,password]);
    } else {
      chats = await conn.query(`
        SELECT U2.fname, U2.lname, U2.major, U2.year, COUNT(*) as "numMsgs", U2.uid
        FROM Users U1, Users U2, Messages M
        WHERE U1.email=? AND U1.password=?
        AND U1.uid != U2.uid
        AND M.mentor_uid=U2.uid AND M.user_uid=U1.uid
        GROUP BY U2.uid
      `, [email,password]);
    }
    // console.log(chats);
    res.send(chats);
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;