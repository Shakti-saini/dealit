/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
const sequelize = require('sequelize');
const AllModels = require('../services/model.service');
const crypto = require('crypto');
const axios = require('axios');
const { Op } = require('sequelize');
const helperService = require('../services/helper.service');
const PaymentService = require('../services/payment.service');
/** ****************************************************************************
 *                              cart Controller
 ***************************************************************************** */
const OrderController = () => {
  const create = async (req, res) => {
    // body is part of a form-data
    const {
      Cart,
      Tempcart,
      Order,
      Product,
      OrderItem,
      User,
      Paymentlog,
    } = AllModels();
    const userInfo = req.token;
    try {
      const reuireFiled = ['total_amount', 'payment_method', 'address_id'];

      const checkField = helperService.checkRequiredParameter(reuireFiled, req.body);
      if (checkField.isMissingParam) {
        return res.status(400).json({ msg: checkField.message });
      }
      let orderContinue = false;
      let paymentLog = [];
      const user = await User.findOne({
        where: {
          id: userInfo.id,
        },
      });
      const paymentData = {
        totalAmount: req.body.total_amount,
        addressId: req.body.address_id,
        billingAddressId: req.body.billing_address_id,
        user_id: userInfo.id,
        item_amount: req.body.item_amount,
        shipping_amount: req.body.shipping_amount,
        tax_amount: req.body.tax_amount,
        payment_method: req.body.payment_method,
        sale_type: (req.body.sale_type) ? req.body.sale_type : 'cart',
        user,
      };
      if (req.body.payment_method === 'Pesapal') {
        const result = await PaymentService.pesapal(paymentData);
        if (result.success) {
          return res.status(200).json({
            data: result.data,
          });
        }
        return res.status(400).json({
          msg: result.error,
        });
      } else if (req.body.payment_method === 'Mpesa') {
        const result = await PaymentService.mpesa(paymentData);
        if (result.error) {
          return res.status(400).json({
            msg: result.data,
          });
        }
        return res.status(200).json({
          data: result.data,
        });
      } else if (req.body.payment_method === 'Braintree') {
        if (req.body.payment_id) {
          paymentLog = await Paymentlog.findOne({
            where: {
              id: req.body.payment_id,
              user_id: userInfo.id,
              order_id: {
                [Op.is]: null,
              },
            },
          });
          if (!paymentLog) {
            return res.status(400).json({
              msg: 'No Payment Found!',
            });
          }
          // verify payment...
          const eOrder = await Order.findOne({
            where: {
              merchant_reference: paymentLog.transaction_id,
              order_tracking_id: paymentLog.order_tracking_id,
              payment_method: 'Braintree',
            },
          });
          if (eOrder) {
            return res.status(400).json({
              msg: 'Something went wrong, Please try again!',
            });
          }
          orderContinue = true;
          req.body.order_tracking_id = paymentLog.order_tracking_id;
          req.body.merchant_reference = paymentLog.transaction_id;
        } else {
          return res.status(400).json({
            msg: 'Something went wrong, Please try again!',
          });
        }
      } else if (req.body.payment_method === 'iPay') {
        if (req.body.ipay_data && req.body.ipay_data.length > 0) {
          const ipay_data = req.body.ipay_data.split('~~');
          if (ipay_data.length == 2) {
            req.body.order_tracking_id = ipay_data[0];
            req.body.merchant_reference = ipay_data[1];
            // verify payment...
            const eOrder = await Order.findOne({
              where: {
                order_tracking_id: req.body.order_tracking_id,
                payment_method: 'iPay',
              },
            });
            if (eOrder) {
              return res.status(400).json({
                msg: 'Something went wrong, Please try again!',
              });
            }
            orderContinue = true;
          } else {
            return res.status(400).json({
              msg: 'iPay Payment Failed!',
            });
          }
        } else {
          const result = await PaymentService.iPayQuery(paymentData);
          if (result.error) {
            return res.status(400).json({
              msg: result.data,
            });
          }
          return res.status(200).json({
            data: result.data,
          });
        }
      } else if (req.body.payment_method === 'Cash on delivery') {
        orderContinue = true;
      }
      if (orderContinue) {
        let cartData;
        if (req.body.sale_type && req.body.sale_type === 'buynow') {
          cartData = await Tempcart.findAll({
            where: {
              user_id: userInfo.id,
              status: 'active',
            },
            include: [
              {
                model: Product,
                attribute: ['vendor_id'],
              },
            ],
          });
        } else {
          cartData = await helperService.getUserCart(userInfo.id);
        }

        if (cartData.length) {
          req.body.user_id = userInfo.id;
          const saleType = req.body.sale_type;
          if (req.body.sale_type) {
            delete (req.body.sale_type);
          }

          const orderCreated = await Order.create(req.body);
          const orderItemdata = cartData.map((row) => ({
            price: row.price,
            tax_amount: row.tax_amount,
            tax_percent: row.tax_percent,
            shipping_amount: row.shipping_amount,
            total_amount: row.total_amount,
            variant: row.variant,
            product_title: row.product_title,
            quantity: row.quantity,
            product_sku: row.product_sku,
            vendor_id: row.Product.user_id,
            product_id: row.Product.id,
            order_id: orderCreated.id,
          }));

          if (orderCreated) {
            // uddate order in payment logs..
            if (paymentLog.id) {
              await Paymentlog.update(
                {
                  order_id: orderCreated.id,
                },
                {
                  where: {
                    id: paymentLog.id,
                  },
                },
              );
            }
            await OrderItem.bulkCreate(orderItemdata);
            if (saleType && saleType === 'buynow') {
              await Tempcart.destroy({
                where: {
                  user_id: userInfo.id,
                },
              });
            } else {
              await Cart.destroy({
                where: {
                  user_id: userInfo.id,
                },
              });
            }

            // send sms to user...
            await helperService.sendNotification(userInfo.id, 'Your order has been successfully placed.', true, true, 'order', orderCreated.id);

            return res.status(200).json({
              orderCreated,
            });
          }
          return res.status(500).json({
            msg: 'order not created',
          });
        }
      } else {
        return res.status(400).json({
          msg: 'Method not allowed',
        });
      }
    } catch (err) {
      return res.status(500).json({
        msg: err,
      });
    }
  };
  const orderWithMpesa = async (req, res) => {
    // body is part of a form-data

    const {
      Cart,
      Tempcart,
      Order,
      Product,
      OrderItem,
      Paymentlog,
    } = AllModels();
    const logData = {};
    logData.logbody = JSON.stringify(req.body);
    logData.logquery = JSON.stringify(req.query);
    await Paymentlog.create(logData);
    try {
      const {
        user_id, address_id, billing_address_id,
        amount, item_amount, shipping_amount, tax_amount, sale_type,
      } = req.query;
      const { stkCallback } = req.body.Body;
      const io = req.app.get('socketio');
      io.emit('paymentstatus', { data: stkCallback, user_id });

      if (user_id && address_id && stkCallback.ResultCode === 0) {
        let cartData;
        if (sale_type && sale_type === 'buynow') {
          cartData = await Tempcart.findAll({
            where: {
              user_id,
              status: 'active',
            },
            include: [
              {
                model: Product,
                attribute: ['vendor_id'],
              },
            ],
          });
        } else {
          cartData = await helperService.getUserCart(user_id);
        }
        if (cartData.length) {
          req.body.user_id = user_id;
          req.body.address_id = address_id;
          req.body.billing_address_id = billing_address_id;
          req.body.total_amount = amount;
          req.body.item_amount = item_amount;
          req.body.shipping_amount = shipping_amount;
          req.body.tax_amount = tax_amount;
          req.body.payment_method = 'Mpesa';
          req.body.order_tracking_id = stkCallback.CheckoutRequestID;
          req.body.merchant_reference = stkCallback.MerchantRequestID;
          const orderCreated = await Order.create(req.body);
          const orderItemdata = cartData.map((row) => ({
            price: row.price,
            tax_amount: row.tax_amount,
            tax_percent: row.tax_percent,
            shipping_amount: row.shipping_amount,
            total_amount: row.total_amount,
            variant: row.variant,
            product_title: row.product_title,
            quantity: row.quantity,
            product_sku: row.product_sku,
            vendor_id: row.Product.user_id,
            product_id: row.Product.id,
            order_id: orderCreated.id,
          }));
          if (orderCreated) {
            try {
              await OrderItem.bulkCreate(orderItemdata);
              if (sale_type && sale_type === 'buynow') {
                await Tempcart.destroy({
                  where: {
                    user_id,
                  },
                });
              } else {
                await Cart.destroy({
                  where: {
                    user_id,
                  },
                });
              }
            } catch (err) {
              console.log(err);
            }
          }
        }
        return res.status(200).json({
          msg: 'sucess',
        });
      }
      return res.status(400).json({
        msg: 'not allowed',
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  const getAll = async (req, res) => {
    try {
      const {
        Order, OrderItem, Product, Address,
      } = AllModels();
      const userInfo = req.token;
      let query = {
        order: [
          ['id', 'DESC'],
        ],
      };
      if (await helperService.verifyRole(userInfo.role, 'vendor')) {
        query = {
          include: [
            {
              model: OrderItem,
              where: {
                vendor_id: userInfo.id,
              },
              required: true,
            },
          ],
          order: [
            ['id', 'DESC'],
          ],
        };
      } else if (await helperService.verifyRole(userInfo.role, 'user')) {
        query = {
          where: {
            user_id: userInfo.id,
          },
          include: [
            {
              model: OrderItem,
              required: false,
              include: [
                {
                  model: Product,
                },
              ],
            },
            {
              model: Address,
            },
          ],
          order: [
            ['id', 'DESC'],
          ],
        };
      }
      const data = await Order.findAll(query);
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
    try {
      const { id } = req.params;
      const {
        Order, OrderItem, Product, Address, User,
      } = AllModels();
      const userInfo = req.token;
      let query = {
        where: {
          id,
        },
        include: [
          {
            model: OrderItem,
            required: true,
            include: [
              {
                model: Product,
              },
              {
                model: User,
              },
            ],
          },
          {
            model: Address,
          },
          {
            model: Address,
            as: 'BillingAddress',
          },
          {
            model: User,
          },
        ],
      };
      if (await helperService.verifyRole(userInfo.role, 'vendor')) {
        query = {
          where: {
            id,
          },
          include: [
            {
              model: OrderItem,
              where: {
                vendor_id: userInfo.id,
              },
              required: true,
              include: [
                {
                  model: Product,
                },
              ],
            },
            {
              model: Address,
            },
            {
              model: User,
            },
          ],
        };
      } else if (await helperService.verifyRole(userInfo.role, 'user')) {
        query = {
          were: {
            user_id: userInfo.id,
            id,
          },
          include: [
            {
              model: OrderItem,
              required: false,
              include: [
                {
                  model: Product,
                },
              ],
            },
            {
              model: Address,
            },
            {
              model: User,
            },
          ],
        };
      }
      const data = await Order.findOne(query);
      return res.status(200).json({
        data,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  const pesaPalIpn = async (req, res) => {
    try {
      const {
        Cart,
        Tempcart,
        Order,
        Product,
        OrderItem,
      } = AllModels();
      const {
        user_id, address_id, billing_address_id, OrderTrackingId, OrderMerchantReference,
        amount, item_amount, shipping_amount, tax_amount, sale_type,
      } = req.query;
      if (user_id && address_id && OrderTrackingId && OrderMerchantReference && amount) {
        const result = await PaymentService.pesapalTransactionSatus(OrderTrackingId);
        console.log(result.data);
        let cartData;
        if (sale_type && sale_type === 'buynow') {
          cartData = await Tempcart.findAll({
            where: {
              user_id,
              status: 'active',
            },
            include: [
              {
                model: Product,
                attribute: ['vendor_id'],
              },
            ],
          });
        } else {
          cartData = await helperService.getUserCart(user_id);
        }
        if (cartData.length) {
          req.body.user_id = user_id;
          req.body.address_id = address_id;
          req.body.billing_address_id = billing_address_id;
          req.body.total_amount = amount;
          req.body.item_amount = item_amount;
          req.body.shipping_amount = shipping_amount;
          req.body.tax_amount = tax_amount;
          req.body.payment_method = 'Pesapal';
          req.body.order_tracking_id = OrderTrackingId;
          req.body.merchant_reference = OrderMerchantReference;
          const orderCreated = await Order.create(req.body);
          const orderItemdata = cartData.map((row) => ({
            price: row.price,
            tax_amount: row.tax_amount,
            tax_percent: row.tax_percent,
            shipping_amount: row.shipping_amount,
            total_amount: row.total_amount,
            variant: row.variant,
            product_title: row.product_title,
            quantity: row.quantity,
            product_sku: row.product_sku,
            vendor_id: row.Product.user_id,
            product_id: row.Product.id,
            order_id: orderCreated.id,
          }));
          if (orderCreated) {
            try {
              await OrderItem.bulkCreate(orderItemdata);
              if (sale_type && sale_type === 'buynow') {
                await Tempcart.destroy({
                  where: {
                    user_id,
                  },
                });
              } else {
                await Cart.destroy({
                  where: {
                    user_id,
                  },
                });
              }
            } catch (err) {
              console.log(err);
            }
          }
        }
        return res.status(200).json({
          msg: 'sucess',
        });
      }
      return res.status(400).json({
        msg: 'not allowed',
      });
    } catch (err) {
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  const mpesaQuery = async (req, res) => {
    const reuireFiled = ['CheckoutRequestID'];

    const checkField = helperService.checkRequiredParameter(reuireFiled, req.body);
    if (checkField.isMissingParam) {
      return res.status(400).json({ msg: checkField.message });
    }
    const result = await PaymentService.mpesaQuery(req.body.CheckoutRequestID);
    if (result.error) {
      return res.status(400).json({
        msg: result.data,
      });
    }
    return res.status(200).json({
      data: result.data,
    });
  };

  const cancelOrder = async (req, res) => {
    // body is part of a form-data
    const {
      Cart,
      Tempcart,
      Order,
      Product,
      OrderItem,
      User,
    } = AllModels();

    const { id } = req.params;

    const userInfo = req.token;

    const datee = new Date();

    const reuireFiled = ['items', 'reason'];

    const checkField = helperService.checkRequiredParameter(reuireFiled, req.body);
    if (checkField.isMissingParam) {
      return res.status(400).json({ msg: checkField.message });
    }

    let pwhere = {
      id,
    };
    if (await helperService.verifyRole(userInfo.role, 'user')) {
      pwhere = {
        id,
        user_id: userInfo.id,
      };
    }
    const order = await Order.findOne({
      where: pwhere,
      include: [
        {
          model: OrderItem,
          required: true,
        },
      ],
    });

    if (!order) {
      return res.status(400).json({ msg: 'Order data not found!' });
    }

    if (order.status == 'cancelled') {
      return res.status(400).json({ msg: 'Order already cancelled!' });
    }

    // check ids.to cancel..
    if (req.body.items && req.body.items.length > 0) {
      let totalReturn = 0;
      await Promise.all(req.body.items.map(async (element, index) => {
        const item = await OrderItem.findOne({
          where: {
            id: element,
            order_id: id,
          },
        });

        if (item && item.status != 'inactive') {
          // update item status..
          await OrderItem.update(
            {
              status: 'inactive',
              cancel_by: userInfo.id,
              cancel_reason: req.body.reason,
            },
            {
              where: {
                id: element,
                order_id: id,
              },
            },
          );

          totalReturn += (item.price * item.quantity);
        }
      }));

      if (totalReturn > 0) {
        let oUpdate = {
          cancel_amount: order.cancel_amount + totalReturn,
        };

        // check if all items cancelled..
        const allitems = await OrderItem.findOne({
          where: {
            order_id: id,
            status: 'active',
          },
        });

        if (!allitems) {
          // check if shipping amount..
          totalReturn = (order.shipping_amount > 0 ? (order.shipping_amount + totalReturn) : totalReturn);

          oUpdate = {
            cancel_amount: order.total_amount,
            status: 'cancelled',
          };
        }

        // Refund the payment to user if exists..
        if (order.payment_method == 'Braintree' && order.merchant_reference) {
          await PaymentService.braintreeRefund(order, totalReturn);
        }

        const cancelLogs = (order.cancel_logs ? JSON.parse(order.cancel_logs) : []);
        cancelLogs.push({ amount: totalReturn, date: `${datee.getFullYear()}-${(`0${datee.getMonth() + 1}`).slice(-2)}-${(`0${datee.getDate()}`).slice(-2)}` });
        oUpdate.cancel_logs = JSON.stringify(cancelLogs);

        // update item status..
        await Order.update(
          oUpdate,
          {
            where: {
              id,
            },
          },
        );

        // send sms to user...
        if (order.user_id) {
          await helperService.sendNotification(order.user_id, 'Your order has been cancelled.', true, true, 'order', order.id);
        }

        return res.status(200).json({
          data: order,
        });
      }
      return res.status(400).json({ msg: 'Item(s) already cancelled!' });
    }
    return res.status(400).json({ msg: 'Something went wrong, Please try again!!' });
  };

  const update = async (req, res) => {
    // params is part of an url
    const { id } = req.params;
    const { Order, OrderItem } = AllModels();
    // body is part of form-data
    const {
      body,
    } = req;

    try {
      if (body.status) {
        const order = await Order.findOne({
          where: {
            id,
          },
          include: [
            {
              model: OrderItem,
              required: true,
            },
          ],
        });

        if (!order) {
          return res.status(400).json({ msg: 'Order data not found!' });
        }

        const data = await Order.update(
          {
            status: body.status,
          },
          {
            where: {
              id,
            },
          },
        );

        return res.status(200).json({
          data,
        });
      }

      return res.status(400).json({ msg: 'Invalid data, Please try again!' });
    } catch (err) {
      // better save it to log file
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  return {
    orderWithMpesa,
    create,
    getAll,
    get,
    pesaPalIpn,
    mpesaQuery,
    cancelOrder,
    update,
  };
};

module.exports = OrderController;
