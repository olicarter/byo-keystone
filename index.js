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

const ProductSchema = require("./lists/Product.js");
const TagSchema = require("./lists/Tag.js");
keystone.createList("Product", ProductSchema);
keystone.createList("Tag", TagSchema);

module.exports = {
  keystone,
  apps: [
    new GraphQLApp(),
    new AdminUIApp({ name: PROJECT_NAME, enableDefaultRoute: true }),
  ],
};
