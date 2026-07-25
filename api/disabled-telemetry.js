module.exports = function disabledTelemetry(_request, response) {
  response.status(200).setHeader('Content-Type', 'application/json').end('{}');
};
