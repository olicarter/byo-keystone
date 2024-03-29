const { Keystone } = require('@keystonejs/keystone');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { MongooseAdapter } = require('@keystonejs/adapter-mongoose');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { logging } = require('@keystonejs/list-plugins');
const expressSession = require('express-session');
const MongoStore = require('connect-mongo')(expressSession);

require('dotenv').config();

const { seedDatabase } = require('./functions');
const schemaExtensions = require('./schemaExtensions');

const {
  COOKIE_SECRET,
  MONGO_URI,
  MONGO_SESSION_URI,
  NODE_ENV,
  SEED_DATABASE,
} = process.env;

const adapterConfig = {
  mongoUri: MONGO_URI,
};

const keystone = new Keystone({
  adapter: new MongooseAdapter(adapterConfig),
  cookieMaxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
  cookieSecret: COOKIE_SECRET,
  onConnect:
    NODE_ENV !== 'production' && SEED_DATABASE === 'true' ? seedDatabase : null,
  secureCookies: NODE_ENV === 'production',
  sessionStore: new MongoStore({ url: MONGO_SESSION_URI }),
});

keystone.createList('Address', require('./lists/Address.js'));
keystone.createList('BlogPost', require('./lists/BlogPost.js'));
keystone.createList('Brand', require('./lists/Brand.js'));
keystone.createList('Category', require('./lists/Category.js'));
keystone.createList('Container', require('./lists/Container.js'));
keystone.createList('DeliverySlot', require('./lists/DeliverySlot.js'));
keystone.createList('Email', require('./lists/Email.js'));
keystone.createList('Medium', require('./lists/Medium.js'));
keystone.createList('Order', require('./lists/Order/index.js'));
keystone.createList('OrderItem', require('./lists/OrderItem.js'));
keystone.createList('Page', require('./lists/Page.js'));
keystone.createList('Postcode', require('./lists/Postcode.js'));
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
  plugins: [logging(console.log)],
});

keystone.extendGraphQLSchema(schemaExtensions);

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({
      authStrategy,
      isAccessAllowed: ({ authentication: { item: user } }) =>
        !!user && !!user.isAdmin,
      enableDefaultRoute: true,
      name: 'BYO',
    }),
  ],
  configureExpress: app => {
    app.set('trust proxy', 1);
  },
};
