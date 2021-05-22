const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

const { BrandContainer } = require("../entities");
const { executeTransactWrite } = require("../utils");

const createBrand = async () => {
  const brandContainer = new BrandContainer();

  const params = {
    TransactItems: [
      {
        Put: {
          Item: brand.toItem(),
          TableName: process.env.TABLE_NAME,
          ConditionExpression: "attribute_not_exists(PK)",
        },
      },
      {
        Update: {
          Key: brandContainer.key(),
          TableName: process.env.TABLE_NAME,
          UpdateExpression: "ADD #brands :brand",
          ExpressionAttributeNames: {
            "#brands": "Brands",
          },
          ExpressionAttributeValues: {
            ":brand": { SS: [brand.name] },
          },
        },
      },
    ],
  };

  try {
    await executeTransactWrite({ client: dynamodb, params });

    return {
      brand,
    };
  } catch (error) {
    console.error(error);

    let errorMessage = "Could not create brand";
    // If it's a condition check violation, we'll try to indicate which condition failed.
    if (error.code === "TransactionCanceledException") {
      if (error.cancellationReasons[0].Code === "ConditionalCheckFailed") {
        errorMessage = "Brand with this name already exists.";
      }
    }

    return {
      error: errorMessage,
    };
  }
};

module.exports = {
  createBrand,
};
