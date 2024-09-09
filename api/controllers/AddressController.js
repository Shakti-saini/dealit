// eslint-disable-next-line no-unused-vars
const AllModels = require('../services/model.service');
const helperService = require('../services/helper.service');
/** ****************************************************************************
 *                              Address Controller
 ***************************************************************************** */
const AddressController = () => {
  const create = async (req, res) => {
    // body is part of a form-data
    const { Address } = AllModels();
    const userInfo = req.token;
    try {
      const reuireFiled = ['address', 'city', 'state', 'country', 'zipcode'];

      const checkField = helperService.checkRequiredParameter(reuireFiled, req.body);
      if (checkField.isMissingParam) {
        return res.status(400).json({ msg: checkField.message });
      }

      req.body.user_id = userInfo.id;
      const data = await Address.create(req.body);

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
        msg: err,
      });
    }
  };

  const getAll = async (req, res) => {
    try {
      const { Address } = AllModels();
      const userInfo = req.token;
      const data = await Address.findAll({
        where: {
          user_id: userInfo.id,
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
    const userInfo = req.token;
    const { Address } = AllModels();
    try {
      const data = await Address.findOne({
        where: {
          id,
          user_id: userInfo.id,
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
    const { Address } = AllModels();
    const userInfo = req.token;
    // body is part of form-data
    const {
      body,
    } = req;

    try {
      const brand = await Address.findOne({
        where: {
          id,
          user_id: userInfo.id,
        },
      });

      if (!brand) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      const data = await Address.update(
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
    const { Address } = AllModels();
    const userInfo = req.token;
    try {
      const data = await Address.findOne({
        where: {
          id,
          user_id: userInfo.id,
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
  };
};

module.exports = AddressController;
