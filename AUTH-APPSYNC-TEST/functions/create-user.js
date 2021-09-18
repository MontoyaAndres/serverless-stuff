const {
  CognitoIdentityProvider,
} = require("@aws-sdk/client-cognito-identity-provider");
const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");

const { USERS_TABLE, USER_POOL_ID } = process.env;
const TEMPORARY_PASSWORD = "1234567890";

const cognitoClient = new CognitoIdentityProvider();
const dynamodbClient = new DynamoDB();

module.exports.handler = async (event) => {
  const {
    identity: { groups },
    arguments: { input },
  } = event;

  if (!groups || groups?.length === 0) {
    throw new Error("Not authorized");
  }

  if (!groups?.includes("Admin")) {
    throw new Error("Not authorized");
  }

  try {
    const currentTime = new Date().toJSON();

    const user = await cognitoClient.adminCreateUser({
      UserPoolId: USER_POOL_ID,
      Username: input.email,
      TemporaryPassword: TEMPORARY_PASSWORD,
      UserAttributes: [
        {
          Name: "email",
          Value: input.email,
        },
      ],
    });

    await dynamodbClient.putItem({
      TableName: USERS_TABLE,
      Item: marshall({
        ...input,
        __typename: "User",
        id: user.User.Username,
        createdAt: currentTime,
        updatedAt: currentTime,
      }),
    });

    return true;
  } catch (error) {
    console.error(error);
    throw new Error(error);
  }
};
