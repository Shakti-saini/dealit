// eslint-disable-next-line no-unused-vars
const AllModels = require('../services/model.service');
const helperService = require('../services/helper.service');
/** ****************************************************************************
 *                              Page Controller
 ***************************************************************************** */
const PageController = () => {
  const create = async (req, res) => {
    // body is part of a form-data
    const { Page } = AllModels();
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
      const data = await Page.create(req.body);

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
      // eslint-disable-next-line camelcase
      const { page_type } = req.query;
      const { Page } = AllModels();
      let query = {
        order: [
          ['id', 'DESC'],
        ],
      };
      // eslint-disable-next-line camelcase
      if (page_type) {
        query = {
          where: {
            page_type,
          },
          order: [
            ['id', 'DESC'],
          ],
        };
      }
      const data = await Page.findAll(query);
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
    const { Page } = AllModels();
    try {
      const data = await Page.findOne({
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
    const { Page } = AllModels();
    // body is part of form-data
    try {
      if (req.file && req.file.filename) {
        req.body.file_name = req.file.filename;
        req.body.file_path = req.file.path.replace('public/', '');
      }
      const page = await Page.findOne({
        where: {
          id,
        },
      });

      if (!page) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      const data = await Page.update(
        req.body,
        { where: { id } },
      );

      return res.status(200).json({
        data,
      });
    } catch (err) {
      // better save it to log file
      return res.status(500).json({
        msg: 'Internal server error',
        err,
      });
    }
  };


  const destroy = async (req, res) => {
    // params is part of an url
    const { id } = req.params;
    const { Page } = AllModels();
    try {
      const data = Page.findOne({
        where: {
          id,
        },
      });

      if (!data) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      await Page.destroy();

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

module.exports = PageController;
