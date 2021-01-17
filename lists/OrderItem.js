const {
  Checkbox,
  Decimal,
  Integer,
  Relationship,
  Text,
} = require('@keystonejs/fields');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

module.exports = {
  fields: {
    order: {
      type: Relationship,
      ref: 'Order.orderItems',
      many: false,
      isRequired: true,
    },
    productVariant: {
      type: Relationship,
      ref: 'ProductVariant',
      many: false,
      isRequired: true,
    },
    quantity: {
      type: Integer,
      isRequired: true,
    },
    isContainerReturned: {
      type: Checkbox,
      defaultValue: false,
    },

    // These fields are copied from Product, ProductVariant and Container
    // at time of order submission, to ensure the data doesn't change
    // in past orders screen.
    productName: {
      type: Text,
      adminConfig: { isReadOnly: true },
    },
    productBrand: {
      type: Text,
      adminConfig: { isReadOnly: true },
    },
    productVariantName: {
      type: Text,
      adminConfig: { isReadOnly: true },
    },
    productVariantIncrement: {
      type: Integer,
      adminConfig: { isReadOnly: true },
    },
    productVariantIncrementPrice: {
      type: Decimal,
      adminConfig: { isReadOnly: true },
    },
    productVariantUnit: {
      type: Relationship,
      ref: 'Unit',
      adminConfig: { isReadOnly: true },
    },
    productVariantContainerPrice: {
      type: Decimal,
      adminConfig: { isReadOnly: true },
    },
    productVariantContainerSize: {
      type: Decimal,
      adminConfig: { isReadOnly: true },
    },
    productVariantContainerUnit: {
      type: Text,
      adminConfig: { isReadOnly: true },
    },
    productVariantContainerType: {
      type: Text,
      adminConfig: { isReadOnly: true },
    },
  },
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
