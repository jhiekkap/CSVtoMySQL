var mysql = require('mysql');
const config = require('./config')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())

const options = {
  host: "remotemysql.com",
  port: "3306",
  user: config.DBUSERNAME,
  password: config.DBPASSWORD,
  database: "kW8zfl2jBR"
}

//const con = mysql.createConnection(options);

const values = [7, 1921, '2H', 23]
//const table = 'JPAA' 
const fields = ["alueID", "vuosi", "talotyyppi", "koko"].join(",")



const insert = (table, fields, values) => {
  let valueCommas = ""
  for (let i = 1; i <= values.length; i++) {
    valueCommas = valueCommas.concat("?")
    if (i !== values.length) {
      valueCommas = valueCommas.concat(",")
    }
  }
  con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    try {
      var sql = `INSERT INTO ${table} (${fields}) VALUES (${valueCommas})`
      con.query(sql, values)
      console.log('inserted!')
    } catch (error) {
      console.log(error)
    }
    con.end()
  })
}

app.get('/all/:table', async (req, res) => {
  console.log(req.params)
  const { table } = req.params
  console.log(`SELECT * FROM  ${table} at`, new Date())
  try {
    const con = await mysql.createConnection(options);
    /*  const result = await con.query(`SELECT * FROM ${table}`, null)
     console.log(result) */


    con.query(`SELECT * FROM ${table}`, function (err, result, fields) {
      if (err) throw err;
      console.log('RESULT', result.length, 'ROWS', fields.map(field => field.name));
      res.json({ result, fields })
    })
    if (con) con.end()

  } catch (error) {
    console.log('error: ', error)
  }
})

app.get('/all', async (req, res) => {
  console.log(`SHOW TABLES`, new Date())
  try {
    const con = await mysql.createConnection(options);
    con.query(`SHOW TABLES`, function (err, result, fields) {
      if (err) throw err;
      const allTables = result.map(table => table.Tables_in_kW8zfl2jBR)
      console.log('TABLES IN THIS DATABASE:' , allTables ); 
      res.json(allTables)
    })
    if (con) con.end()
  } catch (error) {
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log('Server running in port: ' + PORT))




