const { DataTypes } = require("sequelize");
const sequelize = require("../app/model/dbconfig");

const notEmpty = {
  msg: "Das Feld darf nicht leer sein.",
};

const Parent = sequelize.define(
  "Parent",
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
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty,
        isEmail: {
          msg: "Das ist keine gültige E-Mail-Adresse.",
        },
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty,
        len: {
          args: [4, 40],
          msg: "Die Telefonnummer darf nur zwischen 4 und 40 Zeichen lang sein.",
        },
      },
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty,
        isNumeric: {
          msg: "Die Postleitzahl darf nur aus Ziffern bestehen.",
        },
        len: {
          args: 5,
          msg: "Die Postleitzahl muss fünfstellig sein.",
        },
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty,
        len: {
          args: [2, 40],
          msg: "Der Wohnort darf nur zwischen 2 und 40 Zeichen lang sein.",
        },
      },
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty,
        len: {
          args: [2, 40],
          msg: "Der Name der Straße darf nur zwischen 2 und 40 Zeichen lang sein.",
        },
      },
    },
    houseNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty,
        isAlphanumeric: {
          msg: "Die Hausnummer darf nur aus Zahlen und Buchstaben bestehen.",
        },
        len: {
          args: [1, 10],
          msg: "Die Hausnummer darf maximal 10 Zeichen lang sein.",
        },
      },
    },
    affiliate: {
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

module.exports = Parent;
