const ulid = require("ulid");

class Message {
  constructor({
    username,
    subject,
    message,
    messageId,
    sentAt = new Date(),
    dealId,
    unread = true,
  }) {
    if (!username) {
      throw new Error("Message requires a username");
    }

    if (messageId) {
      this.messageId = messageId;
    } else {
      this.messageId = ulid.ulid();
    }

    this.username = username;
    this.subject = subject;
    this.message = message;
    this.dealId = dealId;
    this.sentAt = sentAt;
    this.unread = unread;
  }

  pk() {
    return { S: `MESSAGES#${this.username.toLowerCase()}` };
  }

  key() {
    return {
      PK: this.pk(),
      SK: { S: `MESSAGES#${this.messageId}` },
    };
  }

  gsi1() {
    // Sparse index pattern where we only include these attributes for unread messages.
    if (this.unread) {
      return {
        GSI1PK: this.pk(),
        GSI1SK: { S: `MESSAGES#${this.messageId}` },
      };
    }
    return {};
  }

  toItem() {
    return {
      ...this.key(),
      ...this.gsi1(),
      Type: { S: "Message" },
      Username: { S: this.username },
      MessageId: { S: this.messageId },
      Subject: { S: this.subject },
      Message: { S: this.message },
      DealId: { S: this.dealId },
      SentAt: { S: this.sentAt.toISOString() },
      Unread: { S: this.unread.toString() },
    };
  }
}

const messageFromItem = (item) => {
  return new Message({
    username: item.Username.S,
    messageId: item.MessageId.S,
    subject: item.Subject.S,
    message: item.Message.S,
    dealId: item.DealId.S,
    sentAt: new Date(item.SentAt.S),
    unread: item.Unread.S === "true" ? true : false,
  });
};

module.exports = {
  Message,
  messageFromItem,
};
