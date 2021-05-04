const { makeHandler } = require("../utils");
const { createOrder } = require("../data");
const { Customer, Order } = require("../entities");

const inputSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        address: {
          type: "object",
          properties: {
            streetAddress: { type: "string" },
            postalCode: { type: "string" },
            country: { type: "string" },
          },
          required: ["streetAddress", "postalCode", "country"],
        },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              itemId: { type: "string" },
              description: { type: "string" },
              price: { type: "number" },
              amount: { type: "integer" },
            },
            required: ["itemId", "description", "price", "amount"],
          },
          minItems: 1,
        },
      },
      required: ["items", "address"],
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
  const currentOrder = new Order({
    username: currentCustomer.username,
    address: event.body.address,
    items: event.body.items,
  });

  const { order, error } = await createOrder(currentOrder);

  const statusCode = error ? 500 : 200;
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ order });

  return {
    statusCode,
    body,
  };
};

module.exports.handler = makeHandler({ handler, inputSchema });
