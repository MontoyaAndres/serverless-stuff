const { Deal, dealFromItem, dealGSI1PK } = require("./deals");
const {
  Brand,
  BrandContainer,
  brandFromItem,
  brandContainerFromItem,
} = require("./brands");
const { Category, categoryFromItem } = require("./categories");
const { FrontPage, EditorsChoice, PAGES, pageFromItem } = require("./pages");
const { User, userFromItem } = require("./users");
const { Message, messageFromItem } = require("./messages");
const {
  BrandLike,
  BrandWatch,
  CategoryLike,
  CategoryWatch,
} = require("./interactions");

module.exports = {
  Deal,
  dealFromItem,
  dealGSI1PK,
  Brand,
  BrandContainer,
  brandFromItem,
  brandContainerFromItem,
  Category,
  categoryFromItem,
  FrontPage,
  PAGES,
  pageFromItem,
  EditorsChoice,
  User,
  userFromItem,
  Message,
  messageFromItem,
  BrandLike,
  BrandWatch,
  CategoryLike,
  CategoryWatch,
};
