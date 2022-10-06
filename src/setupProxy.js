const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = {
  target: 'https://back-in-stock-topic.westeurope-1.eventgrid.azure.net/',
  changeOrigin: true,
};

//https://out-of-stock-order-topic.westeurope-1.eventgrid.azure.net/

module.exports = function (app) {
  app.use('/api/events', createProxyMiddleware(proxy));
};
