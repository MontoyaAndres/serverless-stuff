const ulid = require("ulid");

const STATUSES = ["PLACED", "PICKED", "SHIPPED", "DELIVERED", "CANCELLED"];

class Order {
  constructor({
    username,
    orderId,
    address,
    createdAt = new Date(),
    status = "PLACED",
    totalAmount,
    numberItems,
    items = [],
  }) {
    if (!username) {
      throw new Error("Order must include a username");
    }

    this.username = username;

    if (orderId) {
      this.orderId = orderId;
    } else {
      this.orderId = ulid.ulid();
    }

    this.address = address;
    this.createdAt = createdAt;

    if (status && !STATUSES.includes(status)) {
      throw new Error(`Invalid status: ${status}`);
    }

    this.status = status;
    this.totalAmount = totalAmount;
    this.numberItems = numberItems;

    if (items.length > 0) {
      this.items = items.map((item) => {
        return new OrderItem({
          orderId: this.orderId,
          itemId: item.itemId,
          description: item.description,
          price: item.price,
          amount: item.amount,
        });
      });
      this.numberItems = items.length;
      this.totalAmount = items.reduce((acc, cur) => {
        return acc + cur.price;
      }, 0);
    }
  }

  key() {
    return {
      PK: { S: `CUSTOMER#${this.username}` },
      SK: { S: `#ORDER#${this.orderId}` },
    };
  }

  gsi1() {
    return {
      GSI1PK: { S: `ORDER#${this.orderId}` },
      GSI1SK: { S: `ORDER#${this.orderId}` },
    };
  }

  toItem() {
    return {
      ...this.key(),
      ...this.gsi1(),
      Type: { S: "Order" },
      Username: { S: this.username },
      OrderId: { S: this.orderId },
      Address: { S: JSON.stringify(this.address) },
      CreatedAt: { S: this.createdAt.toISOString() },
      Status: { S: this.status },
      TotalAmount: { N: this.totalAmount.toString() },
      NumberItems: { N: this.numberItems.toString() },
    };
  }
}

const orderFromItem = (attributes) => {
  return new Order({
    username: attributes.Username.S,
    orderId: attributes.OrderId.S,
    address: JSON.parse(attributes.Address.S),
    createdAt: attributes.CreatedAt.S,
    status: attributes.Status.S,
    totalAmount: attributes.TotalAmount.N,
    numberItems: attributes.NumberItems.N,
  });
};

class OrderItem {
  constructor({ orderId, itemId, description, price, amount }) {
    if (!orderId) {
      throw new Error("Order item must include an orderId");
    }

    if (!itemId) {
      throw new Error("Order item must include an itemId");
    }

    this.orderId = orderId;
    this.itemId = itemId;
    this.description = description;
    this.price = price;
    this.amount = amount;
  }

  key() {
    return {
      PK: { S: `ORDER#${this.orderId}#ITEM#${this.itemId}` },
      SK: { S: `ORDER#${this.orderId}#ITEM#${this.itemId}` },
    };
  }

  gsi1() {
    return {
      GSI1PK: { S: `ORDER#${this.orderId}` },
      GSI1SK: { S: `ITEM#${this.itemId}` },
    };
  }

  toItem() {
    return {
      ...this.key(),
      ...this.gsi1(),
      Type: { S: "OrderItem" },
      OrderId: { S: this.orderId },
      ItemId: { S: this.itemId },
      Description: { S: this.description },
      Price: { N: this.price.toString() },
      Amount: { N: this.amount.toString() },
      TotalCost: { N: (this.price * this.amount).toString() },
    };
  }
}

const orderItemFromItem = (attributes) => {
  return new OrderItem({
    orderId: attributes.OrderId.S,
    itemId: attributes.ItemId.S,
    description: attributes.Description.S,
    price: attributes.Price.N,
    amount: attributes.Amount.N,
    totalCost: attributes.TotalCost.N,
  });
};

module.exports = {
  Order,
  OrderItem,
  orderFromItem,
  orderItemFromItem,
};
