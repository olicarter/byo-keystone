const {
  Checkbox,
  Password,
  Relationship,
  Text,
  Virtual,
} = require('@keystonejs/fields');

module.exports = {
  fields: {
    email: {
      type: Text,
      isRequired: true,
      isUnique: true,
      // access: ({ existingItem, authentication: { item } }) => {
      //   return item.isAdmin || existingItem.id === item.id;
      // },
    },
    password: {
      type: Password,
      // access: {
      //   // 3. Only admins can see if a password is set. No-one can read their own or other user's passwords.
      //   read: ({ authentication }) => authentication.item.isAdmin,
      //   // 4. Only authenticated users can update their own password. Admins can update anyone's password.
      //   update: ({ existingItem, authentication: { item } }) => {
      //     return item.isAdmin || existingItem.id === item.id;
      //   },
      // },
    },
    firstName: {
      type: Text,
      isRequired: true,
    },
    lastName: {
      type: Text,
      isRequired: true,
    },
    name: {
      type: Virtual,
      resolver: item => `${item.firstName} ${item.lastName}`,
    },
    netlifyId: {
      type: Text,
      isRequired: true,
      isUnique: true,
    },
    orders: {
      type: Relationship,
      ref: 'Order.user',
      many: true,
    },
    address: {
      type: Relationship,
      ref: 'Address',
      many: false,
    },
    isAdmin: {
      type: Checkbox,
      defaultValue: false,
    },
  },
  labelField: 'email',
};
