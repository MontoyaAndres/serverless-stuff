const { truncateTimestamp } = require("../utils");

class Brand {
  constructor({ name, logoUrl, likeCount = 0, watchCount = 0 }) {
    if (!name) {
      throw new Error("Brand requires a name");
    }

    this.name = name;
    this.logoUrl = logoUrl;
    this.likeCount = parseInt(likeCount);
    this.watchCount = parseInt(watchCount);
  }

  key() {
    return {
      PK: { S: `BRAND#${this.name.toUpperCase()}` },
      SK: { S: `BRAND#${this.name.toUpperCase()}` },
    };
  }

  // Used for fetching latest Deals for a Brand
  // See Deal object
  gsi2pk(timestamp) {
    return {
      S: `BRAND#${this.name.toUpperCase()}#${truncateTimestamp(
        timestamp
      ).toISOString()}`,
    };
  }

  toItem() {
    return {
      ...this.key(),
      Type: { S: "Brand" },
      BrandName: { S: this.name },
      BrandLogoUrl: { S: this.logoUrl },
      LikeCount: { N: this.likeCount.toString() },
      WatchCount: { N: this.watchCount.toString() },
    };
  }
}

const brandFromItem = (item) => {
  return new Brand({
    name: item.BrandName.S,
    logoUrl: item.BrandLogoUrl.S,
    likeCount: item.LikeCount.N,
    watchCount: item.WatchCount.N,
  });
};

class BrandContainer {
  brands = [];

  key() {
    return {
      PK: { S: `BRANDS` },
      SK: { S: `BRANDS` },
    };
  }

  toItem() {
    return {
      ...this.key(),
      Type: { S: "BrandContainer" },
      Brands: { SS: this.brands },
    };
  }
}

const brandContainerFromItem = (item) => {
  let container = new BrandContainer();
  container.brands = item.Brands.SS;

  return container;
};

module.exports = {
  Brand,
  brandFromItem,
  BrandContainer,
  brandContainerFromItem,
};
