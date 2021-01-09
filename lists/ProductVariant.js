const { Decimal, Integer, Relationship, Text } = require('@keystonejs/fields');
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
    product: {
      type: Relationship,
      ref: 'Product.variants',
      many: false,
    },
    name: {
      adminDoc:
        'Variant name. This is not searchable so try to use this field for things like flavour or fragrance variations, rather than functional variations e.g. shampoo and conditioner should be different products, not different variants.',
      type: Text,
    },
    increment: {
      adminDoc:
        'Quantity of raw product being sold. Examples: 350 for 350ml jar of sauce, 1 for a bar of soap, 100 for 100g increments of loose rice.',
      type: Integer,
      isRequired: true,
    },
    incrementPrice: {
      adminDoc: 'Price per increment.',
      type: Decimal,
      isRequired: true,
    },
    unit: {
      adminDoc:
        'Increment unit. Examples: "Ml" for 350ml jar of sauce, "item" for bar of soap, "G" for 100g increments of loose rice.',
      type: Relationship,
      ref: 'Unit',
      isRequired: true,
    },
    container: {
      adminDoc:
        'Container product is sold in. Choose a free container for products that come in non-returnable containers (i.e. pasta sauce), and containers with a price for loose products with returnable containers.',
      type: Relationship,
      ref: 'Container',
    },
    allergenInfo: {
      adminDoc:
        "Only set this field if this variant's allergen info differs from the parent product.",
      type: Text,
    },
    deliveryInfo: {
      adminDoc:
        "Only set this field if this variant's delivery info differs from the parent product.",
      type: Text,
    },
    ingredients: {
      adminDoc:
        "Only set this field if this variant's ingredients differ from the parent product.",
      type: Text,
    },
    origin: {
      adminDoc:
        "Only set this field if this variant's origin differs from the parent product.",
      type: Text,
    },
    tags: {
      adminDoc:
        'Tags that apply to all variants for this product should be specified on the product. Use this field to specify any additional tags that apply only to this variant.',
      type: Relationship,
      ref: 'Tag',
      many: true,
    },
  },
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
