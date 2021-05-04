class Customer {
  constructor({ username, email, name, addresses = {} }) {
    this.username = username;
    this.email = email;
    this.name = name;
    this.addresses = addresses;
  }

  key() {
    return {
      PK: { S: `CUSTOMER#${this.username}` },
      SK: { S: `CUSTOMER#${this.username}` },
    };
  }

  toItem() {
    return {
      ...this.key(),
      Type: { S: "Customer" },
      Username: { S: this.username },
      Email: { S: this.email },
      Name: { S: this.name },
      Addresses: { M: this.formatAddresses() },
    };
  }

  formatAddresses() {
    const addresses = {};

    for (let [name, address] of Object.entries(this.addresses)) {
      addresses[name] = address.toMap();
    }

    return addresses;
  }
}

class CustomerEmail {
  constructor({ email, username }) {
    this.email = email;
    this.username = username;
  }

  key() {
    return {
      PK: { S: `CUSTOMEREMAIL#${this.email}` },
      SK: { S: `CUSTOMEREMAIL#${this.email}` },
    };
  }

  toItem() {
    return {
      ...this.key(),
      Type: { S: "CustomerEmail" },
      Email: { S: this.email },
      Username: { S: this.username },
    };
  }
}

class Address {
  constructor({ streetAddress, postalCode, country }) {
    this.streetAddress = streetAddress;
    this.postalCode = postalCode;
    this.country = country;
  }

  toMap() {
    return {
      M: {
        StreetAddress: { S: this.streetAddress },
        PostalCode: { S: this.postalCode },
        Country: { S: this.country },
      },
    };
  }
}

const parseAddresses = (addresses) => {
  const parsed = {};

  for (let [name, object] of Object.entries(addresses)) {
    parsed[name] = new Address({
      streetAddress: object.M.StreetAddress.S,
      postalCode: object.M.PostalCode.S,
      country: object.M.Country.S,
    });
  }

  return parsed;
};

const customerFromItem = (attributes) => {
  return new Customer({
    username: attributes.Username.S,
    email: attributes.Email.S,
    name: attributes.Name.S,
    addresses: parseAddresses(attributes.Addresses.M),
  });
};

module.exports = {
  Customer,
  CustomerEmail,
  Address,
  customerFromItem,
};
