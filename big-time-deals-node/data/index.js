const { createBrand } = require("./createBrand");
const { createDeal } = require("./createDeal");
const {
  getBrandAndLatestDealsForBrand,
} = require("./getBrandAndLatestDealsForBrand");
const { likeBrandForUser } = require("./likeBrandForUser");
const { listBrands } = require("./listBrands");
const { watchBrandForUser } = require("./watchBrandForUser");

module.exports = {
  createBrand,
  createDeal,
  getBrandAndLatestDealsForBrand,
  likeBrandForUser,
  listBrands,
  watchBrandForUser,
};
