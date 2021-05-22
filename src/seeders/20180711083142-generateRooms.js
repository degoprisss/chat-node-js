("use strict");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "rooms",
      [
        {
          name: "Team react",
          screenname: "colegas js",
          owner: 1,
        },
        {
          name: "Team node",
          screenname: "colegas",
          owner: 2,
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("rooms", null, {});
  },
};
