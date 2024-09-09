// eslint-disable-next-line no-unused-vars
const AllModels = require('../services/model.service');
const helperService = require('../services/helper.service');
/** ****************************************************************************
 *                              Banner Controller
 ***************************************************************************** */
const BannerController = () => {
  const create = async (req, res) => {
    // body is part of a form-data
    const { Banner } = AllModels();
    const userInfo = req.token;
    try {
      if (req.file && req.file.filename) {
        req.body.file_name = req.file.filename;
        req.body.file_path = req.file.path.replace('public/', '');
      }
      req.body.user_id = userInfo.id;
      const data = await Banner.create(req.body);

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
      const { type } = req.query;
      const { Banner } = AllModels();
      const data = await Banner.findAll({
        where: {
          type,
        },
        order: [
          ['banner_order', 'ASC'],
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
    const { Banner } = AllModels();
    try {
      const data = await Banner.findOne({
        where: {
          id,
        },
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


  const update = async (req, res) => {
    // params is part of an url
    const { id } = req.params;
    const { Banner } = AllModels();
    // body is part of form-data
    const {
      body,
    } = req;

    try {
      if (req.file && req.file.filename) {
        req.body.file_name = req.file.filename;
        req.body.file_path = req.file.path.replace('public/', '');
      }
      const brand = await Banner.findOne({
        where: {
          id,
        },
      });

      if (!brand) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      const data = await Banner.update(
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
    const { Banner } = AllModels();
    try {
      const data = await Banner.findOne({
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
        msg: 'Successfully destroyed model',
      });
    } catch (err) {
      // better save it to log file
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  const updateOrder = async (req, res) => {
    // params is part of an url
    const { id } = req.params;
    const { Banner } = AllModels();
    const userInfo = req.token;
    // body is part of form-data
    const {
      body,
    } = req;

    try {
      if (userInfo && userInfo.role === 'admin') {
        if (body.order) {
          let updatedBanner;
          const orders = body.order.split(',');
          orders.map(async (id, i) => (
            updatedBanner = await Banner.update(
              {
                banner_order: i,
              },
              {
                where: {
                  id,
                },
              },
            )
          ));

          return res.status(200).json({
            updatedBanner,
          });
        }
      }
      return res.status(403).json({
        msg: 'Action not allowed',
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
    updateOrder,
  };
};

module.exports = BannerController;
