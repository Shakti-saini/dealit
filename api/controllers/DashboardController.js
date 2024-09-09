// eslint-disable-next-line no-unused-vars
const { Op } = require('sequelize');
const AllModels = require('../services/model.service');
const helperService = require('../services/helper.service');
const Sequelize = require('sequelize');

/** ****************************************************************************
 *                              Dashboard Controller
 ***************************************************************************** */
const DashboardController = () => {
  const get = async (req, res) => {
    // params is part of an url
    const userInfo = req.token;
    const {
      Order, OrderItem, User, Product, Customer,
    } = AllModels();
    try {
      if (userInfo.role != 'user') {
        let orders = 0;
        let customers = 0;
        let revenue = 0;
        let top_products = [];
        let top_vendors = [];
        let recent_orders = [];
        let stock_report = [];

        const graph = {
          revenue: {},
          delivered: 0,
          inprocess: 0,
          cancelled: 0,
        };


        let query = {
          order: [
            ['id', 'DESC'],
          ],
        };

        let query2 = {
          where: {
            status: {
              [Op.ne]: 'inactive',
            },
          },
          order: [
            ['view_count', 'DESC'],
          ],
          limit: 10,
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

          query2 = {
            where: {
              user_id: userInfo.id,
              status: {
                [Op.ne]: 'inactive',
              },
            },
            order: [
              ['view_count', 'DESC'],
            ],
            limit: 10,
          };
        }


        const ordersAll = await Order.findAll(query);

        if (ordersAll.length > 0) {
          recent_orders = ordersAll.slice(0, 10);

          orders = ordersAll.length;

          ordersAll.map(async (order, i) => {
            // check status//
            if (order.status == 'inprocess') {
              graph.inprocess += 1;
            }
            if (order.status == 'delivered') {
              graph.delivered += 1;
            }
            if (order.status == 'cancelled') {
              graph.cancelled += 1;
            }

            let rv = 0;
            if (await helperService.verifyRole(userInfo.role, 'admin')) {
              rv += order.total_amount;
            } else if (order.OrderItem) {
              if (order.OrderItem.length > 0) {
                order.OrderItem.map((item, j) => {
                  rv += (item.price * item.quantity);
                });
              }
            }
            revenue = parseFloat(revenue) + parseFloat(rv);

            const date = new Date(order.createdAt);

            const year = date.getFullYear();
            const month = date.getMonth() + 1;

            if (graph.revenue[`${month}/${year}`]) {
              graph.revenue[`${month}/${year}`] = graph.revenue[`${month}/${year}`] + rv;
            } else {
              graph.revenue[`${month}/${year}`] = rv;
            }
          });
          revenue = revenue.toFixed();
        }

        top_products = await Product.findAll(query2);

        query2.order = [['quantity', 'DESC']];
        stock_report = await Product.findAll(query2);

        if (await helperService.verifyRole(userInfo.role, 'admin')) {
          customers = await User.count({
            where: {
              role: {
                [Op.in]: ['user', 'both'],
              },
              status: 'active',
            },
            order: [
              ['id', 'DESC'],
            ],
          });

          // /get top vendor ids..
          const orderItemssVendor = await OrderItem.findAll({
            group: ['vendor_id'],
            attributes: ['vendor_id', [Sequelize.fn('COUNT', 'vendor_id'), 'count']],
            order: [
              [Sequelize.literal('count'), 'DESC'],
            ],
            raw: true, // <-- HERE
          });

          if (orderItemssVendor.length > 0) {
            const vendor_ids = [];
            orderItemssVendor.map((v, i) => {
              if (v.vendor_id != null) {
                vendor_ids.push(v.vendor_id);
              }
            });

            top_vendors = await User.findAll({
              where: {
                role: {
                  [Op.in]: ['vendor', 'both'],
                },
                status: 'active',
                id: {
                  [Op.in]: vendor_ids,
                },
              },
              order: [
                ['id', 'DESC'],
              ],
              limit: 10,
            });
          }
        }

        return res.status(200).json({
          orders,
          customers,
          revenue,
          graph,
          recent_orders,
          top_vendors,
          top_products,
          stock_report,
        });
      }
      return res.status(500).json({
        msg: 'Unauthorized!',
      });
    } catch (err) {
      // better save it to log file
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  return {
    get,
  };
};

module.exports = DashboardController;
