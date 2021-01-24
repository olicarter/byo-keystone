const {
  Checkbox,
  DateTime,
  Relationship,
  Text,
} = require('@keystonejs/fields');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

const fields = require('./fields');
const hooks = require('./hooks');

module.exports = {
  access: {
    delete: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
  },
  fields: {
    address: {
      type: Relationship,
      ref: 'Address',
      many: false,
    },
    deliverySlot: {
      type: Relationship,
      ref: 'DeliverySlot.orders',
      many: false,
    },
    orderNumber: {
      access: {
        create: false,
        delete: false,
        update: false,
      },
      type: Text,
      defaultValue: () =>
        Math.floor(100000 + Math.random() * 900000).toString(),
    },
    orderItems: {
      type: Relationship,
      ref: 'OrderItem.order',
      many: true,
    },
    paid: {
      type: Checkbox,
      defaultValue: false,
      access: {
        create: ({ authentication: { item: { isAdmin } = {} } = {} }) =>
          !!isAdmin,
        delete: ({ authentication: { item: { isAdmin } = {} } = {} }) =>
          !!isAdmin,
        update: ({ authentication: { item: { isAdmin } = {} } = {} }) =>
          !!isAdmin,
      },
      hooks: {
        afterChange: fields.paid.hooks.afterChange,
        validateInput: fields.paid.hooks.validateInput,
      },
    },
    paidAt: {
      access: {
        create: ({ authentication: { item: { isSuperAdmin } = {} } = {} }) =>
          !!isSuperAdmin,
        delete: ({ authentication: { item: { isSuperAdmin } = {} } = {} }) =>
          !!isSuperAdmin,
        update: ({ authentication: { item: { isSuperAdmin } = {} } = {} }) =>
          !!isSuperAdmin,
      },
      type: DateTime,
    },
    submitted: {
      type: Checkbox,
      defaultValue: false,
    },
    user: {
      type: Relationship,
      ref: 'User.orders',
      many: false,
    },
  },
  hooks: {
    afterChange: hooks.afterChange,
    validateInput: hooks.validateInput,
  },
  labelField: 'orderNumber',
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
