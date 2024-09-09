/* eslint-disable prefer-rest-params */
module.exports = {
  imageFilter: (req, file, cb) => {
    // Accept images only
    if (!module.exports.isImage(file.originalname)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only jpg, jpeg ,png and gif files are allowed for image file!'), false);
    }
    return cb(null, true);
  },
  isImage: (fileName) => fileName.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/),
};

