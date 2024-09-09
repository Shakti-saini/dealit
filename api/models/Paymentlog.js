const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'payment_log';

const PaymentLog = sequelize.define('PaymentLog', {
  user_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  order_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  payment_method: {
    type: Sequelize.STRING,
    unique: false,
  },
  transaction_id: {
    type: Sequelize.STRING,
    unique: false,
  },
  order_tracking_id: {
    type: Sequelize.STRING,
    unique: false,
  },
  type: {
    type: Sequelize.ENUM,
    values: ['charge', 'refund'],
    defaultValue: 'charge',
  },
  status: {
    type: Sequelize.STRING,
    unique: false,
  },
  logbody: {
    type: Sequelize.TEXT,
    unique: false,
  },
  logquery: {
    type: Sequelize.TEXT,
    unique: false,
  },
}, {
  tableName,
});

// eslint-disable-next-line
PaymentLog.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = PaymentLog;
