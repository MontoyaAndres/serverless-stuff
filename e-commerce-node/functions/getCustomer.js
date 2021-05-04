const { makeHandler } = require("../utils");
const { getCustomer } = require("../data");
const { Customer } = require("../entities");

const inputSchema = {
  type: "object",
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        username: { type: "string" },
      },
      required: ["username"],
    },
  },
  required: ["pathParameters"],
};

const handler = async (event) => {
  const currentCustomer = new Customer({
    username: event.pathParameters.username,
  });
  const { customer, error } = await getCustomer(currentCustomer);

  const statusCode = error ? 500 : 200;
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ customer });

  return {
    statusCode,
    body,
  };
};

module.exports.handler = makeHandler({ handler, inputSchema });
