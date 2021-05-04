const {
  DynamoDBClient,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");

const { orderFromItem } = require("../entities");

const client = new DynamoDBClient();

const updateStatusForOrder = async (order) => {
  try {
    const command = new UpdateItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: order.key(),
      ConditionExpression: "attribute_exists(PK)",
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: {
        "#status": "Status",
      },
      ExpressionAttributeValues: {
        ":status": { S: order.status },
      },
      ReturnValues: "ALL_NEW",
    });

    const data = await client.send(command);

    console.log(data);

    return {
      order: orderFromItem(data.Attributes),
    };
  } catch (error) {
    console.error(error);

    let errorMessage = "Could not update status for order";

    if (error.code === "ConditionalCheckFailedException") {
      errorMessage = "Order does not exist.";
    }
    return {
      error: errorMessage,
    };
  }
};

module.exports = {
  updateStatusForOrder,
};
