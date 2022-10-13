const { createProxyMiddleware } = require('http-proxy-middleware');
const proxy = {
  target: process.env.REACT_APP_OUT_OF_STOCK_URL,
  changeOrigin: true,
};

const proxy2 = {
  target: process.env.REACT_APP_BACK_IN_STOCK_URL,
  changeOrigin: true,
};

module.exports = function (app) {
  app.use('/api/events', createProxyMiddleware(proxy));
  app.use('/api2/events', createProxyMiddleware(proxy2));
};
