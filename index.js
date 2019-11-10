var mysql = require('mysql')
const config = require('./config')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())

const options = {
  host: 'remotemysql.com',
  port: '3306',
  user: config.DBUSERNAME,
  password: config.DBPASSWORD,
  database: 'kW8zfl2jBR',
}

//const con = mysql.createConnection(options);

//const values = [7, 1921, '2H', 23]
//const table = 'JPAA'
//const fields = ['alueID', 'vuosi', 'talotyyppi', 'koko'].join(',')

/* const insert = (table, fields, values) => {
  let valueCommas = ''
  for (let i = 1; i <= values.length; i++) {
    valueCommas = valueCommas.concat('?')
    if (i !== values.length) {
      valueCommas = valueCommas.concat(',')
    } 
  }
  con.connect(function(err) {
    if (err) throw err
    console.log('Connected!')
    try {
      var sql = `INSERT INTO ${table} (${fields}) VALUES (${valueCommas})`
      con.query(sql, values)
      console.log('inserted!')
    } catch (error) {
      console.log(error)
    }
    con.end()
  })
} */

app.get('/all/:table', async (req, res) => {
  console.log(req.params)
  const { table } = req.params
  console.log(`SELECT * FROM  ${table} at`, new Date())
  try {
    const con = await mysql.createConnection(options)
    /*  const result = await con.query(`SELECT * FROM ${table}`, null)
     console.log(result) */

    con.query(`SELECT * FROM ${table}`, function(err, result, fields) {
      //if (err) throw err
      if (table === 'Projects') {
        res.json(result)
        console.log('JSONI', result)
      } else {
        const columns = fields.map(field => field.name)
        const rows = []
        //console.log(result)
        result.forEach(row => {
          let values = []
          for (let [key, value] of Object.entries(row)) {
            // console.log(`${key}: ${value}`);
            values.push(value)
          }
          rows.push(values)
        })
        console.log('ROWS', rows)
        console.log(result.length, 'ROWS', columns.length, 'COLUMNS:')
        res.json({ columns, rows })
      }
    })
    if (con) con.end()
  } catch (error) {
    res.send(error)
    console.log('error: ', error)
  }
})

app.get('/all', async (req, res) => {
  console.log(`SHOW TABLES`, new Date())
  try {
    const con = await mysql.createConnection(options)
    con.query(`SHOW TABLES`, function(err, result, fields) {
      if (result) {
        const allTables = result.map(table => table.Tables_in_kW8zfl2jBR)
        console.log('TABLES IN THIS DATABASE:', allTables)
        res.json(allTables)
      }
    })
    if (con) con.end()
  } catch (error) {
    res.send(error)
    console.log(error)
  }
})

app.post('/create', async (req, res) => {
  const { tableName, columns, table } = req.body
  //console.log('CREATE TABLE', newTableName, columns, table)
  const sql = `CREATE TABLE ${tableName} (ID int NOT NULL AUTO_INCREMENT, ${columns
    .map(col => `${col.name} ${col.type}`)
    .join(',')}, PRIMARY KEY (ID))`
  console.log(sql)
  //console.log(table)
  try {
    const con = await mysql.createConnection(options)
    con.query(sql, function(err, result, fields) {
      //if (err) throw err
      console.log('TABLE CREATED', result)
    })
    table.forEach(row => {
      const sql = `INSERT INTO ${tableName} (${columns
        .map(col => col.name)
        .join(',')}) VALUES (${columns.map(col => '?').join(',')})`
      //console.log(sql)
      con.query(sql, row.map(cell => (isNaN(cell) ? cell : parseInt(cell))))
    })

    if (con) con.end()
    res.send('new table succesfully saved to database')
  } catch (error) {
    res.send(error)
    console.log(error)
  }
})

app.post('/insert', async (req, res) => {
  const { tableName, columns, row } = req.body
  try {
    const con = await mysql.createConnection(options)
    const sql = `INSERT INTO ${tableName} (${columns
      .map(col => col.name)
      .join(',')}) VALUES (${columns.map(col => '?').join(',')})`
    //console.log(sql)
    con.query(sql, row.map(cell => (isNaN(cell) ? cell : parseInt(cell))))
    if (con) con.end()
    res.send('new row succesfully added to database')
  } catch (error) {
    res.send(error)
    console.log(error)
  }
})

app.put('/projects', async (req, res) => {
  const updatedJSON = req.body

  try {
    const con = await mysql.createConnection(options)
    const sql = `UPDATE Projects SET Jsoni = (?) WHERE ID=1`
    console.log('UPDATE SQL', sql)
    con
      .query(sql, JSON.stringify(updatedJSON), (error, result, fields) => {
        //res.send('Projects JSON succesfully updated', result)
        console.log('UPDATE SQL', sql, result)
        if(error)console.error(error)
      }) 
    if (con) con.end()
  } catch (error) {
    res.send(error)
    console.log(error)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log('Server running in port: ' + PORT))
