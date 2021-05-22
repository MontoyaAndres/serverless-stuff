const truncateTimestamp = (timestamp) => {
  return new Date(
    timestamp.getFullYear(),
    timestamp.getMonth(),
    timestamp.getDate()
  );
};

module.exports = {
  truncateTimestamp,
};
