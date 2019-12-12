var express = require('express');
var router = express.Router();
const pool = require('../app.js').pool;
let conn;

/* GET users listing. */
router.post('/', async function (req, res, next) {
    let data = req.body;
    let uid = await addUser(data);
    if (uid === undefined) {
        res.send({
            'uid': String(-1),
            'message': 'Error: user already exists'
        });
        return;
    }
    res.send({
        'message': "success",
        'uid': String(uid),
    });
});

let addUser = async function (data) {
    let uid;
    try {
        conn = await pool.getConnection();
        uid = await conn.query(`
            SELECT *
            FROM Users U
            WHERE U.email=?
        `,[data['email']]);
        console.log(uid);
        if (uid.length == 0) {
            await conn.query(`
                INSERT INTO Users(email, password, fname, lname, year, isMentor, major)
                VALUES (?,?,?,?,?,?,"cs")
            `,[data['email'],data['password'],data['fname'],data['lname'],data['year'],data['isMentor']]);
            uid = await conn.query(`
                SELECT U.uid
                FROM Users U
                WHERE U.email=?
            `, [data['email']]);
        } else uid=undefined;
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.release();
        return uid;
    }
};

module.exports = router;