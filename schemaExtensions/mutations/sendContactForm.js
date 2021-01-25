const { sendEmail } = require('../../functions');

const { CONTACT_FORM_SUBMISSION_EMAIL_ID } = process.env;

module.exports = {
  schema:
    'sendContactForm(email: String!, message: String!, name: String): Boolean',
  resolver: async (_, { email, message, name }, context) => {
    const variables = { email, message, name };

    await sendEmail({
      context,
      emailId: CONTACT_FORM_SUBMISSION_EMAIL_ID,
      variables,
    });

    return true;
  },
};
