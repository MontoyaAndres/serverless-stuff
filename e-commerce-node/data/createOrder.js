const {
  DynamoDBClient,
  TransactWriteItemsCommand,
} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient();

const createOrder = async (order) => {
  const transactItems = [
    {
      Put: {
        Item: order.toItem(),
        TableName: process.env.TABLE_NAME,
        ConditionExpression: "attribute_not_exists(PK)",
      },
    },
  ];
  order.items.forEach((item) => {
    transactItems.push({
      Put: {
        Item: item.toItem(),
        TableName: process.env.TABLE_NAME,
      },
    });
  });

  try {
    const params = {
      TransactItems: transactItems,
    };

    const command = new TransactWriteItemsCommand(params);

    const data = await client.send(command);

    console.log(data);

    return {
      order,
    };
  } catch (error) {
    console.error(error);

    let errorMessage = "Could not create order";

    if (error.code === "TransactionCanceledException") {
      if (error.cancellationReasons[0].Code === "ConditionalCheckFailed") {
        errorMessage = "Order Id already exists for this customer.";
      }
    }

    return {
      error: errorMessage,
    };
  }
};

module.exports = {
  createOrder,
};
