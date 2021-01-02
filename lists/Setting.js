const { Integer, Text, Url } = require('@keystonejs/fields');
const { Markdown } = require('@keystonejs/fields-markdown');
const { logging, singleton } = require('@keystonejs/list-plugins');

module.exports = {
  access: {
    create: false,
    delete: false,
    read: true,
    update: ({ authentication: { item: { isAdmin } = {} } = {} }) => !!isAdmin,
  },
  fields: {
    calloutText: {
      type: Text,
    },

    homeContent: {
      type: Markdown,
      isRequired: true,
    },
    aboutContent: {
      type: Markdown,
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

    shopHeader: {
      type: Markdown,
      isRequired: true,
    },
    aboutHeader: {
      type: Markdown,
      isRequired: true,
    },
    blogHeader: {
      type: Markdown,
      isRequired: true,
    },
    contactHeader: {
      type: Markdown,
      isRequired: true,
    },
    loginHeader: {
      type: Markdown,
      isRequired: true,
    },
    registerHeader: {
      type: Markdown,
      isRequired: true,
    },
    accountHeader: {
      type: Markdown,
      isRequired: true,
    },
    basketHeader: {
      type: Markdown,
      isRequired: true,
    },
    checkoutHeader: {
      type: Markdown,
      isRequired: true,
    },

    footerContent: {
      type: Markdown,
      isRequired: true,
    },
  },
  plugins: [logging(console.log), singleton()],
};
