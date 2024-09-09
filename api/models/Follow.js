const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'follows';

const Follow = sequelize.define('Follow', {
  followed_user_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  follower_user_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
}, {
  tableName,
});

// eslint-disable-next-line
Follow.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Follow;
