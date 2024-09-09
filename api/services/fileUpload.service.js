const multer = require('multer');
const mkdirP = require('mkdirp');
const fs = require('fs');
// eslint-disable-next-line no-unused-vars
const ValidationService = require('./validation.service');
const HelperService = require('./helper.service');

const fileUpload = () => {
  const callBackHandler = (req, res, err, next) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).send({ status: false, message: err.message });
    } else if (err) {
      return res.status(422).send({ status: false, message: err.message });
    }
    return next();
  };

  const getMulter = () => {
    const storage = multer.diskStorage({
      async destination(req, file, cb) {
        const dir = HelperService.getBaseDirectory();
        if (!fs.existsSync(dir)) {
          try {
            await mkdirP(dir);
            cb(null, dir);
          } catch (E) {
            // eslint-disable-next-line no-console
            console.log('error', E);
            cb(E, null);
          }
        } else {
          cb(null, dir);
        }
      },
      filename(req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname.replace(/\s/g, '')}`);
      },
    });
    const obj = { storage };
    return multer(obj);
  };

  // eslint-disable-next-line func-names
  const multipleUpload = (fieldName) => function (req, res, next) {
    return getMulter().array(fieldName, 10)(req, res, (err) => {
      callBackHandler(req, res, err, next);
    });
  };

  // eslint-disable-next-line func-names
  const signleUpload = (fieldName) => function (req, res, next) {
    return getMulter().single(fieldName)(req, res, (err) => {
      callBackHandler(req, res, err, next);
    });
  };

  const businessUploads = () => function (req, res, next) {
    return getMulter().fields([
      { name: 'company_logo', maxCount: 1 },
      { name: 'company_photo', maxCount: 1 },
      { name: 'production_process', maxCount: 1 },
      { name: 'qc_process', maxCount: 1 },
      { name: 'rd_process', maxCount: 1 },
      { name: 'customer_case', maxCount: 2 },
      { name: 'trade_shows', maxCount: 1 },
    ])(req, res, (err) => {
      callBackHandler(req, res, err, next);
    });
  };

  const productUploads = () => function (req, res, next) {
    return getMulter().fields([
      { name: 'image', maxCount: 1 },
      { name: 'video', maxCount: 1 },
      { name: 'images', maxCount: 10 },
      { name: 'documents', maxCount: 10 },
    ])(req, res, (err) => {
      callBackHandler(req, res, err, next);
    });
  };

  return {
    multipleUpload,
    signleUpload,
    businessUploads,
    productUploads,
  };
};

module.exports = fileUpload;
