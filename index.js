const { Keystone } = require("@keystonejs/keystone");
const { GraphQLApp } = require("@keystonejs/app-graphql");
const { AdminUIApp } = require("@keystonejs/app-admin-ui");
const { MongooseAdapter: Adapter } = require("@keystonejs/adapter-mongoose");

const PROJECT_NAME = "byo";
const adapterConfig = {
  mongoUri:
    "mongodb+srv://oli:BCB74202DBo!@cluster0.p7owd.mongodb.net/byo?retryWrites=true&w=majority",
};

/**
 * You've got a new KeystoneJS Project! Things you might want to do next:
 * - Add adapter config options (See: https://keystonejs.com/keystonejs/adapter-mongoose/)
 * - Select configure access control and authentication (See: https://keystonejs.com/api/access-control)
 */

const keystone = new Keystone({
  adapter: new Adapter(adapterConfig),
  cookieSecret: "notverysecret",
});

const OrderItemSchema = require("./lists/OrderItem.js");
const OrderSchema = require("./lists/Order.js");
const ProductSchema = require("./lists/Product.js");
const TagSchema = require("./lists/Tag.js");
const UserSchema = require("./lists/User.js");
keystone.createList("Product", ProductSchema);
keystone.createList("Tag", OrderItemSchema);
keystone.createList("Tag", OrderSchema);
keystone.createList("Tag", TagSchema);
keystone.createList("Tag", UserSchema);

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({ name: PROJECT_NAME, enableDefaultRoute: true }),
  ],
};
