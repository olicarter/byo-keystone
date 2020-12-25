const { CloudinaryAdapter } = require('@keystonejs/file-adapters');

module.exports = {
  cloudinaryAdapter: new CloudinaryAdapter({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_KEY,
    apiSecret: process.env.CLOUDINARY_SECRET,
    folder: 'my-keystone-app',
  }),
};
