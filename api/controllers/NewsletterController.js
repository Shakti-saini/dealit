// eslint-disable-next-line no-unused-vars
const AllModels = require('../services/model.service');
const helperService = require('../services/helper.service');
const Sequelize = require('sequelize');

/** ****************************************************************************
 *                              Dashboard Controller
 ***************************************************************************** */
const NewsletterController = () => {
  const create = async (req, res) => {
    // body is part of a form-data
    const { Newsletter } = AllModels();

    try {
      const reuireFiled = ['email'];
      const checkField = helperService.checkRequiredParameter(reuireFiled, req.body);
      if (checkField.isMissingParam) {
        return res.status(400).json({ msg: 'Please enter your email' });
      }

      const reuireFiled1 = ['gender'];
      const checkField1 = helperService.checkRequiredParameter(reuireFiled1, req.body);
      if (checkField1.isMissingParam) {
        return res.status(400).json({ msg: 'Please select gender' });
      }

      // Check if user with same email exists..
      if (req.body.email) {
        const eUser = await Newsletter.findOne({
          where: {
            email: req.body.email,
          },
        });
        if (eUser) {
          return res.status(400).json({ msg: 'You have already subscribed!' });
        }
      }

      const data = await Newsletter.create(req.body);

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
      const { Newsletter } = AllModels();
      const data = await Newsletter.findAll({
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
    const { Newsletter } = AllModels();
    try {
      const data = await Newsletter.findOne({
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
    const { Newsletter } = AllModels();
    // body is part of form-data
    const {
      body,
    } = req;

    try {
      const letter = await Newsletter.findOne({
        where: {
          id,
        },
      });

      if (!letter) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      const data = await Newsletter.update(
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
    const { Newsletter } = AllModels();
    try {
      const data = await Newsletter.findOne({
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
        msg: 'Successfully destroyed news letter',
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

module.exports = NewsletterController;
