const {
  Checkbox,
  Password,
  Relationship,
  Text,
} = require('@keystonejs/fields');
const { atTracking, byTracking, logging } = require('@keystonejs/list-plugins');

const { sendEmail } = require('../helpers');

const { NEW_USER_WELCOME_EMAIL_ID } = process.env;

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
    isSuperAdmin: {
      access: {
        read: ({ authentication: { item: { isSuperAdmin } = {} } = {} }) =>
          isSuperAdmin,
        update: ({ authentication: { item: { isSuperAdmin } = {} } }) =>
          isSuperAdmin,
      },
      type: Checkbox,
      defaultValue: false,
    },
  },
  hooks: {
    afterChange: async ({
      context,
      operation,
      updatedItem: { email, name, phone } = {},
    }) => {
      if (operation === 'create') {
        try {
          const res = await sendEmail({
            context,
            emailId: NEW_USER_WELCOME_EMAIL_ID,
            to: { email, name },
            variables: { email, name, phone },
          });
          console.log('New user email response', res);
        } catch (error) {
          console.error('New user email error', error);
        }
      }
    },
  },
  labelField: 'email',
  plugins: [atTracking(), byTracking(), logging(console.log)],
};
