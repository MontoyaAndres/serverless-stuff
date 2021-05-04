const {
  DynamoDBClient,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");

const { customerFromItem } = require("../entities");

const client = new DynamoDBClient();

const editAddressForCustomer = async (customer, address, name) => {
  try {
    const command = new UpdateItemCommand({
      TableName: process.env.TABLE_NAME,
      Key: customer.key(),
      ConditionExpression: "attribute_exists(PK)",
      UpdateExpression: "SET #addresses.#name = :address",
      ExpressionAttributeNames: {
        "#addresses": "Addresses",
        "#name": name,
      },
      ExpressionAttributeValues: {
        ":address": address.toMap(),
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

    let errorMessage = "Could not edit address";

    if (error.code === "ConditionalCheckFailedException") {
      errorMessage = "Customer does not exist.";
    }
    return {
      error: errorMessage,
    };
  }
};

module.exports = {
  editAddressForCustomer,
};
