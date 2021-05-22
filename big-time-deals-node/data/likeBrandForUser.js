const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

const { Brand, User } = require("../entities");
const { executeTransactWrite } = require("../utils");

const likeBrandForUser = async ({ brandLike }) => {
  const brand = new Brand({
    name: brandLike.name,
  });
  const user = new User({
    username: brandLike.username,
  });

  const params = {
    TransactItems: [
      {
        Put: {
          Item: brandLike.toItem(),
          TableName: process.env.TABLE_NAME,
          ConditionExpression: "attribute_not_exists(PK)",
        },
      },
      {
        Update: {
          Key: brand.key(),
          TableName: process.env.TABLE_NAME,
          ConditionExpression: "attribute_exists(PK)",
          UpdateExpression: "SET #likeCount = #likeCount + :inc",
          ExpressionAttributeNames: {
            "#likeCount": "LikeCount",
          },
          ExpressionAttributeValues: {
            ":inc": { N: "1" },
          },
        },
      },
      {
        ConditionCheck: {
          TableName: process.env.TABLE_NAME,
          Key: user.key(),
          ConditionExpression: "attribute_exists(PK)",
        },
      },
    ],
  };

  try {
    await executeTransactWrite({ client: dynamodb, params });

    return {};
  } catch (error) {
    console.error(error);

    let errorMessage = "Could not like brand";
    // If it's a condition check violation, we'll try to indicate which condition failed.
    if (error.code === "TransactionCanceledException") {
      if (error.cancellationReasons[0].Code === "ConditionalCheckFailed") {
        errorMessage = "User has already liked this brand.";
      } else if (
        error.cancellationReasons[1].Code === "ConditionalCheckFailed"
      ) {
        errorMessage = "Brand does not exist.";
      } else if (
        error.cancellationReasons[2].Code === "ConditionalCheckFailed"
      ) {
        errorMessage = "User does not exist.";
      }
    }

    return {
      error: errorMessage,
    };
  }
};

module.exports = {
  likeBrandForUser,
};
