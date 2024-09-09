const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'user_otp';

const UserOtp = sequelize.define('UserOtp', {
  otp: {
    type: Sequelize.STRING,
    unique: false,
  },
  phone: {
    type: Sequelize.STRING,
    unique: false,
  },
  user_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  type: {
    type: Sequelize.ENUM,
    values: ['register', 'forgot'],
    defaultValue: 'register',
  },
}, {
  tableName,
});

// eslint-disable-next-line
UserOtp.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = UserOtp;
