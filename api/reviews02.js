const reviews = require('./reviews');

module.exports = async function reviews02(req, res) {
  return reviews.handle(req, res, 'review02');
};
