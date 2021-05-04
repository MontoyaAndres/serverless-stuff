const { makeHandler } = require("../utils");
const { createCustomer } = require("../data");
const { Customer } = require("../entities");

const inputSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        username: { type: "string" },
        email: { type: "string" },
        name: { type: "string" },
      },
      required: ["username", "email", "name"],
    },
  },
  required: ["body"],
};

const handler = async (event) => {
  const customer = new Customer({
    username: event.body.username,
    email: event.body.email,
    name: event.body.name,
  });

  const { error } = await createCustomer(customer);

  const statusCode = error ? 500 : 200;
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ customer });

  return {
    statusCode,
    body,
  };
};

module.exports.handler = makeHandler({ handler, inputSchema });
