const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'pages';

const Page = sequelize.define('Page', {
  name: {
    type: Sequelize.STRING,
    unique: false,
  },
  file_name: {
    type: Sequelize.STRING,
  },
  file_path: {
    type: Sequelize.STRING,
  },
  description: {
    type: Sequelize.TEXT,
    unique: false,
  },
  description2: {
    type: Sequelize.TEXT,
    unique: false,
  },
  page_type: {
    type: Sequelize.STRING,
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
Page.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Page;
