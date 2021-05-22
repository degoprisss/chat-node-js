const bcrypt = require("bcryptjs");

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Room, {
        through: "members",
        foreignKey: {
          name: "userId",
          field: "user_id",
          allowNull: false
        }
      });
    }
    // method to generate hash password
    encryptPassword = password => {
      return bcrypt.hash(password, bcrypt.genSalt(8));
    };

    // method to verify password
    verifyPassword = (password) => {
      return bcrypt.compareSync(password, this.password);
    };
  };
  User.init({
    firstname: { 
      type: DataTypes.STRING,
      validate: {
        isAlpha: true,
        notEmpty: true
      }
    },
    lastname: { 
      type: DataTypes.STRING,
      validate: {
        isAlpha: true,
        notEmpty: true
      }
    },
    screenname: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    avatar: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
    underscored: true
  });

  User.beforeCreate((user, options) => {
    return bcrypt
      .hash(user.password, 8)
      .then(hash => {
        user.password = hash;
      })
      .catch(err => {
        throw new Error();
      });
  });

  return User;
};
