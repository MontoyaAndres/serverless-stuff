const {
  DynamoDBClient,
  TransactWriteItemsCommand,
} = require("@aws-sdk/client-dynamodb");

const { CustomerEmail } = require("../entities");

const client = new DynamoDBClient();

const createCustomer = async (customer) => {
  const customerEmail = new CustomerEmail({
    email: customer.email,
    username: customer.username,
  });

  try {
    const params = {
      TransactItems: [
        {
          Put: {
            Item: customer.toItem(),
            TableName: process.env.TABLE_NAME,
            ConditionExpression: "attribute_not_exists(PK)",
          },
        },
        {
          Put: {
            Item: customerEmail.toItem(),
            TableName: process.env.TABLE_NAME,
            ConditionExpression: "attribute_not_exists(PK)",
          },
        },
      ],
    };

    const command = new TransactWriteItemsCommand(params);

    const data = await client.send(command);

    console.log(data);

    return customer;
  } catch (error) {
    console.error(error);

    let errorMessage = "Could not create customer";

    if (error.code === "TransactionCanceledException") {
      if (error.cancellationReasons[0].Code === "ConditionalCheckFailed") {
        errorMessage = "Customer with this username already exists.";
      } else if (
        error.cancellationReasons[1].Code === "ConditionalCheckFailed"
      ) {
        errorMessage = "Customer with this email already exists.";
      }
    }

    return {
      error: errorMessage,
    };
  }
};

module.exports = {
  createCustomer,
};
