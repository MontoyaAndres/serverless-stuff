const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { orderFromItem, orderItemFromItem } = require("../entities");

const client = new DynamoDBClient();

const getOrder = async (order) => {
  try {
    const command = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      IndexName: "GSI1",
      KeyConditionExpression: "#gsi1pk = :gsi1pk",
      ExpressionAttributeNames: {
        "#gsi1pk": "GSI1PK",
      },
      ExpressionAttributeValues: {
        ":gsi1pk": order.gsi1()["GSI1PK"],
      },
      ScanIndexForward: false,
    });

    const data = await client.send(command);

    if (data.Items.length === 0) {
      return {
        error: "Order does not exist.",
      };
    }

    const orderItem = data.Items.shift();
    const ordFromItem = orderFromItem(orderItem);
    const orderItems = data.Items.map((item) => orderItemFromItem(item));
    ordFromItem.items = orderItems;

    return {
      order: ordFromItem,
    };
  } catch (error) {
    console.error(error);

    return {
      error: "Could not retrieve order",
    };
  }
};

module.exports = {
  getOrder,
};
