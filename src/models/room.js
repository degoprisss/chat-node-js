'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Room extends Model {
    static associate(models) {
      Room.belongsToMany(models.User, {
        through: "members",
        foreignKey: {
          name: "roomId",
          field: "room_id",
        }
      });
      Room.belongsTo(models.User, {
        foreignKey: "owner"
      });
      Room.hasMany(models.Message, {
        foreignKey: "room_id"
      });
    }
  };
  Room.init({
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    screenname: DataTypes.STRING,
    owner: DataTypes.INTEGER,
    private: DataTypes.BOOLEAN,
    avatar: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Room',
    underscored: true
  });
  return Room;
};

