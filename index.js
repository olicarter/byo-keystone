const { Keystone } = require("@keystonejs/keystone");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const { MongooseAdapter: Adapter } = require("@keystonejs/adapter-mongoose");

require("dotenv").config();

const { COOKIE_SECRET, MONGO_URI } = process.env;

const PROJECT_NAME = "byo";
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

const CategorySchema = require("./lists/Category.js");
const ContentSchema = require("./lists/Content.js");
const OrderItemSchema = require("./lists/OrderItem.js");
const OrderSchema = require("./lists/Order.js");
const ProductSchema = require("./lists/Product.js");
const ProductVariantSchema = require("./lists/ProductVariant.js");
const TagSchema = require("./lists/Tag.js");
const UnitSchema = require("./lists/Unit.js");
const UserSchema = require("./lists/User.js");
keystone.createList("Category", CategorySchema);
keystone.createList("Content", ContentSchema);
keystone.createList("Order", OrderSchema);
keystone.createList("OrderItem", OrderItemSchema);
keystone.createList("Product", ProductSchema);
keystone.createList("ProductVariant", ProductVariantSchema);
keystone.createList("Tag", TagSchema);
keystone.createList("Unit", UnitSchema);
keystone.createList("User", UserSchema);

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({ name: PROJECT_NAME, enableDefaultRoute: true }),
  ],
};
