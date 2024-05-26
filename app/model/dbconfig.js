const { Sequelize } = require("sequelize");

const persistent_path = process.env.PERSISTENT_STORAGE_DIR || ".";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: persistent_path + "/database.sqlite",
});

module.exports = sequelize;
