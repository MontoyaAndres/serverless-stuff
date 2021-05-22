class User {
  constructor({ username, name, createdAt = new Date() }) {
    if (!username) {
      throw new Error("User requires a username");
    }

    this.username = username;
    this.name = name;
    this.createdAt = createdAt;
  }

  key() {
    return {
      PK: { S: `USER#${this.username.toLowerCase()}` },
      SK: { S: `USER#${this.username.toLowerCase()}` },
    };
  }

  userIndex() {
    return {
      UserIndex: { S: `USER#${this.username.toLowerCase()}` },
    };
  }

  toItem() {
    return {
      ...this.key(),
      ...this.userIndex(),
      Type: { S: "User" },
      Username: { S: this.username },
      Name: { S: this.name },
      CreatedAt: { S: this.createdAt.toISOString() },
    };
  }
}

const userFromItem = (item) => {
  return new User({
    username: item.Username.S,
    name: item.Name.S,
    createdAt: new Date(item.CreatedAt.S),
  });
};

module.exports = {
  User,
  userFromItem,
};
