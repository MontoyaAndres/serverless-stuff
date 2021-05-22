const ulid = require("ulid");
const { truncateTimestamp, CATEGORIES } = require("../utils");

const dealGSI1PK = (timestamp) => {
  return { S: `DEALS#${truncateTimestamp(timestamp).toISOString()}` };
};

class Deal {
  constructor({
    dealId,
    title,
    link,
    price,
    category,
    brand,
    createdAt = new Date(),
  }) {
    if (dealId) {
      this.dealId = dealId;
    } else {
      this.dealId = ulid.ulid();
    }

    this.title = title;
    this.link = link;
    this.price = price;

    if (category && !Object.values(CATEGORIES).includes(category)) {
      throw new Error(`Invalid category: ${category}`);
    }

    this.category = category;
    this.brand = brand;
    this.createdAt = createdAt;
  }

  key() {
    return {
      PK: { S: `DEAL#${this.dealId}` },
      SK: { S: `DEAL#${this.dealId}` },
    };
  }

  gsi1() {
    return {
      GSI1PK: dealGSI1PK(this.createdAt),
      GSI1SK: { S: `DEAL#${this.dealId}` },
    };
  }

  gsi2() {
    if (!this.brand) {
      throw new Error("Brand must be set if using GSI2");
    }

    return {
      GSI2PK: {
        S: `BRAND#${this.brand.toUpperCase()}#${truncateTimestamp(
          this.createdAt
        ).toISOString()}`,
      },
      GSI2SK: { S: `DEAL#${this.dealId}` },
    };
  }

  gsi3() {
    if (!this.category) {
      throw new Error("Category must be set if using GSI3");
    }

    return {
      GSI3PK: {
        S: `CATEGORY#${this.category.toUpperCase()}#${truncateTimestamp(
          this.createdAt
        ).toISOString()}`,
      },
      GSI3SK: { S: `DEAL#${this.dealId}` },
    };
  }

  toItem() {
    return {
      ...this.key(),
      ...this.gsi1(),
      ...this.gsi2(),
      ...this.gsi3(),
      Type: { S: "Deal" },
      DealId: { S: this.dealId },
      Title: { S: this.title },
      Link: { S: this.link },
      Price: { N: this.price.toString() },
      Category: { S: this.category },
      Brand: { S: this.brand },
      CreatedAt: { S: this.createdAt.toISOString() },
    };
  }
}

const dealFromItem = (attributes) => {
  return new Deal({
    dealId: attributes.DealId.S,
    title: attributes.Title.S,
    link: attributes.Link.S,
    price: parseFloat(attributes.Price.N),
    category: attributes.Category.S,
    brand: attributes.Brand.S,
    createdAt: new Date(attributes.CreatedAt.S),
  });
};

module.exports = {
  Deal,
  dealFromItem,
  dealGSI1PK,
};
