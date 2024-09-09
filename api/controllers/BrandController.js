const { Op } = require('sequelize');
// eslint-disable-next-line no-unused-vars
const AllModels = require('../services/model.service');
const helperService = require('../services/helper.service');

/** ****************************************************************************
 *                              Abrand Controller
 ***************************************************************************** */
const BrandController = () => {
  const create = async (req, res) => {
    // body is part of a form-data
    const { Brand } = AllModels();
    const userInfo = req.token;
    try {
      const reuireFiled = ['name'];

      const checkField = helperService.checkRequiredParameter(reuireFiled, req.body);
      if (checkField.isMissingParam) {
        return res.status(400).json({ msg: checkField.message });
      }
      if (req.file && req.file.filename) {
        req.body.file_name = req.file.filename;
        req.body.file_path = req.file.path.replace('public/', '');
      }
      req.body.user_id = userInfo.id;

      if (userInfo.role == 'admin') {
        req.body.status = 'Published';
      }

      // make brand slug..
      let slug = req.body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const existingBrand = await Brand.findOne({
        where: {
          slug,
        },
      });
      if (existingBrand) {
        const lastBrand = await Brand.findOne({
          order: [
            ['id', 'DESC'],
          ],
        });
        slug = `${slug}-${lastBrand.id + 1}`;
      }
      req.body.slug = slug;

      const data = await Brand.create(req.body);

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
      const { Brand } = AllModels();
      const { front } = req.query;

      let pwhere = {
        status: {
          [Op.ne]: 'inactive',
        },
      };
      if (front && front === 'yes') {
        pwhere = {
          status: {
            [Op.in]: ['Published'],
          },
        };
      }
      const data = await Brand.findAll({
        where: pwhere,
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
  const getVendorBrands = async (req, res) => {
    try {
      const { Brand } = AllModels();
      const userInfo = req.token;
      const data = await Brand.findAll({
        where: {
          user_id: {
            [Op.in]: [userInfo.id, 1],
          },
        },
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
    const { Brand } = AllModels();
    try {
      const data = await Brand.findOne({
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
    const { Brand } = AllModels();
    // body is part of form-data
    const {
      body,
    } = req;

    try {
      if (req.file && req.file.filename) {
        req.body.file_name = req.file.filename;
        req.body.file_path = req.file.path.replace('public/', '');
      }
      const brand = await Brand.findOne({
        where: {
          id,
        },
      });

      if (!brand) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      const data = await Brand.update(
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
    const { Brand } = AllModels();
    try {
      const data = await Brand.findOne({
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

  return {
    create,
    getAll,
    get,
    update,
    destroy,
    getVendorBrands,
  };
};

module.exports = BrandController;
