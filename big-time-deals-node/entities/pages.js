class Page {
  constructor({ featuredDeals = [] }) {
    this.featuredDeals = featuredDeals;
  }

  toItem() {
    return {
      ...this.key(),
      Type: { S: "Page" },
      FeaturedDeals: { S: JSON.stringify(this.featuredDeals) },
    };
  }
}

class FrontPage extends Page {
  key() {
    return {
      PK: { S: "FRONTPAGE" },
      SK: { S: "FRONTPAGE" },
    };
  }
}

class EditorsChoice extends Page {
  key() {
    return {
      PK: { S: "EDITORPAGE" },
      SK: { S: "EDITORPAGE" },
    };
  }
}

const PAGES = {
  front: FrontPage,
  editor: EditorsChoice,
};

const pageFromItem = ({ item, type }) => {
  const cls = PAGES[type.toLowerCase()];

  return new cls({
    featuredDeals: JSON.parse(item.FeaturedDeals.S),
  });
};

module.exports = {
  FrontPage,
  EditorsChoice,
  PAGES,
  pageFromItem,
};
