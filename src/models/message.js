'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.Room, {
        foreignKey: {
          name: "roomId",
          field: "room_id",
        }
      });
  
      Message.belongsTo(models.User, {
        foreignKey: {
          name: "userId",
          field: "user_id",
        },
      });
    }
  };
  Message.init({
    userId: {
      type: DataTypes.INTEGER,
      field: "user_id",
    },
    roomId: {
      type: DataTypes.INTEGER,
      field: "room_id",
    },
    text: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Message',
    underscored: true
  });
  return Message;
};

