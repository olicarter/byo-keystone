const mailgun = require('mailgun-js');

const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = process.env;

module.exports = mailgun({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN,
  host: 'api.eu.mailgun.net',
});
