var express = require('express');
var router = express.Router();
const pool = require('../app.js').pool;
let conn;

/* GET users listing. */
router.put('/', async function (req, res, next) {
    let data = req.body;
    // console.log(data);
    let uid1 = data['uid1'];
    let uid2 = data['uid2'];
    try {
        conn = await pool.getConnection();
        uid = await conn.query(`
            DELETE FROM Messages
            WHERE (mentor_uid=? AND user_uid=?)
            OR (mentor_uid=? AND user_uid=?)
        `, [uid1, uid2, uid2, uid1]);
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
    }

    res.send({
    });
});

module.exports = router;