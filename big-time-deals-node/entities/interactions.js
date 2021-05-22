class Interaction {
  constructor({ username, name }) {
    if (!name) {
      throw new Error(`${this.type} requires a target name`);
    }

    this.name = name;
    this.username = username;
  }

  key() {
    return {
      PK: {
        S: `${this.type.toUpperCase()}#${this.name.toLowerCase()}#${this.username.toLowerCase()}`,
      },
      SK: {
        S: `${this.type.toUpperCase()}#${this.name.toLowerCase()}#${this.username.toLowerCase()}`,
      },
    };
  }

  toItem() {
    return {
      ...this.key(),
      Type: { S: this.type },
      Username: { S: this.username },
      Name: { S: this.name },
    };
  }
}

class Like extends Interaction {
  constructor({ username, name }) {
    if (!username) {
      throw new Error(`${this.type} requires a username`);
    }

    super({ username, name });
  }
}

class Watch extends Interaction {
  pk() {
    return { S: `${this.type.toUpperCase()}#${this.name.toLowerCase()}` };
  }

  key() {
    return {
      PK: this.pk(),
      SK: { S: `USER#${this.username.toLowerCase()}` },
    };
  }
}

class BrandLike extends Like {
  type = "BrandLike";
}

class BrandWatch extends Watch {
  type = "BrandWatch";
}

class CategoryLike extends Like {
  type = "CategoryLike";
}

class CategoryWatch extends Watch {
  type = "CategoryWatch";
}

module.exports = {
  BrandLike,
  BrandWatch,
  CategoryLike,
  CategoryWatch,
};
