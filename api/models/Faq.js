const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'faqs';

const Faq = sequelize.define('Faq', {
  question: {
    type: Sequelize.TEXT,
    unique: false,
  },
  answer: {
    type: Sequelize.TEXT,
    unique: false,
  },
  user_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  status: {
    type: Sequelize.ENUM,
    values: ['active', 'inactive'],
    defaultValue: 'active',
  },
}, {
  tableName,
});

// eslint-disable-next-line
Faq.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Faq;
