const Mailgun = require('mailgun-js');
const { compiler } = require('markdown-to-jsx');
const { gql } = require('apollo-server-express');
const { renderToStaticMarkup } = require('react-dom/server');
const Mustache = require('mustache');

const { MAILGUN_API_KEY, MAILGUN_DOMAIN } = process.env;

const mailgun = Mailgun({
  apiKey: MAILGUN_API_KEY,
  domain: MAILGUN_DOMAIN,
  host: 'api.eu.mailgun.net',
});

module.exports = async ({
  context: { createContext, executeGraphQL } = {},
  emailId,
  to: { email, name } = {},
  variables = {},
}) => {
  const {
    data: {
      Email: { body, fromEmail, fromName, subject, toEmail, toName } = {},
    } = {},
    errors,
  } = await executeGraphQL({
    context: createContext({ skipAccessControl: true }),
    query: gql`
      query($id: ID!) {
        Email(where: { id: $id }) {
          body
          fromEmail
          fromName
          subject
          toEmail
          toName
        }
      }
    `,
    variables: { id: emailId },
  });

  if (errors) throw Error(errors[0]);
  if (!name && !toName) throw Error('Sender name missing');
  if (!email && !toEmail) throw Error('Sender email missing');

  const renderedSubject = Mustache.render(subject, variables);

  const html = Mustache.render(renderToStaticMarkup(compiler(body)), variables);

  return mailgun.messages().send({
    from: `${fromName} <${fromEmail}>`,
    to: `${name || toName} <${email || toEmail}>`,
    subject: renderedSubject,
    html,
  });
};
