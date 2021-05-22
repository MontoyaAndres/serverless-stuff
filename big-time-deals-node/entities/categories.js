const { truncateTimestamp, CATEGORIES } = require("../utils");

class Category {
  constructor({ name, featuredDeals = [], likeCount = 0, watchCount = 0 }) {
    if (!name) {
      throw new Error("Category requires a name");
    }

    if (!Object.values(CATEGORIES).includes(name)) {
      throw new Error(`Invalid category: ${name}`);
    }

    this.name = name;
    this.featuredDeals = featuredDeals;
    this.likeCount = parseInt(likeCount);
    this.watchCount = parseInt(watchCount);
  }

  key() {
    return {
      PK: { S: `CATEGORY#${this.name.toUpperCase()}` },
      SK: { S: `CATEGORY#${this.name.toUpperCase()}` },
    };
  }

  // Used for fetching latest Deals for a Category
  // See Deal object
  gsi3pk(timestamp) {
    return {
      S: `CATEGORY#${this.name.toUpperCase()}#${truncateTimestamp(
        timestamp
      ).toISOString()}`,
    };
  }

  toItem() {
    return {
      ...this.key(),
      Type: { S: "Category" },
      CategoryName: { S: this.name },
      FeaturedDeals: { S: JSON.stringify(this.featuredDeals) },
      LikeCount: { N: this.likeCount.toString() },
      WatchCount: { N: this.watchCount.toString() },
    };
  }
}

const categoryFromItem = (item) => {
  return new Category({
    name: item.CategoryName.S,
    featuredDeals: JSON.parse(item.FeaturedDeals.S),
    likeCount: item.LikeCount.N,
    watchCount: item.WatchCount.N,
  });
};

module.exports = {
  Category,
  categoryFromItem,
};
