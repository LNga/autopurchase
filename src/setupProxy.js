const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = {
  target: 'https://out-of-stock-order-topic.westeurope-1.eventgrid.azure.net/',
  changeOrigin: true,
};
module.exports = function (app) {
  app.use('/api/events', createProxyMiddleware(proxy));
};
