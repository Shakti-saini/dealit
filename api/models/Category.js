const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'categories';

const Category = sequelize.define('Category', {
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
  cat_order: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  slug: {
    type: Sequelize.STRING,
  },
  type: {
    type: Sequelize.DECIMAL,
    allowNull: false,
    defaultValue: '0',
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
Category.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Category;
