// eslint-disable-next-line no-unused-vars
const AllModels = require('../services/model.service');
const helperService = require('../services/helper.service');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

/** ****************************************************************************
 *                              Dashboard Controller
 ***************************************************************************** */
const ChatController = () => {
  const findUserChat = async function (user_id, to_user_id) {
    const { Chat, Message } = AllModels();

    let data = await Chat.findOne({
      where: {
        user_id,
        to_user_id,
      },
      include: [
        {
          model: Message,
        },
      ],
      order: [[Message, 'id', 'desc']],
    });

    if (!data) {
      data = await Chat.findOne({
        where: {
          to_user_id: user_id,
          user_id: to_user_id,
        },
        include: [
          {
            model: Message,
          },
        ],
        order: [[Message, 'id', 'desc']],
      });
    }

    return data;
  };

  const create = async (req, res) => {
    // body is part of a form-data
    const { Chat, Message, Product } = AllModels();
    const userInfo = req.token;

    try {
      const reuireFiled = ['message'];
      const checkField = helperService.checkRequiredParameter(reuireFiled, req.body);
      if (checkField.isMissingParam) {
        return res.status(400).json({ msg: 'Please enter your message' });
      }

      const reuireFiled1 = ['to_user_id'];
      const checkField1 = helperService.checkRequiredParameter(reuireFiled1, req.body);
      if (checkField1.isMissingParam) {
        return res.status(400).json({ msg: 'Please select the user to contact' });
      }

      let messageBody = req.body.message;
      // check if contact vendor request...
      if (req.body.product_id) {
        const product = await Product.findOne({ where: { id: req.body.product_id } });
        if (product) {
          messageBody = 'You have new contact request on a product, details given below:\n\r';
          messageBody += `Product: ${product.name}\n`;
          messageBody += `Product Link: http://vendor.dealit.uk/#/view-product/${product.id}\n`;
          if (req.body.product_qty) {
            messageBody += `Quantity: ${req.body.product_qty} ${req.body.product_unit ? req.body.product_unit : 'Piece/Pieces'}\n`;
          }
          messageBody += `Message: ${req.body.message}`;
        }
      }

      // Check if user with same email exists..
      let data = await findUserChat(userInfo.id, req.body.to_user_id);
      if (!data) {
        data = await Chat.create({
          user_id: userInfo.id,
          to_user_id: req.body.to_user_id,
          last_message_text: messageBody,
        });
      } else {
        await Chat.update(
          {
            is_last_message_read: 0,
            last_message_text: messageBody,
          },
          {
            where: {
              id: data.id,
            },
          },
        );
      }

      if (!data) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      // Add message..
      await Message.create({
        chat_id: data.id,
        message_text: messageBody,
        sent_by: userInfo.id,
      });

      // send notifications to user..
      if (req.body.to_user_id) {
        await helperService.sendNotification(req.body.to_user_id, 'You have received a new message.', false, true, 'chat', data.id);
      }

      return res.status(200).json({
        data,
      });
    } catch (err) {
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  const getAll = async (req, res) => {
    try {
      const { Chat, User } = AllModels();
      const userInfo = req.token;

      const data = await Chat.findAll({
        where: {
          [Op.or]: [
            { user_id: userInfo.id },
            { to_user_id: userInfo.id },
          ],
        },
        include: [
          {
            model: User,
            as: 'Sender',
          },
          {
            model: User,
            as: 'Receiver',
          },
        ],
        order: [
          ['id', 'DESC'],
        ],

      });
      return res.status(200).json({
        data,
      });
    } catch (err) {
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  const get = async (req, res) => {
    // params is part of an url
    const { id } = req.params;
    const { Chat, Message, User } = AllModels();
    const userInfo = req.token;

    try {
      const data = await Chat.findOne({
        where: {
          id,
          [Op.or]: [
            { user_id: userInfo.id },
            { to_user_id: userInfo.id },
          ],
        },
        include: [
          {
            model: User,
            as: 'Sender',
          },
          {
            model: User,
            as: 'Receiver',
          },
          {
            model: Message,
          },
        ],
        order: [[Message, 'id', 'desc']],
      });

      if (!data) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      return res.status(200).json({
        data,
      });
    } catch (err) {
      // better save it to log file
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };


  const getVendorChat = async (req, res) => {
    try {
      const { id } = req.params;
      const { Chat, Message } = AllModels();
      const userInfo = req.token;

      const data = await findUserChat(userInfo.id, id);

      return res.status(200).json({
        data,
      });
    } catch (err) {
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  const update = async (req, res) => {
    // params is part of an url
    const { id } = req.params;
    const { action } = req.body;
    const { Chat, Message } = AllModels();
    const userInfo = req.token;

    try {
      const data = await Chat.findOne({
        where: {
          id,
        },
      });

      if (!data) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      let update = 0;
      if (action == 'read' && (userInfo.id == data.user_id || userInfo.id == data.to_user_id)) {
        // update chat..
        update = await Chat.update(
          {
            is_last_message_read: 1,
          },
          {
            where: {
              id,
            },
          },
        );
        // update message..
        update = await Message.update(
          {
            is_read: 1,
          },
          {
            where: {
              chat_id: id,
            },
          },
        );
      }

      return res.status(200).json({
        update,
      });
    } catch (err) {
      // better save it to log file
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  const destroy = async (req, res) => {
    // params is part of an url
    const { id } = req.params;
    const { Chat } = AllModels();
    try {
      return res.status(404).json({
        msg: 'Not found',
      });
    } catch (err) {
      // better save it to log file
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  return {
    create,
    getAll,
    get,
    update,
    destroy,
    getVendorChat,
  };
};

module.exports = ChatController;
