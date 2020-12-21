const { Relationship, Slug, Text } = require('@keystonejs/fields');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');
const { CloudinaryAdapter } = require('@keystonejs/file-adapters');
const { CloudinaryImage } = require('@keystonejs/fields-cloudinary-image');

const fileAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: 'my-keystone-app',
});

module.exports = {
  fields: {
    image: { type: CloudinaryImage, adapter: fileAdapter },
    name: { type: Text, isRequired: true, isUnique: true },
    slug: { type: Slug },
    category: {
      type: Relationship,
      ref: 'Category.products',
      many: false,
      isRequired: true,
    },
    allergenInfo: {
      type: Text,
    },
    deliveryInfo: {
      type: Text,
    },
    ingredients: {
      type: Text,
    },
    origin: {
      type: Text,
    },
    tags: {
      adminDoc: 'Select any tags that apply to all variants for this product.',
      type: Relationship,
      ref: 'Tag.products',
      many: true,
    },
    variants: {
      type: Relationship,
      ref: 'ProductVariant.product',
      many: true,
    },
  },
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
