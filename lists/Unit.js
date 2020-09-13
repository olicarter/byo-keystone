const { Text } = require("@keystonejs/fields");

module.exports = {
  fields: {
    singular: { type: Text, isRequired: true },
    plural: { type: Text, isRequired: true },
    singularAbbreviated: { type: Text, isRequired: true },
    pluralAbbreviated: { type: Text, isRequired: true },
  },
};
