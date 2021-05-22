("use strict");
const bcrypt = require("bcryptjs");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "users",
      [
        {
          firstname: "John",
          lastname: "Doe",
          screenname: "John Doe",
          password: bcrypt.hashSync("root", 8),
          email: "JohnDoe@gmail.com",
        },
        {
          firstname: "Bob",
          lastname: "Doe",
          screenname: "Boby",
          password: bcrypt.hashSync("12345", 8),
          email: "boby@gmail.com",
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("users", null, {});
  },
};
