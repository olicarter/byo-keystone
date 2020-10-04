const { Keystone } = require('@keystonejs/keystone');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { MongooseAdapter: Adapter } = require('@keystonejs/adapter-mongoose');

require('dotenv').config();

const { COOKIE_SECRET, MONGO_URI } = process.env;

const PROJECT_NAME = 'byo';
const adapterConfig = {
  mongoUri: MONGO_URI,
};

/**
 * You've got a new KeystoneJS Project! Things you might want to do next:
 * - Add adapter config options (See: https://keystonejs.com/keystonejs/adapter-mongoose/)
 * - Select configure access control and authentication (See: https://keystonejs.com/api/access-control)
 */

const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  cookieSecret: COOKIE_SECRET,
});

keystone.createList('Address', require('./lists/Address.js'));
keystone.createList('Category', require('./lists/Category.js'));
keystone.createList('Container', require('./lists/Container.js'));
keystone.createList('Order', require('./lists/Order.js'));
keystone.createList('OrderItem', require('./lists/OrderItem.js'));
keystone.createList('Product', require('./lists/Product.js'));
keystone.createList('ProductVariant', require('./lists/ProductVariant.js'));
keystone.createList('Tag', require('./lists/Tag.js'));
keystone.createList('Unit', require('./lists/Unit.js'));
keystone.createList('User', require('./lists/User.js'));

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({ name: PROJECT_NAME, enableDefaultRoute: true }),
  ],
};
