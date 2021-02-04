const ProductBrand = require('./ProductBrand');
const ProductDetails = require('./ProductDetails');
const ProductTags = require('./ProductTags');
const ProductVariant = require('./ProductVariant');
const ProductVariants = require('./ProductVariants');
const Unit = require('./Unit');

module.exports = `
  id
  isContainerReturned
  quantity
  productVariant {
    ${ProductVariant}
    product {
      ${ProductDetails}
      ${ProductBrand}
      ${ProductTags}
      ${ProductVariants}
    }
  }
  productName
  productBrandName
  productVariantName
  productVariantIncrement
  productVariantIncrementPrice
  productVariantUnit {
    ${Unit}
  }
  productVariantContainerPrice
  productVariantContainerSize
  productVariantContainerUnit
  productVariantContainerType
`;
