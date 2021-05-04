const { DynamoDBClient, QueryCommand } = require("@aws-sdk/client-dynamodb");
const { customerFromItem, orderFromItem } = require("../entities");

const client = new DynamoDBClient();

const getOrdersForCustomer = async (customer) => {
  try {
    const command = new QueryCommand({
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: "#pk = :pk",
      ExpressionAttributeNames: {
        "#pk": "PK",
      },
      ExpressionAttributeValues: {
        ":pk": customer.key()["PK"],
      },
      ScanIndexForward: false,
    });

    const data = await client.send(command);

    if (data.Items.length === 0) {
      return {
        error: "Customer does not exist.",
      };
    }

    const customerItem = data.Items.shift();
    const custFromItem = customerFromItem(customerItem);
    const orders = data.Items.map((item) => orderFromItem(item));

    return {
      customer: custFromItem,
      orders,
    };
  } catch (error) {
    console.error(error);
    return {
      error: "Could not retrieve customer and orders",
    };
  }
};

module.exports = {
  getOrdersForCustomer,
};
