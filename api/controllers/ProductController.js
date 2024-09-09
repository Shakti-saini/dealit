// eslint-disable-next-line no-unused-vars
const { Op } = require('sequelize');
const sequelize = require('sequelize');
const AllModels = require('../services/model.service');
const helperService = require('../services/helper.service');
const Variation = require('../models/Variation');
/** ****************************************************************************
 *                              Product  Controller
 ***************************************************************************** */
const ProductController = () => {
  const create = async (req, res) => {
    // body is part of a form-data
    const {
      Product, Variation, ShippingRate, User,
    } = AllModels();
    const userInfo = req.token;
    try {
      const reuireFiled = ['name', 'sku', 'cost_price', 'mrp'];

      const checkField = helperService.checkRequiredParameter(reuireFiled, req.body);
      if (checkField.isMissingParam) {
        return res.status(400).json({ msg: checkField.message });
      }

      // check for same sku..
      const existing = await helperService.checkDuplicateSku(req.body.sku);
      if (existing.error) {
        return res.status(400).json({
          msg: existing.msg,
        });
      }

      if (req.files) {
        const thumbimageData = [];
        const thumbimageData1 = [];
        const thumbimageData2 = [];
        const fileKeys = Object.keys(req.files);
        await Promise.all(fileKeys.map(async (fieldName, index) => {
          if (req.files[fieldName] && req.files[fieldName].length > 0) {
            await Promise.all(req.files[fieldName].map((element, index1) => {
              if (fieldName == 'image') {
                req.body.file_name = element.filename;
                req.body.file_path = element.path.replace('public/', '');
              } else if (fieldName == 'images') {
                const thumbimage = {};
                thumbimage.file_name = element.filename;
                thumbimage.file_path = element.path.replace('public/', '');
                thumbimageData.push(thumbimage);
              } else if (fieldName == 'documents') {
                const thumbimage = {};
                thumbimage.file_name = element.filename;
                thumbimage.file_path = element.path.replace('public/', '');
                thumbimageData1.push(thumbimage);
              } else if (fieldName == 'catalogs') {
                const thumbimage = {};
                thumbimage.file_name = element.filename;
                thumbimage.file_path = element.path.replace('public/', '');
                thumbimageData2.push(thumbimage);
              } else if (fieldName == 'video') {
                req.body.video_name = element.filename;
                req.body.video_path = element.path.replace('public/', '');
              }
            }));
          }
        }));
        if (thumbimageData.length) {
          req.body.images = JSON.stringify(thumbimageData);
        }
        if (thumbimageData1.length) {
          req.body.documents = JSON.stringify(thumbimageData1);
        }
        if (thumbimageData2.length) {
          req.body.catalogs = JSON.stringify(thumbimageData2);
        }
      }
      if (!parseInt(req.body.user_id)) {
        req.body.user_id = userInfo.id;
      }

      // make product slug..
      let slug = req.body.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      const existingProduct = await Product.findOne({
        where: {
          slug,
        },
      });
      if (existingProduct) {
        const lastProduct = await Product.findOne({
          order: [
            ['id', 'DESC'],
          ],
        });
        slug = `${slug}-${lastProduct.id + 1}`;
      }
      req.body.slug = slug;

      const category = await Product.create(req.body);

      // Check if variable prodict...
      if (req.body.variant && req.body.variations) {
        const variants = JSON.parse(req.body.variations);
        if (variants && variants.length > 0) {
          await Promise.all(variants.map(async (variant) => {
            if (variant.name) {
              variant.mrp = category.mrp;
              variant.offer_price = category.offer_price;
              variant.product_id = category.id;
              await Variation.create(variant);
            }
          }));
        }
      }

      // Check if shipping rates of product...
      if (req.body.shipping_rates) {
        const shipping_rates = JSON.parse(req.body.shipping_rates);
        if (shipping_rates && shipping_rates.length > 0) {
          await Promise.all(shipping_rates.map(async (rate) => {
            if (rate.country_id) {
              rate.product_id = category.id;
              await ShippingRate.create(rate);
            }
          }));
        }
      }

      if (await helperService.verifyRole(userInfo.role, 'vendor') && category.user_id && category.user_id != 1) {
        const vendorUser = await User.findOne({
          where: {
            id: category.user_id,
          },
        });

        if (vendorUser) {
          // send sms to user...
          await helperService.sendNotification(1, `${[vendorUser.first_name, vendorUser.last_name].join(' ')} is uploaded the ${category.name}. Check the details to approve it.`, false, true, 'product', category.id);
        }
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
      return res.status(500).json({
        msg: err,
      });
    }
  };

  const getAll = async (req, res) => {
    const {
      limit, page, search, status,
    } = req.query;

    try {
      const { Product, Store } = AllModels();
      const defaultLimit = (limit) ? parseInt(limit) : 15;
      const defaultOffset = (page) ? defaultLimit * (parseInt(page) - 1) : 0;

      let condition = {
        status: {
          [Op.ne]: 'inactive',
        },
      };

      // if search..
      if (search && search.length > 0) {
        const orArray = [
          {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            sku: {
              [Op.like]: `%${search}%`,
            },
          },
        ];
        condition = {
          status: {
            [Op.ne]: 'inactive',
          },
          [Op.or]: orArray,
        };
      }

      // if search..
      if (status && status.length > 0 && status != 'All') {
        condition.status = {
          [Op.in]: [status],
        };
      }

      const categories = await Product.findAll({
        where: condition,
        include: [
          {
            model: Store,
            attributes: ['id', 'name', 'slug', 'description', 'logo_path', 'business_type', 'description'],
          },
        ],
        order: [
          ['id', 'DESC'],
        ],
        limit: defaultLimit,
        offset: defaultOffset,
      });
      const products_count = await Product.count({
        where: condition,
      });
      return res.status(200).json({
        categories,
        products_count,
      });
    } catch (err) {
      return res.status(500).json({
        msg: err,
      });
    }
  };

  const getVendorProduct = async (req, res) => {
    try {
      const { Product } = AllModels();
      const {
        limit, page, search, status,
      } = req.query;
      const userInfo = req.token;

      const defaultLimit = (limit) ? parseInt(limit) : 15;
      const defaultOffset = (page) ? defaultLimit * (parseInt(page) - 1) : 0;

      let condition = {
        user_id: userInfo.id,
        status: {
          [Op.ne]: 'inactive',
        },
      };

      // if search..
      if (search && search.length > 0) {
        const orArray = [
          {
            name: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            description: {
              [Op.like]: `%${search}%`,
            },
          },
          {
            sku: {
              [Op.like]: `%${search}%`,
            },
          },
        ];
        condition = {
          user_id: userInfo.id,
          status: {
            [Op.ne]: 'inactive',
          },
          [Op.or]: orArray,
        };
      }

      // if search..
      if (status && status.length > 0 && status != 'All') {
        condition.status = {
          [Op.in]: [status],
        };
      }

      const categories = await Product.findAll({
        where: condition,
        order: [
          ['id', 'DESC'],
        ],
        limit: defaultLimit,
        offset: defaultOffset,
      });
      const products_count = await Product.count({
        where: condition,
      });
      return res.status(200).json({
        categories,
        products_count,
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
    const { slug } = req.query;
    const {
      Product,
      Category,
      Brand,
      User,
      Review,
      Cart,
      Variation,
      ShippingRate,
      Country,
      Store,
    } = AllModels();
    try {
      if (slug && slug == 1) {
        var pwhere = {
          slug: id,
          status: {
            [Op.ne]: 'inactive',
          },
        };
      } else {
        var pwhere = {
          id,
          status: {
            [Op.ne]: 'inactive',
          },
        };
      }
      const category = await Product.findOne({
        where: pwhere,
        include: [
          {
            model: Category,
            as: 'mastercategory',
          },
          {
            model: Category,
            as: 'category',
          },
          {
            model: Category,
            as: 'subcategory',
          },
          {
            model: Brand,
          },
          {
            model: Cart,
            seprate: true,
            attribute: ['product_id'],
            where: {
              type: 'whislist',
              status: 'active',
              user_id: (req.query.userId ? req.query.userId : ''),
            },
            required: false,
          },
          {
            model: User,
          },
          {
            model: Variation,
          },
          {
            model: ShippingRate,
            include: [
              {
                model: Country,
                attributes: ['id', 'name', 'iso3'],
              },
            ],
          },
          {
            model: Store,
          },
        ],
      });

      if (!category) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      // update view count..
      if (slug && slug == 1) {
        await Product.update(
          {
            view_count: category.view_count + 1,
          },
          {
            where: {
              id: category.id,
            },
          },
        );
      }

      return res.status(200).json({
        category,
      });
    } catch (err) {
      // better save it to log file
      return res.status(500).json({
        msg: err,
      });
    }
  };


  const getReviews = async (req, res) => {
    const { id } = req.params;
    const {
      Product,
      Review,
    } = AllModels();
    try {
      let reviews = [];
      let reviewsCount = [];
      const defaultSort = (req.query.sort) ? ['rating', req.query.sort] : ['id', 'DESC'];

      reviews = await Review.findAll({
        where: {
          product_id: id,
          status: {
            [Op.in]: ['approved'],
          },
        },
        group: ['email'],
        order: [
          defaultSort,
        ],
      });
      reviewsCount = await Review.findAll({
        where: {
          product_id: id,
          status: {
            [Op.in]: ['approved'],
          },
        },
        attributes: [
          'email',
          [sequelize.fn('sum', sequelize.col('rating')), 'total_rating'],
        ],
        group: ['email'],
      });

      return res.status(200).json({
        reviews,
        reviewsCount,
      });
    } catch (err) {
      // better save it to log file
      return res.status(500).json({
        msg: err,
      });
    }
  };

  const getRelated = async (req, res) => {
    const { id } = req.params;
    const {
      Product,
      Category,
      Cart,
      Review,
    } = AllModels();
    try {
      let relatedProducts = [];
      let Products = [];

      const category = await Product.findOne({
        where: {
          id,
        },
      });

      if (!category) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      const { userId } = req.query;
      const include = [
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
      ];
      if (userId) {
        include.push({
          model: Cart,
          seprate: true,
          attribute: ['product_id'],
          where: {
            type: 'whislist',
            status: 'active',
            user_id: userId,
          },
          required: false,
        });
      }
      relatedProducts = await Product.findAll({
        where: {
          category_id: category.category_id,
          id: {
            [Op.ne]: category.id,
          },
          status: 'Published',
        },
        include,
        limit: 12,
      });
      Products = await Product.findAll({
        where: {
          status: 'Published',
          id: {
            [Op.ne]: category.id,
          },
        },
        include,
        limit: 12,
      });

      return res.status(200).json({
        relatedProducts,
        Products,
      });
    } catch (err) {
      // better save it to log file
      return res.status(500).json({
        msg: err,
      });
    }
  };

  const getCart = async (req, res) => {
    const { id } = req.params;
    const { Cart } = AllModels();
    const userInfo = req.token;

    try {
      let cart = [];

      if (userInfo.id) {
        cart = await Cart.findOne({
          where: {
            product_id: id,
            type: 'cart',
            status: 'active',
            user_id: userInfo.id,
          },
        });
      }

      return res.status(200).json({
        cart,
      });
    } catch (err) {
      // better save it to log file
      return res.status(500).json({
        msg: err,
      });
    }
  };

  const update = async (req, res) => {
    // params is part of an url
    const { id } = req.params;
    const { Product, User, ShippingRate } = AllModels();
    const userInfo = req.token;
    // body is part of form-data
    const {
      body,
    } = req;

    try {
      // check for same sku..
      if (req.body && req.body.sku) {
        const existing = await helperService.checkDuplicateSku(req.body.sku, id);
        if (existing.error) {
          return res.status(400).json({
            msg: existing.msg,
          });
        }
      }

      const thumbimageData = [];
      const thumbimageData1 = [];
      const thumbimageData2 = [];
      if (req.files) {
        const fileKeys = Object.keys(req.files);
        await Promise.all(fileKeys.map(async (fieldName, index) => {
          if (req.files[fieldName] && req.files[fieldName].length > 0) {
            await Promise.all(req.files[fieldName].map((element, index1) => {
              if (fieldName == 'image') {
                req.body.file_name = element.filename;
                req.body.file_path = element.path.replace('public/', '');
              } else if (fieldName == 'images') {
                const thumbimage = {};
                thumbimage.file_name = element.filename;
                thumbimage.file_path = element.path.replace('public/', '');
                thumbimageData.push(thumbimage);
              } else if (fieldName == 'documents') {
                const thumbimage = {};
                thumbimage.file_name = element.filename;
                thumbimage.file_path = element.path.replace('public/', '');
                thumbimageData1.push(thumbimage);
              } else if (fieldName == 'catalogs') {
                const thumbimage = {};
                thumbimage.file_name = element.filename;
                thumbimage.file_path = element.path.replace('public/', '');
                thumbimageData2.push(thumbimage);
              } else if (fieldName == 'video') {
                req.body.video_name = element.filename;
                req.body.video_path = element.path.replace('public/', '');
              }
            }));
          }
        }));
      }
      const userData = await User.findOne({
        where: {
          id: userInfo.id,
        },
      });
      let query = {
        where: {
          id,
          user_id: userInfo.id,
        },
      };
      if (await helperService.verifyRole(userData.role, 'admin')) {
        query = {
          where: {
            id,
          },
        };
      }
      const data = await Product.findOne(query);
      if (!data) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      if (thumbimageData.length) {
        const imagesA = (data.images ? JSON.parse(data.images) : []);
        thumbimageData.forEach((element, index) => {
          imagesA.push(element);
        });
        req.body.images = JSON.stringify(imagesA);
      }
      if (thumbimageData1.length) {
        const documentsA = (data.documents ? JSON.parse(data.documents) : []);
        thumbimageData1.forEach((element, index) => {
          documentsA.push(element);
        });
        req.body.documents = JSON.stringify(documentsA);
      }
      if (thumbimageData2.length) {
        const documentsB = (data.catalogs ? JSON.parse(data.catalogs) : []);
        thumbimageData2.forEach((element, index) => {
          documentsB.push(element);
        });
        req.body.documents = JSON.stringify(documentsB);
      }

      const updated = await Product.update(
        body,
        {
          where: {
            id,
          },
        },
      );

      // Check if variable prodict...
      if (body.variant && body.variations) {
        const vIds = [];
        const variants = JSON.parse(body.variations);
        if (variants && variants.length > 0) {
          await Promise.all(variants.map(async (variant) => {
            if (variant.name) {
              variant.mrp = req.body.mrp;
              variant.offer_price = req.body.offer_price;
              if (variant.id) {
                // if existing..
                var eVar = await Variation.findOne({
                  where: {
                    id: variant.id,
                  },
                });
                if (eVar) {
                  await Variation.update(variant, {
                    where: {
                      id: variant.id,
                    },
                  });
                } else {
                  variant.product_id = id;
                  eVar = await Variation.create(variant);
                }
              } else {
                variant.product_id = id;
                var eVar = await Variation.create(variant);
              }
              vIds.push(eVar.id);
            }
          }));
        }
        // Delete all variations except new..
        await Variation.destroy({
          where: {
            product_id: id,
            id: {
              [Op.notIn]: vIds,
            },
          },
        });
      }

      // Check if shipping rates of product...
      if (body.shipping_rates) {
        // Delete all shipping except new..
        await ShippingRate.destroy({
          where: {
            product_id: id,
          },
        });
        // Add new rates..
        const shipping_rates = JSON.parse(body.shipping_rates);
        if (shipping_rates && shipping_rates.length > 0) {
          await Promise.all(shipping_rates.map(async (rate) => {
            if (rate.country_id) {
              rate.product_id = id;
              await ShippingRate.create(rate);
            }
          }));
        }
      }

      if (await helperService.verifyRole(userData.role, 'admin')) {
        if (data.user_id && data.user_id != 1) {
          if (body.status && data.status != body.status && body.status == 'Published') {
            // send sms to user...
            await helperService.sendNotification(data.user_id, `${data.name} is approved by the admin.`, false, true, 'product', data.id);
          }
          if (body.status && data.status != body.status && body.status == 'Rejected') {
            await helperService.sendNotification(data.user_id, `${data.name} is rejected by the admin.`, false, true, 'product', data.id);
          }
        }
        // check if product moved to top deals...
        if (body.top_deal && data.top_deal != body.top_deal && body.top_deal == 1) {
          // get all active users with phone..
          const userss = await User.findAll({
            where: {
              role: {
                [Op.in]: ['user', 'both'],
              },
              status: 'active',
            },
          });
          if (userss && userss.length > 0) {
            userss.forEach(async (usr) => {
              // send sms..
              await helperService.sendNotification(usr.id, `Hurry! ${data.name} added in top deals of the day with heavy discount.`, false, true, 'product', data.id);
            });
          }
        }
      }

      return res.status(200).json({
        updated,
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
    const { Product } = AllModels();
    try {
      const category = Product.findById(id);

      if (!category) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      await Product.destroy();

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

  const destroyImage = async (req, res, field) => {
    // params is part of an url
    const { id, key } = req.params;
    const { Product } = AllModels();
    try {
      const data = await Product.findOne({
        where: {
          id,
        },
      });

      if (!data) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

      if (key > 0) {
        const xkey = (key - 1);
        const images = JSON.parse(data[field]);
        if (images.length > 0) {
          const newimages = images.filter((img, i) => i != xkey);
          var dataA = {
            [field]: JSON.stringify(newimages),
          };
        }
        const updated = await Product.update(
          dataA,
          {
            where: {
              id,
            },
          },
        );
      }

      return res.status(200).json({
        msg: 'Successfully destroyed data',
      });
    } catch (err) {
      // better save it to log file
      return res.status(500).json({
        msg: 'Internal server error',
      });
    }
  };

  const getRelatedStores = async (req, res) => {
    try {
      const { id } = req.params;
      const { userId } = req.query;
      const { Store, User, Product } = AllModels();

      // Find related product category..
      const product = await Product.findOne({
        where: {
          id,
        },
      });

      if (!product) {
        return res.status(400).json({
          msg: 'Bad Request: Model not found',
        });
      }

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
            include: [
              {
                model: Product,
                where: {
                  category_id: product.category_id,
                  status: 'Published',
                },
                required: true,
              },
            ],
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

  return {
    create,
    getAll,
    get,
    update,
    destroy,
    getVendorProduct,
    destroyImage,
    getRelated,
    getReviews,
    getCart,
    getRelatedStores,
  };
};

module.exports = ProductController;
