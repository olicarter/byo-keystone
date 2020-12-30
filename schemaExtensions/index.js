const {
  resetPassword,
  sendContactForm,
  sendPasswordResetEmail,
} = require('./mutations');

module.exports = {
  mutations: [resetPassword, sendContactForm, sendPasswordResetEmail],
};
