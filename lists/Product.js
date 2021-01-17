const { Relationship, Slug, Text } = require('@keystonejs/fields');
const { CloudinaryImage } = require('@keystonejs/fields-cloudinary-image');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

const { fileAdapters } = require('../helpers');

const { cloudinaryAdapter } = fileAdapters;

module.exports = {
  access: {
    create: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
    delete: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
    update: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
  },
  fields: {
    image: { type: CloudinaryImage, adapter: cloudinaryAdapter },
    name: {
      adminDoc:
        'Name of product displayed across site. Variants of product can have unique names but this name should apply to all variants.',
      type: Text,
      isRequired: true,
      isUnique: true,
    },
    slug: {
      adminDoc:
        'Auto generated URL-friendly product name i.e. brown-basmati-rice.',
      type: Slug,
    },
    category: {
      adminDoc: 'Primary category of product. Applies to all variants.',
      type: Relationship,
      ref: 'Category.products',
      many: false,
      isRequired: true,
    },
    brand: {
      adminDoc:
        'Brand of company that produces product. Applies to all variants.',
      type: Relationship,
      ref: 'Brand.products',
      many: false,
    },
    allergenInfo: {
      adminDoc: 'Applies to all variants.',
      type: Text,
    },
    description: {
      adminDoc: 'General info about product. Should apply to all variants.',
      type: Text,
    },
    ingredients: {
      adminDoc: 'Applies to all variants.',
      type: Text,
    },
    origin: {
      adminDoc: 'Country of origin. Applies to all variants.',
      type: Text,
    },
    tags: {
      adminDoc: 'Filterable attributes. Applies to all variants..',
      type: Relationship,
      ref: 'Tag.products',
      many: true,
    },
    variants: {
      adminDoc: 'All products must have at least one variant.',
      type: Relationship,
      ref: 'ProductVariant.product',
      many: true,
      isRequired: true,
    },
  },
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
