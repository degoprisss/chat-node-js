"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.createTable("members", {      
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: 'cascade'
      },
      room_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "rooms",
          key: "id",
        },
        onDelete: 'cascade'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
    //Composite primary key
    return queryInterface.addConstraint('members', {
      fields: ['user_id', 'room_id'],
      type: 'primary key',
      name: 'members_pkey'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("members");
  },
};
