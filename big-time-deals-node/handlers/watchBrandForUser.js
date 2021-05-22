const { makeHandler } = require("../utils");
const { watchBrandForUser } = require("../data");
const { BrandWatch } = require("../entities");

const inputSchema = {
  type: "object",
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        name: { type: "string" },
        username: { type: "string" },
      },
      required: ["name", "username"],
    },
  },
  required: ["pathParameters"],
};

const handler = async (event) => {
  const brandWatch = new BrandWatch({
    username: event.pathParameters.username,
    name: event.pathParameters.name,
  });

  const { error } = await watchBrandForUser({ brandWatch });

  const statusCode = error ? 500 : 200;
  const body = error
    ? JSON.stringify({ error })
    : JSON.stringify({ message: "OK" });

  return {
    statusCode,
    body,
  };
};

module.exports.handler = makeHandler({ handler, inputSchema });
