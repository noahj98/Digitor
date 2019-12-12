var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var axios = require('axios');


const mariadb = require('mariadb');
const pool = mariadb.createPool({
  user: 'root',
  password: "password",
  connectionLimit: 5,
  database: "Digitor"
});

exports.pool = pool;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDate(start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = startHour + Math.random() * (endHour - startHour) | 0;
  date.setHours(hour);
  return date;
}

async function makeTables(conn) {
  await conn.query(`DROP TABLE IF EXISTS Messages`);
  await conn.query(`DROP TABLE IF EXISTS Users`);
  await conn.query(`
    CREATE TABLE Users (
      uid INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(63) UNIQUE NOT NULL,
      fname VARCHAR(31) NOT NULL,
      lname VARCHAR(31) NOT NULL,
      password VARCHAR(31) NOT NULL,
      isMentor BOOLEAN NOT NULL,
      year CHAR(1) NOT NULL,
      major VARCHAR(63) NOT NULL
    )
  `);
  await conn.query(`
    CREATE TABLE Messages (
      mentor_uid INT,
      user_uid INT,
      sender_uid INT,
      message TEXT,
      time DATETIME,
      
      FOREIGN KEY(mentor_uid) REFERENCES Users(uid),
      FOREIGN KEY(user_uid) REFERENCES Users(uid),
      FOREIGN KEY(sender_uid) REFERENCES Users(uid)
    )
  `);
};

async function addUsers(conn) {
  const majors = [
    'Mathematics', 'Computer Science', 'Biology', 'Chemistry', 'Economics',
    'Statistics', 'Philosophy', 'Business'
  ]
  let allInfo = await axios({
    method: 'get',
    url: 'https://uinames.com/api/?region=united%20states&ext&amount=45'
  });
  allInfo = allInfo['data'];
  let users = [];

  for (let i = 0; i < allInfo.length; i++) {
    let duplicate = false;
    for (let j = 0; j < i; j++) {
      if (allInfo[i]['email'] == allInfo[j]['email']) {
        duplicate = true;
        break;
      }
    }
    if (duplicate) continue;
    let curr = allInfo[i];
    let person = [];
    person.push(curr['email']);
    person.push(curr['name']);
    person.push(curr['surname']);
    person.push(curr['password']);
    let year = Math.floor(Math.random()*4);
    person.push(year > 1);
    person.push(String(year));
    person.push(majors[Math.floor(Math.random()*majors.length)]);
    users.push(person);
  }
  const user = ["noahj98@live.unc.edu", "Noah", "Jackstoner", "giggity", true, "2", "Computer Science"];
  users.push(user);
  console.log(users[0]);
  console.log(users[users.length-1]);
  for (let i = 0; i < users.length; i++) {
    await conn.query(`
      INSERT INTO Users(email, fname, lname, password, isMentor, year, major)
      VALUES (?,?,?,?,?,?,?)
    `, users[i]);
  }
};

function getWord(words) {
  return words[Math.floor(Math.random() * words.length)];
};

async function getRandomUID(conn, isMentor) {
  return await conn.query(`
    SELECT U.uid
    FROM Users U
    WHERE U.isMentor=?
  `, [isMentor,]);
};

async function addMessages(conn) {
  let words = (await axios({
    method: 'get',
    url: 'https://loripsum.net/api/64/short/plaintext'
  }))['data'];
  words += (await axios({
    method: 'get',
    url: 'https://loripsum.net/api/16/medium/plaintext'
  }))['data'];
  words += (await axios({
    method: 'get',
    url: 'https://loripsum.net/api/8/long/plaintext'
  }))['data'];
  words += (await axios({
    method: 'get',
    url: 'https://loripsum.net/api/4/verylong/plaintext'
  }))['data'];
  words = words.split(`\n`);
  for (let i in words) {
    if (words[i] == '') words.splice(i, 1);
  }
  words.pop();

  let mentor_uids = await getRandomUID(conn, true);
  let user_uids = await getRandomUID(conn, false);
  // console.log(mentor_uids);
  // console.log(user_uids);
  // console.log(words.length, mentor_uids.length, user_uids.length);
  //uid, uid, message, day
  let res;
  for (let i = 0; i < 23456; i++) {
    mentor_uid = mentor_uids[Math.floor(Math.random() * (mentor_uids.length))]['uid'];
    user_uid = user_uids[Math.floor(Math.random() * (user_uids.length))]['uid'];
    let rand_uid = (Math.random() < 0.5 ? mentor_uid : user_uid);
    let day = randomDate(new Date('April 1, 2014 03:24:00'), new Date(), 0, 23);
    day = day.toISOString().slice(0, 19).replace('T', ' '); //found online :) plz work
    let message = getWord(words);
    // console.log(mentor_uid);
    // console.log(user_uid);
    // console.log(day);
    // console.log(message);

    res = conn.query(`
      INSERT INTO Messages(mentor_uid, user_uid, sender_uid, message, time)
      VALUES (?, ?, ?, ?, ?)
    `, [mentor_uid, user_uid, rand_uid, message, day]);
  }
  await res;
};

async function setup() {
  let conn;
  try {
    conn = await pool.getConnection();
    // await makeTables(conn);
    // await addUsers(conn);
    // await addMessages(conn);
    console.log('mariadb finished initializing.');
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release(); //release to pool
  }
};
setup();

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var createUserRoute = require('./routes/create_user');
var validateRoute = require('./routes/check_login');
var getAllChatsRoute = require('./routes/get_chats');
var getChatRoute = require('./routes/get_chat');
var deleteChatRoute = require('./routes/delete_chat_history');
var putMessageRoute = require('./routes/put_msg');
var getNonMessagesRoute = require('./routes/get_no_history_chats');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/createUser', createUserRoute);
app.use('/validateCredentials', validateRoute);
app.use('/getChats', getAllChatsRoute);
app.use('/getChat', getChatRoute);
app.use('/deleteChat', deleteChatRoute);
app.use('/sendMessage', putMessageRoute);
app.use('/getNoHistory', getNonMessagesRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;