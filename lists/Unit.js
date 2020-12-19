const { Text } = require('@keystonejs/fields');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

module.exports = {
  access: {
    create: false,
    delete: false,
    read: true,
    update: false,
  },
  fields: {
    singular: { type: Text, isRequired: true },
    plural: { type: Text, isRequired: true },
    singularAbbreviated: { type: Text, isRequired: true },
    pluralAbbreviated: { type: Text, isRequired: true },
  },
  labelField: 'plural',
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
