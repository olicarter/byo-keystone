const Container = require('./Container');
const ProductVariantTags = require('./ProductVariantTags');
const Unit = require('./Unit');

module.exports = `
  id
  increment
  incrementPrice
  name
  container {
    ${Container}
  }
  image {
    id
    publicUrl
  }
  ${ProductVariantTags}
  unit {
    ${Unit}
  }
`;
