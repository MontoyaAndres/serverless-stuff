const CATEGORIES = {
  food: "Food & Drink",
  bathroom: "Bathroom",
  jewelry: "Jewelry",
  sports: "Sports",
  tech: "Tech",
  auto: "Auto",
  entertainment: "Entertainment",
  travel: "Travel",
};

const getCategoryName = (name) => {
  return CATEGORIES[name.toLowerCase()];
};

module.exports = {
  CATEGORIES,
  getCategoryName,
};
