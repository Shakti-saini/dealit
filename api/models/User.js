const Sequelize = require('sequelize');
const bcryptService = require('../services/bcrypt.service');

const sequelize = require('../../config/database');

const hooks = {
  beforeCreate(user) {
    user.password = bcryptService().password(user); // eslint-disable-line no-param-reassign
  },
  beforeUpdate(user) {
    if (user.password) {
      user.password = bcryptService().password(user); // eslint-disable-line no-param-reassign
    }
  },
};

const tableName = 'users';

const User = sequelize.define(
  'User',
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    phone: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    middle_name: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    website_link: {
      type: Sequelize.STRING,
    },
    state: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    zipcode: {
      type: Sequelize.STRING,
    },
    country: {
      type: Sequelize.STRING,
    },
    otp: {
      type: Sequelize.STRING,
    },
    social_type: {
      type: Sequelize.ENUM,
      values: ['facebook', 'google'],
    },
    social_id: {
      type: Sequelize.STRING,
      unique: false,
    },
    role: {
      type: Sequelize.ENUM,
      values: ['admin', 'vendor', 'user', 'both'],
    },
    referral_name: {
      type: Sequelize.STRING,
    },
    company_name: {
      type: Sequelize.STRING,
    },
    file_name: {
      type: Sequelize.STRING,
    },
    file_path: {
      type: Sequelize.STRING,
    },
    reset_password_token: {
      type: Sequelize.STRING,
    },
    token_expire_time: {
      type: Sequelize.BIGINT,
    },
    customer_id: {
      type: Sequelize.STRING,
    },
    login_first_time: { // use this flag to redirect on change password for invite agency user
      type: Sequelize.ENUM,
      values: ['0', '1'],
      defaultValue: '0',
    },
    status: {
      type: Sequelize.ENUM,
      values: ['active', 'deleted', 'inactive', 'approved', 'reject', 'pending'],
      defaultValue: 'pending',
    },
  },
  { hooks, tableName },
);

// eslint-disable-next-line
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());

  delete values.password;

  return values;
};


module.exports = User;
