module.exports.setOrder = (order) => {
  let sqlOrder = "";
  switch (order) {
    case "most":
      sqlOrder = `votes desc`;
      break;
    case "least":
      sqlOrder = "votes asc";
      break;
    case "newest":
      sqlOrder = "time desc";
      break;
    case "oldest":
      sqlOrder = "time asc";
      break;
    default:
      break;
  }
  return sqlOrder;
};

module.exports.setFilter = (filter) => {
  let sqlFilter = "";
  switch (filter) {
    case "day":
      sqlFilter = new Date(Date.now() - 1000 * 60 * 60 * 24);
      break;
    case "week":
      sqlFilter = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);
      break;
    case "month":
      sqlFilter = new Date(Date.now() - 1000 * 60 * 60 * 24 * 31);
      break;
    case "year":
      sqlFilter = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365);
      break;
    case "all":
      sqlFilter = new Date(Date.now() - 1000 * 60 * 60 * 24 * 365 * 100);
      break;
    default:
      break;
  }
  return sqlFilter;
};
