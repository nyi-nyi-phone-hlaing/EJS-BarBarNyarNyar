const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

// ? Creating Post Model ( Schema )
const Post = sequelize.define("post", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
  description: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
  image_url: {
    type: Sequelize.TEXT("long"),
    allowNull: false,
  },
});

module.exports = Post;
