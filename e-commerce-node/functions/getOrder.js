const { makeHandler } = require("../utils");
const { getOrder } = require("../data");
const { Order } = require("../entities");

const inputSchema = {
  type: "object",
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        username: { type: "string" },
        orderId: { type: "string" },
      },
      required: ["username", "orderId"],
    },
  },
  required: ["pathParameters"],
};

const handler = async (event) => {
  const currentOrder = new Order({
    orderId: event.pathParameters.orderId,
    username: event.pathParameters.username,
  });

  const { order, error } = await getOrder(currentOrder);

  const statusCode = error ? 500 : 200;
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ order });

  return {
    statusCode,
    body,
  };
};

module.exports.handler = makeHandler({ handler, inputSchema });
