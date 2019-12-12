var express = require('express');
var router = express.Router();
const pool = require('../app.js').pool;
let conn;

router.put('/', async function(req, res, next) {
  let data = req.body;
  let uid = data['uid'];
  let isMentor = data['isMentor'];
  console.log(uid, isMentor);
  try {
    conn = await pool.getConnection();
    let allChats = (await conn.query(`
        SELECT DISTINCT U.uid, U.fname, U.lname, U.email, U.year, U.major
        FROM Users U, Messages M
        WHERE U.uid != ?
        AND U.isMentor=true
    `,[uid]));
    let chats = await conn.query(`
        SELECT DISTINCT U2.uid
        FROM Users U1, Users U2, Messages M
        WHERE U1.uid=? AND U2.uid!=?
        AND (U1.uid=M.user_uid OR U1.uid=M.mentor_uid)
        AND (U2.uid=M.user_uid OR U2.uid=M.mentor_uid)
    `, [uid, uid])
    console.log(allChats.length);
    console.log(chats.length);
    for (let i = allChats.length-1; i >= 0; i--) {
        for (let j = 0; j < chats.length; j++) {
            if (allChats[i]['uid']==chats[j]['uid']) {
                allChats.splice(i, 1);
                break;
            }
        }
    }
    res.send({
        'data' : allChats
    });
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release();
  }
});

module.exports = router;