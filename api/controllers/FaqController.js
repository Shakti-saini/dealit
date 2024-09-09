const { Op } = require('sequelize');
// eslint-disable-next-line no-unused-vars
const AllModels = require('../services/model.service');
const helperService = require('../services/helper.service');

/** ****************************************************************************
 *  Faq Controller
 ***************************************************************************** */
const FaqController = () => {
  const create = async (req, res) => {
    // body is part of a form-data
    const { Faq } = AllModels();
    const userInfo = req.token;
    try {
      const reuireFiled = ['question', 'answer'];

      const checkField = helperService.checkRequiredParameter(reuireFiled, req.body);
      if (checkField.isMissingParam) {
        return res.status(400).json({ msg: checkField.message });
      }

      req.body.user_id = userInfo.id;
      const data = await Faq.create(req.body);

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
      const { Faq } = AllModels();
      const data = await Faq.findAll({
        where: {
          status: {
            [Op.ne]: 'inactive',
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
    const { Faq } = AllModels();
    try {
      const data = await Faq.findOne({
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
    const { Faq } = AllModels();
    // body is part of form-data
    const {
      body,
    } = req;

    try {
      const faq = await Faq.findOne({
        where: {
          id,
        },
      });

      if (!faq) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      const data = await Faq.update(
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
    const { Faq } = AllModels();
    try {
      const data = Faq.findById(id);

      if (!data) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      await data.destroy();

      return res.status(200).json({
        msg: 'Successfully destroyed faq',
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

module.exports = FaqController;
