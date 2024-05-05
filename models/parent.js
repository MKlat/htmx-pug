const { Model, DataTypes } = require("sequelize");
const sequelize = require("../app/model/dbconfig");

class Parent extends Model {}
Parent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "parent",
    timestamps: false,
  },
);
module.exports = Parent;
