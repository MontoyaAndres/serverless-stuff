const AWS = require("aws-sdk");
const dynamodb = new AWS.DynamoDB();

const { brandFromItem, dealFromItem } = require("../entities");

const getBrandAndLatestDealsForBrand = async ({ brand }) => {
  const brandPromise = getBrand({ brand });
  const dealsPromise = getLatestDealsForBrand({ brand });

  try {
    const [brand, deals] = await Promise.all([brandPromise, dealsPromise]);
    return {
      ...brand,
      ...deals,
    };
  } catch (error) {
    console.error(error);

    return {
      error: "Could not retrieve brand.",
    };
  }
};

const getBrand = async ({ brand }) => {
  const response = await dynamodb
    .getItem({
      TableName: process.env.TABLE_NAME,
      Key: brand.key(),
    })
    .promise();

  if (!response.Item) {
    throw new Error("Brand does not exist.");
  }

  return {
    brand: brandFromItem(response.Item),
  };
};

const getLatestDealsForBrand = async ({
  brand,
  createdAt = new Date(),
  limit = 25,
  count = 0,
}) => {
  let deals = [];

  const response = await dynamodb
    .query({
      TableName: process.env.TABLE_NAME,
      IndexName: "GSI2",
      KeyConditionExpression: "#gsi2pk = :gsi2pk",
      ExpressionAttributeNames: {
        "#gsi2pk": "GSI2PK",
      },
      ExpressionAttributeValues: {
        ":gsi2pk": brand.gsi2pk(createdAt),
      },
      ScanIndexForward: false,
      Limit: limit,
    })
    .promise();

  if (response.Items) {
    response.Items.forEach((item) => {
      deals.push(dealFromItem(item));
    });
  }

  if (deals.length < limit && count < 5) {
    const params = {
      brand,
      createdAt: new Date(createdAt.setDate(createdAt.getDate() - 1)),
      limit: limit - deals.length,
      count: count + 1,
    };

    const { deals: moreDeals } = await getLatestDealsForBrand(params);
    deals = deals.concat(moreDeals);
  }

  return {
    deals,
  };
};

module.exports = {
  getBrandAndLatestDealsForBrand,
};
