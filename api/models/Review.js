const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'reviews';

const Review = sequelize.define('Review', {
  rating: {
    type: Sequelize.STRING,
    unique: false,
  },
  review: {
    type: Sequelize.TEXT,
  },
  name: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.TEXT,
    unique: false,
  },
  status: {
    type: Sequelize.ENUM,
    values: ['pending', 'approved', 'rejected'],
    defaultValue: 'pending',
  },
}, {
  tableName,
});

// eslint-disable-next-line
Review.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Review;
