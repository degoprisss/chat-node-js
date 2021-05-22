'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    static associate(models) {
    }
  };
  Member.init({
    userId: {
      type: DataTypes.INTEGER,
      field: "user_id",
      primaryKey: true
    },
    roomId: {
      type: DataTypes.INTEGER,
      field: "room_id",
      primaryKey: true
    }
  }, {
    sequelize,
    modelName: 'Member',
    underscored: true
  });
  return Member;
};

