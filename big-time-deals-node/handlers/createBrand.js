const { makeHandler } = require("../utils");
const { createBrand } = require("../data");
const { Brand } = require("../entities");

const inputSchema = {
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        name: { type: "string" },
        logoUrl: { type: "string" },
      },
      required: ["name", "logoUrl"],
    },
  },
  required: ["body"],
};

const handler = async (event) => {
  const brand = new Brand({
    name: event.body.name,
    logoUrl: event.body.logoUrl,
  });

  const { error } = await createBrand({ brand });

  const statusCode = error ? 500 : 200;
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ brand });

  return {
    statusCode,
    body,
  };
};

module.exports.handler = makeHandler({ handler, inputSchema });
