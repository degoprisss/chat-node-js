("use strict");

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "members",
      [
        {
          user_id: 1,
          room_id: 1,
        },
        {
          user_id: 2,
          room_id: 1,
        },
        {
          user_id: 2,
          room_id: 2,
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("members", null, {});
  },
};
