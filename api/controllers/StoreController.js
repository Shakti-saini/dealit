const { Op } = require('sequelize');
// eslint-disable-next-line no-unused-vars
const AllModels = require('../services/model.service');
const helperService = require('../services/helper.service');

/** ****************************************************************************
 *                              Abrand Controller
 ***************************************************************************** */
const StoreController = () => {
  const createOrUpdate = async (req, res) => {
    // body is part of a form-data
    const { Store } = AllModels();
    const userInfo = req.token;
    const form = req.body;

    try {
      if (userInfo.id && await helperService.verifyRole(userInfo.role, 'vendor')) {
        const reuireFiled = ['name', 'business_type', 'description', 'main_category_id', 'legal_owner', 'register_year', 'register_state',
          'register_country', 'opertaion_steet', 'operation_city', 'operation_country', 'operation_zip'];

        const checkField = helperService.checkRequiredParameter(reuireFiled, req.body);
        if (checkField.isMissingParam) {
          return res.status(400).json({ msg: checkField.message });
        }

        // upload files..
        if (req.files) {
          const fileKeys = Object.keys(req.files);
          await Promise.all(fileKeys.map(async (fieldName, index) => {
            if (req.files[fieldName] && req.files[fieldName].length > 0) {
              await Promise.all(req.files[fieldName].map((file, index1) => {
                const filePath = file.path.replace('public/', '');
                if (fieldName == 'company_logo') {
                  form.logo_name = file.filename;
                  form.logo_path = filePath;
                } else if (fieldName == 'company_photo') {
                  form.photo_name = file.filename;
                  form.photo_path = filePath;
                } else if (form[fieldName]) {
                  if (form[fieldName].document) {
                    form[fieldName].document.push({ file_name: file.filename, file_path: filePath });
                  } else {
                    form[fieldName].document = [{ file_name: file.filename, file_path: filePath }];
                  }
                }
              }));
            }
          }));
        }

        // find existing store...
        let data = await Store.findOne({
          where: {
            user_id: userInfo.id,
          },
        });

        if (!data) {
          form.user_id = userInfo.id;

          // make store slug..
          let slug = form.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
          const existingStore = await Store.findOne({
            where: {
              slug,
            },
          });
          if (existingStore) {
            const lastStore = await Store.findOne({
              order: [
                ['id', 'DESC'],
              ],
            });
            slug = `${slug}-${lastStore.id + 1}`;
          }
          form.slug = slug;

          // create new store..
          data = await Store.create(form);
        } else {
          // update existing store..
          data = await Store.update(form, {
            where: {
              id: data.id,
            },
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
      return res.status(500).json({
        msg: err,
      });
    }
  };

  const updateById = async (req, res) => {
    // body is part of a form-data
    const { Store } = AllModels();
    const { id } = req.params;
    const userInfo = req.token;
    const form = req.body;

    try {
      if (id && userInfo.id && await helperService.verifyRole(userInfo.role, 'admin')) {
        const reuireFiled = ['name', 'business_type', 'description', 'main_category_id', 'legal_owner', 'register_year', 'register_state',
          'register_country', 'opertaion_steet', 'operation_city', 'operation_country', 'operation_zip'];

        const checkField = helperService.checkRequiredParameter(reuireFiled, req.body);
        if (checkField.isMissingParam) {
          return res.status(400).json({ msg: checkField.message });
        }

        // upload files..
        if (req.files) {
          const fileKeys = Object.keys(req.files);
          await Promise.all(fileKeys.map(async (fieldName, index) => {
            if (req.files[fieldName] && req.files[fieldName].length > 0) {
              await Promise.all(req.files[fieldName].map((file, index1) => {
                const filePath = file.path.replace('public/', '');
                if (fieldName == 'company_logo') {
                  form.logo_name = file.filename;
                  form.logo_path = filePath;
                } else if (fieldName == 'company_photo') {
                  form.photo_name = file.filename;
                  form.photo_path = filePath;
                } else if (form[fieldName]) {
                  if (form[fieldName].document) {
                    form[fieldName].document.push({ file_name: file.filename, file_path: filePath });
                  } else {
                    form[fieldName].document = [{ file_name: file.filename, file_path: filePath }];
                  }
                }
              }));
            }
          }));
        }

        // find existing store...
        let data = await Store.findOne({
          where: {
            id,
          },
        });

        if (!data) {
          return res.status(400).json({
            msg: 'Store not found!',
          });
        }

        data = await Store.update(form, {
          where: {
            id,
          },
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
        msg: err,
      });
    }
  };

  const get = async (req, res) => {
    // params is part of an url
    const { id } = req.params;
    const userInfo = req.token;
    const { Store } = AllModels();
    try {
      if (userInfo.id && await helperService.verifyRole(userInfo.role, 'vendor')) {
        let data = await Store.findOne({
          where: {
            user_id: userInfo.id,
          },
        });

        if (!data) {
          data = [];
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

  const getBySlug = async (type, req, res) => {
    // params is part of an url
    const { slug } = req.params;
    const {
      Store, Category, Product, Brand,
    } = AllModels();
    try {
      let data = await Store.findOne({
        where: {
          slug,
        },
      });

      if (!data) {
        return res.status(400).json({
          msg: 'Store not found!',
        });
      }

      if (type == 'products') {
        data = await Product.findAll({
          where: {
            user_id: data.user_id,
            status: 'Published',
          },
          include: [
            {
              model: Category,
              as: 'mastercategory',
              required: true,
            },
            {
              model: Category,
              as: 'category',
              required: true,
            },
            {
              model: Category,
              as: 'subcategory',
              required: true,
            },
          ],
          order: [
            ['id', 'DESC'],
          ],
        });
      } else if (type == 'categories') {
        data = await Category.findAll({
          where: {
            id: data.main_category_id,
            status: {
              [Op.ne]: 'inactive',
            },
            type: 0,
          },
          include: [
            {
              model: Category,
              where: {
                status: 'active',
              },
              required: false,
              include: [
                {
                  model: Category,
                  where: {
                    status: 'active',
                  },
                  required: false,
                },
              ],
            },
          ],
          order: [
            ['cat_order', 'ASC'],
          ],
        });
      } else if (type == 'brands') {
        data = await Brand.findAll({
          where: {
            user_id: data.user_id,
            status: 'Published',
          },
          order: [
            ['id', 'DESC'],
          ],
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

  const getAll = async (req, res) => {
    try {
      const { Store, User } = AllModels();
      const data = await Store.findAll({
        where: {
          map_location: {
            [Op.not]: null,
          },
        },
        include: [
          {
            model: User,
            required: true,
          },
        ],
        order: [
          ['id', 'DESC'],
        ],

      });
      return res.status(200).json({
        data,
      });
    } catch (err) {
      return res.status(500).json({
        msg: err,
      });
    }
  };

  const updateSettings = async (req, res) => {
    // body is part of a form-data
    const { Store } = AllModels();
    const userInfo = req.token;
    const form = req.body;

    try {
      if (userInfo.id && await helperService.verifyRole(userInfo.role, 'vendor')) {
        const reuireFiled = ['tax_rate', 'shipping_domestic', 'shipping_international'];

        const checkField = helperService.checkRequiredParameter(reuireFiled, req.body);
        if (checkField.isMissingParam) {
          return res.status(400).json({ msg: checkField.message });
        }

        // find existing store...
        let data = await Store.findOne({
          where: {
            user_id: userInfo.id,
          },
        });

        if (!data) {
          return res.status(400).json({
            msg: 'Store not found!',
          });
        }
        // update existing store..
        data = await Store.update(form, {
          where: {
            id: data.id,
          },
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
        msg: err,
      });
    }
  };

  const uploadStoreVideo = async (req, res) => {
    // body is part of a form-data
    const { Store } = AllModels();
    const { id } = req.params;

    try {
      if (id) {
        // find existing store...
        let data = await Store.findOne({
          where: {
            id,
          },
        });

        if (!data) {
          return res.status(400).json({
            msg: 'Store not found!',
          });
        }

        if (req.file && req.file.filename) {
          data = await Store.update({
            video_name: req.file.filename,
            video_path: req.file.path.replace('public/', ''),
          }, {
            where: {
              id,
            },
          });

          return res.status(200).json({
            data,
          });
        }
        return res.status(400).json({
          msg: 'No video file available!',
        });
      }
      return res.status(401).json({
        msg: 'Unauthorized!',
      });
    } catch (err) {
      return res.status(500).json({
        msg: err,
      });
    }
  };

  const destroy = async (req, res) => {
    // body is part of a form-data
    const { Store } = AllModels();
    const { id } = req.params;
    const userInfo = req.token;

    try {
      if (id && userInfo.id && await helperService.verifyRole(userInfo.role, 'admin')) {
        // find existing store...
        const data = await Store.findOne({
          where: {
            id,
          },
        });

        if (!data) {
          return res.status(400).json({
            msg: 'Store not found!',
          });
        }

        await data.destroy();

        return res.status(200).json({
          msg: 'Successfully destroyed model',
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
    createOrUpdate,
    get,
    getAll,
    getBySlug,
    updateById,
    updateSettings,
    uploadStoreVideo,
    destroy,
  };
};

module.exports = StoreController;
