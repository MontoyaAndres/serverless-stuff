const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

const { BrandContainer, brandContainerFromItem } = require("../entities");

const listBrands = async () => {
  let container = new BrandContainer();

  try {
    const resp = await dynamodb
      .getItem({
        TableName: process.env.TABLE_NAME,
        Key: container.key(),
      })
      .promise();

    if (resp.Item) {
      container = brandContainerFromItem(resp.Item);
    }

    return {
      brands: container.brands,
    };
  } catch (error) {
    console.error(error);

    return {
      error: "Could not retrieve brands",
    };
  }
};

module.exports = {
  listBrands,
};
