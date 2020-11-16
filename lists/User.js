const {
  Checkbox,
  Password,
  Relationship,
  Text,
} = require('@keystonejs/fields');

module.exports = {
  access: {
    auth: true,
  },
  fields: {
    email: {
      type: Text,
      isRequired: true,
      isUnique: true,
      // access: ({
      //   existingItem,
      //   authentication,
      //   authentication: { item: { id: itemId, isAdmin } = {} } = {},
      // }) => {
      //   console.log('authentication', authentication);
      //   console.log('existingItem', existingItem);
      //   console.log('itemId', itemId);
      //   return isAdmin || existingItem.id === itemId;
      // },
    },
    password: {
      type: Password,
      access: {
        // 3. Only admins can see if a password is set. No-one can read their own or other user's passwords.
        read: ({ authentication: { item: { isAdmin } = {} } = {} }) => isAdmin,
        // 4. Only authenticated users can update their own password. Admins can update anyone's password.
        update: ({
          existingItem,
          authentication: { item: { id: itemId, isAdmin } = {} },
        }) => {
          return isAdmin || existingItem.id === itemId;
        },
      },
    },
    name: {
      type: Text,
      isRequired: true,
    },
    phone: {
      type: Text,
      isRequired: true,
    },
    orders: {
      type: Relationship,
      ref: 'Order.user',
      many: true,
    },
    addresses: {
      type: Relationship,
      ref: 'Address',
      many: true,
    },
    isAdmin: {
      type: Checkbox,
      defaultValue: false,
    },
  },
  labelField: 'email',
};
