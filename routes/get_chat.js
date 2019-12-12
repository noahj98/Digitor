var express = require('express');
var router = express.Router();
const pool = require('../app.js').pool;
let conn;

router.put('/', async function(req, res, next) {
  let data = req.body;
  const uid1 = data['uid1'];
  const uid2 = data['uid2'];
  // console.log(data);

  try {
    conn = await pool.getConnection();
    let result = (await conn.query(`
      SELECT M.sender_uid, M.message, M.time
      FROM Messages M
      WHERE (M.mentor_uid=? AND M.user_uid=?)
      OR (M.mentor_uid=? AND M.user_uid=?)
      ORDER BY M.time
    `, [uid1, uid2, uid2, uid1]));
    // console.log(result);
    res.send({
      'data':result
    });
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;