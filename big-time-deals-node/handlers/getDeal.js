const { makeHandler } = require("../utils");
const { getDeal } = require("../data");
const { Deal } = require("../entities");

const inputSchema = {
  type: "object",
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        dealId: { type: "string" },
      },
      required: ["dealId"],
    },
  },
  required: ["pathParameters"],
};

const handler = async (event) => {
  const currentDeal = new Deal({
    dealId: event.pathParameters.dealId,
  });

  const { deal, error } = await getDeal({ deal: currentDeal });

  const statusCode = error ? 500 : 200;
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ deal });

  return {
    statusCode,
    body,
  };
};

module.exports.handler = makeHandler({ handler, inputSchema });
