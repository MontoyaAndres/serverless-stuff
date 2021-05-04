const { makeHandler } = require("../utils");
const { updateStatusForOrder } = require("../data");
const { Order } = require("../entities");

const inputSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        status: { type: "string" },
      },
      required: ["status"],
    },
    pathParameters: {
      type: "object",
      properties: {
        username: { type: "string" },
        orderId: { type: "string" },
      },
      required: ["username", "orderId"],
    },
  },
  required: ["body", "pathParameters"],
};

const handler = async (event) => {
  const currentOrder = new Order({
    orderId: event.pathParameters.orderId,
    username: event.pathParameters.username,
    status: event.body.status,
  });

  const { order, error } = await updateStatusForOrder(currentOrder);

  const statusCode = error ? 500 : 200;
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ order });

  return {
    statusCode,
    body,
  };
};

module.exports.handler = makeHandler({ handler, inputSchema });
