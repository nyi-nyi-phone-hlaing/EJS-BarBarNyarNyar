const mysql = require("mysql2");
const dotenv = require("dotenv").config();

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "blog",
  password: process.env.MYSQL_PASS,
});

module.exports = pool.promise();
