const { Op } = require('sequelize');
const Category = require('../models/Category');

const CategoryController = () => {
  const create = async (req, res) => {
    // body is part of a form-data
    try {
      if (req.file && req.file.filename) {
        req.body.file_name = req.file.filename;
        req.body.file_path = req.file.path.replace('public/', '');
      }
      const categoryExist = await Category.findOne({
        where: {
          name: req.body.name,
          type: (req.body.type ? req.body.type : 0),
        },
      });
      if (categoryExist) {
        return res.status(500).json({ msg: 'Category name already exists' });
      }

      // make product slug..
      let slug = req.body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const existingCategory = await Category.findOne({
        where: {
          slug,
        },
      });
      if (existingCategory) {
        const lastCategory = await Category.findOne({
          order: [
            ['id', 'DESC'],
          ],
        });
        slug = `${slug}-${lastCategory.id + 1}`;
      }
      req.body.slug = slug;

      const category = await Category.create(req.body);

      if (!category) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      return res.status(200).json({
        category,
      });
    } catch (err) {
      return res.status(500).json({ msg: err.errors[0].message });
    }
  };

  const getAll = async (req, res) => {
    try {
      const { type } = req.query;
      const { front } = req.query;
      const userInfo = req.token;

      let query = {
        include: [
          {
            model: Category,
            include: [
              {
                model: Category,
              },
            ],
          },
        ],
      };
      if (front && front === 'yes') {
        if (type) {
          query = {
            where: {
              type,
            },
            include: [
              {
                model: Category,
                where: {
                  status: 'active',
                },
                include: [
                  {
                    model: Category,
                    where: {
                      status: 'active',
                    },
                  },
                ],
              },
            ],

          };
        }
      } else if (type) {
        query = {
          where: {
            type,
          },
          include: [
            {
              model: Category,
              include: [
                {
                  model: Category,
                },
              ],
            },
          ],

        };
      }
      if (front && front === 'yes') {
        // continue
        query.where.status = {
          [Op.ne]: 'inactive',
        };
      }
      query.order = [
        ['cat_order', 'ASC'],
      ];
      const categories = await Category.findAll(query);
      return res.status(200).json({
        categories,
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

    try {
      const cateoryType = await Category.findOne({
        where: {
          id,
        },
      });
      let category;
      if (cateoryType.type !== '0') {
        category = await Category.findOne({
          where: {
            id,
          },
          include: [
            {
              model: Category,
              as: 'parentcategory',
              include: [
                {
                  model: Category,
                  as: 'parentcategory',
                },
              ],
            },
          ],
        });
      } else {
        category = await Category.findOne({
          where: {
            id,
          },
          include: [
            {
              model: Category,
              include: [
                {
                  model: Category,
                },
              ],
            },
          ],
        });
      }
      if (!category) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      return res.status(200).json({
        category,
      });
    } catch (err) {
      console.log(err);
      // better save it to log file
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };


  const update = async (req, res) => {
    // params is part of an url
    const { id } = req.params;
    const userInfo = req.token;
    // body is part of form-data
    const {
      body,
    } = req;

    try {
      if (userInfo && userInfo.role === 'admin') {
        if (req.file && req.file.filename) {
          req.body.file_name = req.file.filename;
          req.body.file_path = req.file.path.replace('public/', '');
        }
        const category = await Category.findOne({
          where: {
            id,
          },
        });

        if (!category) {
          return res.status(400).json({
            msg: 'Bad Request: Model not found',
          });
        }

        const categoryExist = await Category.findOne({
          where: {
            id: {
              [Op.ne]: id,
            },
            name: req.body.name,
            type: (category.type ? category.type : 0),
          },
        });

        if (categoryExist) {
          return res.status(500).json({ msg: 'Category name already exists' });
        }

        const updatedCategory = await Category.update(
          body,
          {
            where: {
              id,
            },
          },
        );

        return res.status(200).json({
          updatedCategory,
        });
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


  const destroy = async (req, res) => {
    // params is part of an url
    const { id } = req.params;

    try {
      const category = Category.findById(id);

      if (!category) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      await category.destroy();

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
    const userInfo = req.token;
    // body is part of form-data
    const {
      body,
    } = req;

    try {
      if (userInfo && userInfo.role === 'admin') {
        if (body.order) {
          let updatedCategory;
          const orders = body.order.split(',');
          orders.map(async (id, i) => (
            updatedCategory = await Category.update(
              {
                cat_order: i,
              },
              {
                where: {
                  id,
                },
              },
            )
          ));

          return res.status(200).json({
            updatedCategory,
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

module.exports = CategoryController;
