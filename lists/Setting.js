const { Integer, Text, Url } = require('@keystonejs/fields');
const { Markdown } = require('@keystonejs/fields-markdown');
const { Color } = require('@keystonejs/fields-color');
const { logging, singleton } = require('@keystonejs/list-plugins');

module.exports = {
  access: {
    delete: false,
    read: true,
    update: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
  },
  fields: {
    primaryColor: {
      type: Color,
      isRequired: true,
    },
    facebookUrl: {
      type: Url,
      isRequired: true,
    },
    instagramUrl: {
      type: Url,
      isRequired: true,
    },
    minOrderValue: {
      type: Integer,
      defaultValue: 20,
    },
    chooseDeliverySlotInfo: {
      type: Text,
      isMultiline: true,
    },
    orderSubmissionInfo: {
      type: Text,
      isMultiline: true,
    },
    footerContent: {
      type: Markdown,
      isRequired: true,
    },
  },
  plugins: [logging(console.log), singleton()],
};
