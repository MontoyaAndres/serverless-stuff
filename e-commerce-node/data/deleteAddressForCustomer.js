const {
  DynamoDBClient,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");

const { customerFromItem } = require("../entities");

const client = new DynamoDBClient();

const deleteAddressForCustomer = async (customer, name) => {
  try {
    const command = new UpdateItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: customer.key(),
      ConditionExpression: "attribute_exists(PK)",
      UpdateExpression: "REMOVE #addresses.#name",
      ExpressionAttributeNames: {
        "#addresses": "Addresses",
        "#name": name,
      },
      ReturnValues: "ALL_NEW",
    });

    const data = await client.send(command);

    console.log(data);

    return {
      customer: customerFromItem(data.Attributes),
    };
  } catch (error) {
    console.error(error);

    let errorMessage = "Could not delete address";

    if (error.code === "ConditionalCheckFailedException") {
      errorMessage = "Customer does not exist.";
    }
    return {
      error: errorMessage,
    };
  }
};

module.exports = {
  deleteAddressForCustomer,
};
