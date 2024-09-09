const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'user_notifications';

const UserNotification = sequelize.define('UserNotification', {
  body: {
    type: Sequelize.TEXT,
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
    values: ['order', 'product', 'user'],
  },
  entity_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  is_read: {
    type: Sequelize.TINYINT,
    unique: false,
  },
}, {
  tableName,
});

// eslint-disable-next-line
UserNotification.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = UserNotification;
