const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

const createDeal = async (deal) => {
  try {
    await dynamodb
      .putItem({
        TableName: process.env.TABLE_NAME,
        Item: deal.toItem(),
        ConditionExpression: "attribute_not_exists(PK)",
      })
      .promise();

    return {
      deal,
    };
  } catch (error) {
    console.error(error);

    let errorMessage = "Could not create deal";
    // If it's a condition check violation, we'll try to indicate which condition failed.
    if (error.code === "ConditionalCheckFailedException") {
      errorMessage = "Deal with this ID already exists.";
    }
    return {
      error: errorMessage,
    };
  }
};

module.exports = {
  createDeal,
};
