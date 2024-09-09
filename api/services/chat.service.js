const AllModels = require('./model.service');
const helperService = require('./helper.service');
const { Op } = require('sequelize');

const chatService = (io) => {
  const { Resource, Chat, Message } = AllModels();

  io.on('connection', (socket) => {
    let userJoined = false;
    socket.on('new_message', async (body) => {
      if (body.user_id && body.to_user_id && body.message && body.chat_id) {
        // find chat if exist..
        let chat = await Chat.findOne({
          where: {
            id: body.chat_id,
          },
        });
        if (!chat) {
          chat = await Chat.create({
            id: body.chat_id,
            user_id: body.user_id,
            to_user_id: body.to_user_id,
            last_message_text: body.message,
          });
        } else {
          await Chat.update(
            {
              is_last_message_read: 0,
              last_message_text: body.message,
            },
            {
              where: {
                id: chat.id,
              },
            },
          );
        }

        // Add message..
        await Message.create({
          chat_id: chat.id,
          message_text: body.message,
          sent_by: body.user_id,
        });

        // broadcast to other user's resources...
        const resources = await Resource.findAll({
          where: {
            user_id: body.to_user_id,
          },
        });

        if (resources) {
          await Promise.all(resources.map((resource, index) => {
            io.to(resource.resource_id).emit('new_message', {
              user_id: body.user_id,
              chat_id: chat.id,
              message: body.message,
            });
          }));
        }

        // send notifications to user..
        if (body.to_user_id) {
          await helperService.sendNotification(body.to_user_id, 'You have received a new message.', false, true, 'chat', chat.id);
        }
      }
    });
    socket.on('user_added', async (user_id) => {
      if (userJoined) return;
      if (user_id) {
        userJoined = true;
        await Resource.create({
          user_id,
          resource_id: socket.id,
        });
        socket.emit('login');
      }
    });
    socket.on('typing', () => {

    });
    socket.on('typing_stop', () => {

    });
    socket.on('disconnect', async () => {
      if (userJoined) {
        const data = await Resource.findOne({
          where: {
            resource_id: socket.id,
          },
        });
        if (data) {
          await data.destroy();
        }
      }
    });
  });
};

module.exports = chatService;
