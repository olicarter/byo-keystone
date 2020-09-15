const { Text } = require("@keystonejs/fields");

module.exports = {
  access: {
    create: false,
    delete: false,
    read: true,
    update: true,
  },
  fields: {
    shopTitle: { type: Text, isRequired: true },
    shopSubTitle: { type: Text, isRequired: true },
  },
};
