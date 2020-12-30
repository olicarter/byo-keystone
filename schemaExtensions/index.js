const { resetPassword, sendPasswordResetEmail } = require('./mutations');

module.exports = {
  mutations: [resetPassword, sendPasswordResetEmail],
};
