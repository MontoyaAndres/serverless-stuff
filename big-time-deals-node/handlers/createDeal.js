const { makeHandler } = require("../utils");
const { createDeal } = require("../data");
const { Deal } = require("../entities");

const inputSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        title: { type: "string" },
        link: { type: "string" },
        price: { type: "number" },
        category: { type: "string" },
        brand: { type: "string" },
      },
      required: ["title", "link", "price", "category", "brand"],
    },
  },
  required: ["body"],
};

const handler = async (event) => {
  const deal = new Deal({
    title: event.body.title,
    link: event.body.link,
    price: event.body.price,
    category: event.body.category,
    brand: event.body.brand,
  });

  const { error } = await createDeal(deal);

  const statusCode = error ? 500 : 200;
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ deal });

  return {
    statusCode,
    body,
  };
};

module.exports.handler = makeHandler({ handler, inputSchema });
