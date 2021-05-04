const { makeHandler } = require("../utils");
const { deleteAddressForCustomer } = require("../data");
const { Customer } = require("../entities");

const inputSchema = {
  type: "object",
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        username: { type: "string" },
        name: { type: "string" },
      },
      required: ["username", "name"],
    },
  },
  required: ["pathParameters"],
};

const handler = async (event) => {
  const currentCustomer = new Customer({
    username: event.pathParameters.username,
  });

  const { customer, error } = await deleteAddressForCustomer(
    currentCustomer,
    event.pathParameters.name
  );

  const statusCode = error ? 500 : 200;
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ customer });

  return {
    statusCode,
    body,
  };
};

module.exports.handler = makeHandler({ handler, inputSchema });
