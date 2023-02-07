const express = require("express");
const mysql = require("mysql");
const path = require("path");
const static = require("serve-static");
const dbconfig = require("./config/database.js");
const connection = mysql.createConnection(dbconfig); // 순전히 /us를 위한 정의부
const port = 3000;
const crypto = require("crypto");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: dbconfig.host,
  user: dbconfig.user,
  password: dbconfig.password,
  database: dbconfig.database,
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", static(path.join(__dirname, "public")));

// 1. 루트
app.get("/", (req, res) => {
  res.send("Root22");
});

// 2. select test
app.get("/us", (req, res) => {
  connection.query("SELECT * from User", (error, rows) => {
    if (error) throw error;
    console.log("User info is: ", rows);
    res.send(rows);
  });
});

// 3. 회원가입
app.post("/members/new", (req, res) => {
  console.log("/members/new 호출됨 " + req);

  const paramId = req.body.user_id;
  const paramPassword = req.body.user_password;
  const paramPasswordCheck = req.body.user_password_check;

  var salt = Math.round(new Date().valueOf() * Math.random()) + "";
  var hashPassword = crypto
    .createHash("sha512")
    .update(paramPassword + salt)
    .digest("hex");

  pool.getConnection((err, conn) => {
    // 1. sql 연결 문제
    if (err) {
      conn.release();
      console.log("Mysql get connection error");
      res.writeHead("200", { "content-Type": "text/html; charset=utf8" });
      res.write("<h2>DB 서버 연결 실패</h2>");
      res.end();
      return;
    }
    // sql 연결 성공 시
    console.log("데이터베이스 conn");
    const exec = conn.query(
      "insert into USERTEST (USER_ID, USER_PASSWORD, salt) values (?, ?, ?);",
      [paramId, hashPassword, salt],
      (err, result) => {
        conn.release();
        console.log("실행된 SQL: " + exec.sql);

        // 2. id 중복 문제
        if (err) {
          console.log("SQL 실행시 오류 발생; id 중복 문제");
          console.dir(err);
          res.writeHead("200", { "content-Type": "text/html; charset=utf8" });
          res.write("<h2>SQL 실행 실패; id 중복 문제</h2>");
          res.end();
          return;
        }

        if (result) {
          //3. pw 불일치 문제
          if (paramPassword != paramPasswordCheck) {
            //conn.release();
            console.log("Password inconsistency");
            res.writeHead("200", { "content-Type": "text/html; charset=utf8" });
            res.write("<h2>비밀번호 불일치</h2>");
            res.end();
            return;
          }

          console.dir(result);
          console.log("insert 성공");

          res.writeHead("200", { "content-Type": "text/html; charset=utf8" });
          res.write("<h2>사용자 추가 성공</h2>");
          res.end();
        } else {
          console.log("insert 실패");

          res.writeHead("200", { "content-Type": "text/html; charset=utf8" });
          res.write("<h2>사용자 추가 실패</h2>");
          res.end();
        }
      }
    );
  });
});

//로그인
app.post('/members/login',(req,res) => {
  console.log('/members/login 호출됨' + req)
  const paramId = req.body.user_id;
  const paramPassword = req.body.user_password;

  console.log('로그인 요청'+paramId+' '+paramPassword);

  pool.getConnection((err,conn)=> {
      if(err){
          conn.release();
          console.log('Mysql get connection error');
          res.writeHead('200',{'content-Type':'text/html; charset=utf8'})
          res.write('<h2>DB 서버 연결 실패</h2>')
          res.end();
          return;
      }

      const exec = conn.query('select `user_id` from `user` where `user_id`=? and `user_password`=?',
      
          [paramId,paramPassword],
          (err,rows)=>{
              conn.release();
              console.log('실행된 SQL query: '+exec.sql);

              if(err){
                  console.dir(err);
                  res.writeHead('200',{'content-Type':'text/html; charset=utf8'})
                  res.write('<h2>SQL 실행 실패</h2>')
                  res.end();
                  return;
              }

              if(rows.length > 0) {/*user_id와 user_password가 같은게 있다. rows안에 있는 정보는 user_id,user_password다*/
              console.log('아이디 [%s], 패스워드가 일치합니다', paramId)
              res.writeHead('200',{'content-Type':'text/html; charset=utf8'})
              res.write('<h2>로그인 성공</h2>')
              res.end();
              return;
              }
              else{
              console.log('아이디 [%s] , 패스워드가 존재하지 않거나 일치하지 않습니다', paramId)
              res.writeHead('200',{'content-Type':'text/html; charset=utf8'})
              res.write('<h2>아이디와 비밀번호를 확인해주세요.</h2>')
              res.end();
              return; 
              }
          }  
      )
  })
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
