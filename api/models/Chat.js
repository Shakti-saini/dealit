const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'chats';

const Chat = sequelize.define('Chat', {
  user_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  to_user_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  is_last_message_read: {
    type: Sequelize.TINYINT,
    unique: false,
  },
  last_message_text: {
    type: Sequelize.TEXT,
    unique: false,
  },
  chat_type: {
    type: Sequelize.ENUM,
    values: ['private', 'group'],
    defaultValue: 'private',
  },
}, {
  tableName,
});

// eslint-disable-next-line
Chat.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Chat;
