const {Password, Relationship, Text, Virtual} = require("@keystonejs/fields");

module.exports = {
    fields: {
        email: {
            type: Text,
            isRequired: true,
            isUnique: true
        },
        firstName: {
            type: Text,
            isRequired: true
        },
        lastName: {
            type: Text,
            isRequired: true
        },
        name: {
            type: Virtual,
            resolver: item => `${
                item.firstName
            } ${
                item.lastName
            }`
        },
        netlifyId: {
            type: Text,
            isRequired: true,
            isUnique: true
        },
        orders: {
            type: Relationship,
            ref: "Order.user",
            many: true
        },
        address: {
            type: Relationship,
            ref: "Address",
            many: false
        }
    },
    labelField: "email"
};
