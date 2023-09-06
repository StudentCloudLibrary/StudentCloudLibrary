const { createProxyMiddleware } = require('http-proxy-middleware');

const serverIP = "3.14.11.216";
const target = `http://${serverIP}:5000`;

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
    })
  );
};