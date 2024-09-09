const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'products';

const Product = sequelize.define('Product', {
  name: {
    type: Sequelize.STRING,
    unique: false,
  },
  description: {
    type: Sequelize.TEXT,
    unique: false,
  },
  group: {
    type: Sequelize.STRING,
    unique: false,
  },
  delivery_time: {
    type: Sequelize.STRING,
    unique: false,
  },
  sku: {
    type: Sequelize.STRING,
    unique: true,
  },
  slug: {
    type: Sequelize.STRING,
    unique: true,
  },
  tag: {
    type: Sequelize.STRING,
    unique: false,
  },
  quantity: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  cost_price: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  variant: {
    type: Sequelize.TEXT,
  },
  mrp: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  offer_price: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  price_groups: {
    type: Sequelize.STRING,
    unique: false,
  },
  tax_rate: {
    type: Sequelize.STRING,
    unique: false,
  },
  unit: {
    type: Sequelize.STRING,
    unique: false,
  },
  file_name: {
    type: Sequelize.STRING,
  },
  video_path: {
    type: Sequelize.STRING,
  },
  video_name: {
    type: Sequelize.STRING,
  },
  file_path: {
    type: Sequelize.STRING,
  },
  images: {
    type: Sequelize.TEXT,
    unique: false,
  },
  documents: {
    type: Sequelize.TEXT,
    unique: false,
  },
  catalogs: {
    type: Sequelize.TEXT,
    unique: false,
  },
  customization: {
    type: Sequelize.JSON,
    unique: false,
  },
  details: {
    type: Sequelize.TEXT,
    unique: false,
  },
  new_arrival: {
    type: Sequelize.TINYINT,
    unique: false,
  },
  top_deal: {
    type: Sequelize.TINYINT,
    unique: false,
  },
  best_seller: {
    type: Sequelize.TINYINT,
    unique: false,
  },
  view_count: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  certifications: {
    type: Sequelize.JSON,
    unique: false,
  },
  lead_time_days: {
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
Product.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Product;
