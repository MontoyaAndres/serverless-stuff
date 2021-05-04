const { createCustomer } = require("./createCustomer");
const { getCustomer } = require("./getCustomer");
const { editAddressForCustomer } = require("./editAddressForCustomer");
const { deleteAddressForCustomer } = require("./deleteAddressForCustomer");
const { createOrder } = require("./createOrder");
const { updateStatusForOrder } = require("./updateStatusForOrder");
const { getOrdersForCustomer } = require("./getOrdersForCustomer");
const { getOrder } = require("./getOrder");

module.exports = {
  createCustomer,
  getCustomer,
  editAddressForCustomer,
  deleteAddressForCustomer,
  createOrder,
  updateStatusForOrder,
  getOrdersForCustomer,
  getOrder,
};
