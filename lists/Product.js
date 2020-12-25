const { Relationship, Slug, Text } = require('@keystonejs/fields');
const { CloudinaryImage } = require('@keystonejs/fields-cloudinary-image');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

const { fileAdapters } = require('../helpers');

const { cloudinaryAdapter } = fileAdapters;

module.exports = {
  fields: {
    image: { type: CloudinaryImage, adapter: cloudinaryAdapter },
    name: { type: Text, isRequired: true, isUnique: true },
    slug: { type: Slug },
    category: {
      type: Relationship,
      ref: 'Category.products',
      many: false,
      isRequired: true,
    },
    brand: {
      type: Relationship,
      ref: 'Brand.products',
      many: false,
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
