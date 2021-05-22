const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

const { dealFromItem } = require("../entities");

const getDeal = async ({ deal }) => {
  try {
    const resp = await dynamodb
      .getItem({
        TableName: process.env.TABLE_NAME,
        Key: deal.key(),
      })
      .promise();

    if (!resp.Item) {
      return {
        error: "Deal does not exist.",
      };
    }

    return {
      deal: dealFromItem(resp.Item),
    };
  } catch (error) {
    console.error(error);

    return {
      error: "Could not retrieve deal",
    };
  }
};

module.exports = {
  getDeal,
};
