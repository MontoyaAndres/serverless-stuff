const { makeHandler } = require("../utils");
const { editAddressForCustomer } = require("../data");
const { Customer, Address } = require("../entities");

const inputSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        streetAddress: { type: "string" },
        postalCode: { type: "string" },
        country: { type: "string" },
      },
      required: ["name", "streetAddress", "postalCode", "country"],
    },
    pathParameters: {
      type: "object",
      properties: {
        username: { type: "string" },
      },
      required: ["username"],
    },
  },
  required: ["body", "pathParameters"],
};

const handler = async (event) => {
  const currentCustomer = new Customer({
    username: event.pathParameters.username,
  });
  const currentAddress = new Address({
    streetAddress: event.body.streetAddress,
    postalCode: event.body.postalCode,
    country: event.body.country,
  });

  const { customer, error } = await editAddressForCustomer(
    currentCustomer,
    currentAddress,
    event.body.name
  );

  const statusCode = error ? 500 : 200;
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ customer });

  return {
    statusCode,
    body,
  };
};

module.exports.handler = makeHandler({ handler, inputSchema });
