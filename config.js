require('dotenv').config()
let DBUSERNAME =  process.env.DBUSERNAME
let DBPASSWORD =  process.env.DBPASSWORD

module.exports = {
    DBUSERNAME,
    DBPASSWORD
  }
  