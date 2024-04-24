const Sequelize = require("sequelize");
const dotenv = require("dotenv").config();

const sequelize = new Sequelize("blog", "root", process.env.MYSQL_PASS, {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
