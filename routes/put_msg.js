var express = require('express');
var router = express.Router();
const pool = require('../app.js').pool;
let conn;

/* GET users listing. */
router.put('/', async function (req, res, next) {
  let data = req.body;
  let sender_uid = data['sender_uid'];
  let user_uid = data['user_uid'];
  let mentor_uid = data['mentor_uid'];
  let message = data['message'];
  console.log(data);
  console.log(sender_uid, user_uid, mentor_uid, message);

  try {
    conn = await pool.getConnection();
    uid = await conn.query(`
      INSERT INTO Messages (mentor_uid, user_uid, sender_uid, message, time)
      VALUES (?, ?, ?, ?, ?)
    `, [mentor_uid, user_uid, sender_uid, message, (new Date()).toISOString().slice(0, 19).replace('T', ' ')]);
  } catch (err) {
    console.log('error!!!');
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;