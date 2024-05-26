const Child = require("./child");
const Parent = require("./parent");

Parent.hasMany(Child);
Child.belongsTo(Parent);

module.exports = { Parent, Child };
