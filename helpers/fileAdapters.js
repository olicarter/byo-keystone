const { CloudinaryAdapter } = require('@keystonejs/file-adapters');

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_FOLDER,
  CLOUDINARY_KEY,
  CLOUDINARY_SECRET,
} = process.env;

module.exports = {
  cloudinaryAdapter: new CloudinaryAdapter({
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_KEY,
    apiSecret: CLOUDINARY_SECRET,
    folder: CLOUDINARY_FOLDER,
  }),
};
