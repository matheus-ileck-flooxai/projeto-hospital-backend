const mysql = require('mysql2')


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  
  password: 'Zedao123@',  
  database: 'hospital'  
});



module.exports = connection;
