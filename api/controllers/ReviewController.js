// eslint-disable-next-line no-unused-vars
const AllModels = require('../services/model.service');
const helperService = require('../services/helper.service');
const { Op } = require('sequelize');
/** ****************************************************************************
 *                            product  Review  Controller
 ***************************************************************************** */
const ReviewController = () => {
  const create = async (req, res) => {
    // body is part of a form-data
    const { Review } = AllModels();

    try {
      const reuireFiled = ['rating', 'review', 'name', 'email'];

      const checkField = helperService.checkRequiredParameter(reuireFiled, req.body);
      if (checkField.isMissingParam) {
        return res.status(400).json({ msg: checkField.message });
      }

      const data = await Review.create(req.body);

      if (!data) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
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
      const { status } = req.query;
      const { Review, Product } = AllModels();
      const userInfo = req.token;

      if (userInfo.role != 'user') {
        let include = [
          {
            model: Product,
            required: true,
            where: {
              status: {
                [Op.ne]: 'inactive',
              },
            },
          },
        ];

        if (await helperService.verifyRole(userInfo.role, 'vendor')) {
          include = [
            {
              model: Product,
              required: true,
              where: {
                user_id: userInfo.id,
                status: {
                  [Op.ne]: 'inactive',
                },
              },
            },
          ];
        }

        const data = await Review.findAll({
          where: {
            status: {
              [Op.in]: (status && status != 'all') ? [status] : ['pending', 'approved', 'rejected'],
            },
          },
          include,
          order: [
            ['id', 'DESC'],
          ],
        });
        return res.status(200).json({
          data,
        });
      }
      return res.status(401).json({
        msg: 'Unauthorized!',
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
    const { Review, Product } = AllModels();
    const userInfo = req.token;

    try {
      if (userInfo.role != 'user') {
        let include = [
          {
            model: Product,
            required: true,
            where: {
              status: {
                [Op.ne]: 'inactive',
              },
            },
          },
        ];

        if (await helperService.verifyRole(userInfo.role, 'vendor')) {
          include = [
            {
              model: Product,
              required: true,
              where: {
                user_id: userInfo.id,
                status: {
                  [Op.ne]: 'inactive',
                },
              },
            },
          ];
        }

        const data = await Review.findOne({
          where: {
            id,
          },
          include,
        });

        if (!data) {
          return res.status(400).json({
            msg: 'Bad Request: Model not found',
          });
        }

        return res.status(200).json({
          data,
        });
      }
      return res.status(401).json({
        msg: 'Unauthorized!',
      });
    } catch (err) {
      // better save it to log file
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  const update = async (req, res) => {
    // params is part of an url
    const { id } = req.params;
    const { Review } = AllModels();
    const userInfo = req.token;
    // body is part of form-data
    const {
      body,
    } = req;

    try {
      if (await helperService.verifyRole(userInfo.role, 'admin')) {
        const review = await Review.findOne({
          where: {
            id,
          },
        });

        if (!review) {
          return res.status(400).json({
            msg: 'Bad Request: Model not found',
          });
        }

        const data = await Review.update(
          body,
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
      return res.status(401).json({
        msg: 'Unauthorized!',
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
    const { Review } = AllModels();
    const userInfo = req.token;
    try {
      if (await helperService.verifyRole(userInfo.role, 'admin')) {
        const data = await Review.findOne({
          where: {
            id,
          },
        });

        if (!data) {
          return res.status(400).json({
            msg: 'Bad Request: Model not found',
          });
        }

        await data.destroy();

        return res.status(200).json({
          msg: 'Successfully destroyed review',
        });
      }
      return res.status(401).json({
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
    create,
    getAll,
    get,
    update,
    destroy,
  };
};

module.exports = ReviewController;
