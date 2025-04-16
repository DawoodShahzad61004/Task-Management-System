require('dotenv').config();
const sql = require('mssql');

console.log("Loaded from ENV:", process.env.DB_USER, process.env.DB_SERVER);


// Database configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  // port: 1433, 
  options: {
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
};

console.log("DB Config:", dbConfig);

const poolPromise = new sql.ConnectionPool(dbConfig)
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL');
    return pool;
  })
  .catch(err => console.log('Database Connection Failed!', err));


module.exports = { sql, poolPromise };
