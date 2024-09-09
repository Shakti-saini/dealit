const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'banners';

const Banner = sequelize.define('Banner', {
  title: {
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
  from_date: {
    type: Sequelize.TEXT,
    unique: false,
  },
  to_date: {
    type: Sequelize.TEXT,
    unique: false,
  },
  url: {
    type: Sequelize.TEXT,
    unique: false,
  },
  banner_order: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  type: {
    type: Sequelize.DECIMAL,
    allowNull: false,
    defaultValue: '1',
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
Banner.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Banner;
