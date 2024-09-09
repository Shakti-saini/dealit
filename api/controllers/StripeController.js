// eslint-disable-next-line no-unused-vars
const AllModels = require('../services/model.service');
const helperService = require('../services/helper.service');
const stripeServices = require('../services/stripe.services');

const Stripe = require('stripe');

const stripe = Stripe('sk_test_51PpUfuRt1hlGrWiSk0SZbdb30jC9wUIw5UijoDPWfMlybM7wVHjXzQ0qr74Ad5uJFfBzu93AVf2ur8OyloUGGsXP00Vyw5YZTy'); // Replace with your Stripe secret key
const PaymentController = () => {
  const createtCheckout = async (req, res) => {
    try {
      const {
        amount, payment_method_types, customer, payment_method, newcardtoken, userId, confirm,
      } = req.body;
      // let orderRes = await stripeServices().createOrder(productId, userId, amount, addressId);
      const userInfo = req.token;
      const payload = {
        amount,
        payment_method_types,
        customer,
        payment_method,
        userId,
        confirm,
      };
      const attachment = await stripeServices().attachSourceToCustomer(customer, newcardtoken);
      if (attachment) {
        const random = await helperService.randString(5);
        const response = await stripeServices().createPaymentIntent(payload, random, userInfo);
        if (response) {
          // resModel.success = true;
          // resModel.message = "Your payment has been processed successfully!";
          // resModel.data = null
          return res.status(200).json({ msg: 'Your payment has been processed successfully!', data: response });
        }
        // resModel.success = false;
        // resModel.message = 'Error occurred while creating Payment';
        // resModel.data = null;
        return res.status(400).json({ msg: 'Error occurred while creating Payment', data: response });
      }
      // resModel.message = 'Error attaching card to customer';
      return res.status(400).json(false);
    } catch (error) {
      console.error('Error in userCreatePayment:', error);

      if (error.type && error.type === 'StripeInvalidRequestError') {
        // resModel.message =error.message;
      } else {
        // resModel.message = 'Internal Server Error';
      }

      return res.status(500).json('Internal Server Error');
    }
  };


  const refundPayment = async (req, res) => {
    try {
      const { amount, paymentIntentId } = req.body;
      const userInfo = req.token;
      const response = await stripeServices().refundservices(paymentIntentId, amount);
      if (response) {
        return res.status(200).json({ msg: 'Your payment Refund processed successfully!', data: response });
      }
      return res.status(400).json({ msg: 'Error occurred while Refund Payment' });
    } catch (error) {
      return res.status(500).json('Internal Server Error');
    }
  };


  return {
    createtCheckout,
    refundPayment,
  };
};

module.exports = PaymentController;
