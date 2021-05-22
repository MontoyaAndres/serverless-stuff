const { makeHandler } = require("../utils");
const { listBrands } = require("../data");

const handler = async () => {
  const { brands, error } = await listBrands();

  const statusCode = error ? 500 : 200;
  const body = error ? JSON.stringify({ error }) : JSON.stringify({ brands });

  return {
    statusCode,
    body,
  };
};

module.exports.handler = makeHandler({ handler });
