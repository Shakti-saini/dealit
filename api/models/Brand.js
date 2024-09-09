const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'brands';

const Brand = sequelize.define('Brand', {
  name: {
    type: Sequelize.STRING,
    unique: false,
  },
  slug: {
    type: Sequelize.STRING,
  },
  category_ids: {
    type: Sequelize.STRING,
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
  status: {
    type: Sequelize.ENUM,
    values: ['Pending', 'Published', 'Rejected', 'active', 'inactive'],
    defaultValue: 'Pending',
  },
}, {
  tableName,
});

// eslint-disable-next-line
Brand.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Brand;
