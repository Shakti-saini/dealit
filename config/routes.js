/**
 * Import Route files and set in express middleware
 */

exports.set_routes = (app) => {
  // eslint-disable-next-line global-require
  const users = require('../api/routes/users');
  // eslint-disable-next-line global-require
  const categories = require('../api/routes/category');
  // eslint-disable-next-line global-require
  const products = require('../api/routes/product');
  // eslint-disable-next-line global-require
  const brands = require('../api/routes/brand');
  // eslint-disable-next-line global-require
  const blogs = require('../api/routes/blog');
  // eslint-disable-next-line global-require
  const pages = require('../api/routes/page');
  // eslint-disable-next-line global-require
  const banners = require('../api/routes/banner');
  // eslint-disable-next-line global-require
  const vendor = require('../api/routes/vendor');
  // eslint-disable-next-line global-require
  const review = require('../api/routes/review');
  // eslint-disable-next-line global-require
  const cart = require('../api/routes/cart');
  // eslint-disable-next-line global-require
  const address = require('../api/routes/address');
  // eslint-disable-next-line global-require
  const front = require('../api/routes/home');
  // eslint-disable-next-line global-require
  const order = require('../api/routes/orders');
  // eslint-disable-next-line global-require
  const payment = require('../api/routes/payment');
  // eslint-disable-next-line global-require
  const userfiled = require('../api/routes/userfield');
  // eslint-disable-next-line global-require
  const faqs = require('../api/routes/faq');
  // eslint-disable-next-line global-require
  const dashboard = require('../api/routes/dashboard');
  // eslint-disable-next-line global-require
  const newsletter = require('../api/routes/newsletter');
  // eslint-disable-next-line global-require
  const store = require('../api/routes/store');
  // eslint-disable-next-line global-require
  const chats = require('../api/routes/chat');
  const payment_stripe = require('../api/routes/stripe');

  app.use('/api/users', users);
  app.use('/api/categories', categories);
  app.use('/api/products', products);
  app.use('/api/brands', brands);
  app.use('/api/blog', blogs);
  app.use('/api/pages', pages);
  app.use('/api/banners', banners);
  app.use('/api/vendor', vendor);
  app.use('/api/review', review);
  app.use('/api/cart', cart);
  app.use('/api/address', address);
  app.use('/api/front', front);
  app.use('/api/order', order);
  app.use('/api/payment', payment);
  app.use('/api/userfield', userfiled);
  app.use('/api/faqs', faqs);
  app.use('/api/dashboard', dashboard);
  app.use('/api/newsletter', newsletter);
  app.use('/api/store', store);
  app.use('/api/chats', chats);
  app.use('/api/payment', payment_stripe);
};
