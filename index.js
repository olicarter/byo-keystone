const { Keystone } = require('@keystonejs/keystone');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');

require('dotenv').config();

const { COOKIE_SECRET, MONGO_URI, NODE_ENV } = process.env;

const PROJECT_NAME = 'byo';
const adapterConfig = {
  mongoUri: MONGO_URI,
};

const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  cookieSecret: COOKIE_SECRET,
  secureCookies: NODE_ENV === 'production',
  cookieMaxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
});

keystone.createList('Address', require('./lists/Address.js'));
keystone.createList('Category', require('./lists/Category.js'));
keystone.createList('Container', require('./lists/Container.js'));
keystone.createList('DeliverySlot', require('./lists/DeliverySlot.js'));
keystone.createList('Order', require('./lists/Order.js'));
keystone.createList('OrderItem', require('./lists/OrderItem.js'));
keystone.createList('Product', require('./lists/Product.js'));
keystone.createList('ProductVariant', require('./lists/ProductVariant.js'));
keystone.createList('Setting', require('./lists/Setting.js'));
keystone.createList('Tag', require('./lists/Tag.js'));
keystone.createList('Unit', require('./lists/Unit.js'));
keystone.createList('User', require('./lists/User.js'));

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
  config: {
    identityField: 'email',
    secretField: 'password',
    protectIdentities: true,
  },
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      authStrategy,
      // enableDefaultRoute: true,
      isAccessAllowed: ({ authentication: { item: user } }) =>
        !!user && !!user.isAdmin,
      name: PROJECT_NAME,
    }),
  ],
  configureExpress: app => {
    app.set('trust proxy', 1);
  },
};
