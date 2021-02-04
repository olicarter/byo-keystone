const Tag = require('./Tag');

module.exports = `
  tags(sortBy: name_ASC) {
    ${Tag}
  }
`;
