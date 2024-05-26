const { DataTypes } = require("sequelize");
const sequelize = require("../app/model/dbconfig");

const notEmpty = {
  msg: "Das Feld darf nicht leer sein.",
};

const Child = sequelize.define(
  "Child",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty,
        len: {
          args: [2, 20],
          msg: "Der Name darf nur zwischen 2 und 20 Zeichen lang sein.",
        },
      },
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty,
        len: {
          args: [2, 20],
          msg: "Der Name darf nur zwischen 2 und 20 Zeichen lang sein.",
        },
      },
    },
    birthDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty,
        isDate: {
          msg: "Das ist kein gültiges Datum.",
        },
        isBefore: {
          args: "2018-01-01",
          msg: "Das Kind ist zu jung.",
        },
        isAfter: {
          args: "2010-01-01",
          msg: "Das Kind ist zu alt.",
        },
      },
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty,
        isIn: {
          args: [["männlich", "weiblich"]],
          msg: "Ungültiges Geschlecht.",
        },
      },
    },
    friend: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0, 60],
          msg: "Die Beschreibung des Freundes darf maximal 60 Zeichen lang sein.",
        },
      },
    },
    additionalInformation: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [0, 200],
          msg: "Der Text darf maximal 200 Zeichen lang sein.",
        },
      },
    },
  },
  {
    sequelize,
    timestamps: true,
    updatedAt: false,
  },
);

module.exports = Child;
