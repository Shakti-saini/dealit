const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'messages';

const Message = sequelize.define('Message', {
  chat_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  sent_by: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  message_text: {
    type: Sequelize.TEXT,
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
Message.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Message;
