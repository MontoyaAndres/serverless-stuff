const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const { customerFromItem } = require("../entities");

const client = new DynamoDBClient();

const getCustomer = async (customer) => {
  try {
    const command = new GetItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: customer.key(),
    });

    const data = await client.send(command);

    if (!data.Item) {
      return {
        error: "Customer does not exist.",
      };
    }

    console.log(data.Item);

    return {
      customer: customerFromItem(data.Item),
    };
  } catch (error) {
    console.error(error);

    return {
      error: "Could not retrieve customer",
    };
  }
};

module.exports = {
  getCustomer,
};
