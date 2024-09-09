// eslint-disable-next-line no-unused-vars
const AllModels = require('../services/model.service');
const paymentService = require('../services/payment.service');
const helperService = require('../services/helper.service');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

/** ****************************************************************************
 *                              Dashboard Controller
 ***************************************************************************** */
const PaymentController = () => {
  const createToken = async (req, res) => {
    // body is part of a form-data
    const userInfo = req.token;

    try {
      if (userInfo.id) {
        const gateway = await paymentService.braintreeInit();

        await gateway.clientToken.generate().then((response) => {
          // pass clientToken to your front-end
          if (response.clientToken) {
            return res.status(200).json({
              token: response.clientToken,
            });
          }
          return res.status(400).json({
            msg: 'Something went wrong. Please try again!',
          });
        });
      } else {
        return res.status(401).json({
          msg: 'Unauthorized!',
        });
      }
    } catch (err) {
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  const createtCheckout = async (req, res) => {
    // body is part of a form-data
    const userInfo = req.token;
    const form = req.body;
    const { Paymentlog } = AllModels();

    try {
      if (userInfo.id) {
        const random = await helperService.randString(5);
        const orderId = `U${userInfo.id}-${random}`;

        const gateway = await paymentService.braintreeInit();

        await gateway.transaction.sale({
          orderId,
          amount: form.amount,
          paymentMethodNonce: form.nonce,
          options: {
            submitForSettlement: true,
          },
        }).then(async (result) => {
          if (result.success && result.success == true && result.transaction) {
            // payment log..
            const payment = await Paymentlog.create({
              user_id: userInfo.id,
              payment_method: 'Braintree',
              transaction_id: result.transaction.id,
              order_tracking_id: orderId,
              status: result.transaction.status,
              logbody: JSON.stringify(result),
            });

            return res.status(200).json({
              status: true,
              payment_id: payment.id,
            });
          }
          return res.status(401).json({
            msg: 'Payment Failed!',
          });
        });
      } else {
        return res.status(401).json({
          msg: 'Unauthorized!',
        });
      }
    } catch (err) {
      return res.status(500).json({
        msg: err,
      });
    }
  };

  return {
    createToken,
    createtCheckout,
  };
};

module.exports = PaymentController;
