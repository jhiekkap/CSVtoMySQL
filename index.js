var mysql = require('mysql');
const config = require('./config')

var con = mysql.createConnection({
  host: "remotemysql.com",
  port: "3306",
  user: config.DBUSERNAME,
  password: config.DBPASSWORD,
  database: "kW8zfl2jBR"
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
  var sql = "INSERT INTO JPAA (alueID, vuosi, talotyyppi, koko) VALUES (3,1971, '4H',82)";

  con.query(sql, function (err, result) {
    if (err) throw err;
    console.log("1 record inserted");
  })
  con.query("SELECT * FROM JPAA", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  })
  con.end()
})

