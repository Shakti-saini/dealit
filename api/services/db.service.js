const database = require('../../config/database');
const AllModels = require('./model.service');

const dbService = (environment, migrate) => {
  const authenticateDB = () => database.authenticate();

  // eslint-disable-next-line no-unused-vars
  const dropDB = () => database.drop();

  const syncDB = () => database.sync();
  // eslint-disable-next-line no-unused-vars
  const association = () => {
    const {
      // eslint-disable-next-line no-unused-vars
      User,
      Category,
      Product,
      Brand,
      Banner,
      Review,
      Cart,
      Address,
      Order,
      OrderItem,
      Tempcart,
      Variation,
      ShippingRate,
      Store,
      Chat,
      Message,
      Follow,
      Country,
      Continent,
      State,
    } = AllModels();
    Category.hasMany(Category, { foreignKey: 'parent_id', sourceKey: 'id' });
    Category.belongsTo(Category, { foreignKey: 'parent_id', as: 'parentcategory', targetKey: 'id' });
    User.hasOne(Store, { foreignKey: 'user_id', sourceKey: 'id' });
    User.hasMany(Follow, { foreignKey: 'follower_user_id', sourceKey: 'id', as: 'Following' });
    User.hasMany(Follow, { foreignKey: 'followed_user_id', sourceKey: 'id', as: 'Followers' });
    Store.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
    Product.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
    Product.belongsTo(Store, { foreignKey: 'user_id', targetKey: 'user_id' });
    Product.belongsTo(Category, { foreignKey: 'master_category_id', as: 'mastercategory', targetKey: 'id' });
    Product.belongsTo(Category, { foreignKey: 'category_id', as: 'category', targetKey: 'id' });
    Product.belongsTo(Category, { foreignKey: 'sub_category_id', as: 'subcategory', targetKey: 'id' });
    Product.belongsTo(Brand, { foreignKey: 'brand_id', targetKey: 'id' });
    Brand.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
    Banner.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
    Review.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
    Review.belongsTo(Product, { foreignKey: 'product_id', targetKey: 'id' });
    Cart.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
    Cart.belongsTo(Product, { foreignKey: 'product_id', targetKey: 'id' });
    Tempcart.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
    Tempcart.belongsTo(Product, { foreignKey: 'product_id', targetKey: 'id' });
    Product.hasMany(Variation, { foreignKey: 'product_id', targetKey: 'id' });
    Product.hasMany(ShippingRate, { foreignKey: 'product_id', targetKey: 'id' });
    Order.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
    Order.belongsTo(Address, { foreignKey: 'address_id', targetKey: 'id' });
    Order.belongsTo(Address, { foreignKey: 'billing_address_id', as: 'BillingAddress', targetKey: 'id' });
    User.hasMany(Order, { foreignKey: 'user_id', targetKey: 'id' });
    User.hasMany(Product, { foreignKey: 'user_id', targetKey: 'id' });
    Address.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id' });
    Product.hasMany(Cart, { foreignKey: 'product_id', targetKey: 'id' });
    User.hasMany(Cart, { foreignKey: 'user_id', targetKey: 'id' });
    Product.hasMany(Tempcart, { foreignKey: 'product_id', targetKey: 'id' });
    User.hasMany(Tempcart, { foreignKey: 'user_id', targetKey: 'id' });
    OrderItem.belongsTo(User, { foreignKey: 'vendor_id', targetKey: 'id' });
    OrderItem.belongsTo(Product, { foreignKey: 'product_id', targetKey: 'id' });
    OrderItem.belongsTo(Order, { foreignKey: 'order_id', targetKey: 'id' });
    Order.hasMany(OrderItem, { foreignKey: 'order_id', targetKey: 'id' });
    Chat.hasMany(Message, { foreignKey: 'chat_id', targetKey: 'id' });
    Chat.belongsTo(User, { foreignKey: 'user_id', targetKey: 'id', as: 'Sender' });
    Chat.belongsTo(User, { foreignKey: 'to_user_id', targetKey: 'id', as: 'Receiver' });
    Continent.hasMany(Country, { foreignKey: 'continent_code', targetKey: 'code' });
    ShippingRate.belongsTo(Country, { foreignKey: 'country_id', targetKey: 'id' });
    Country.hasMany(State, { foreignKey: 'country_id', targetKey: 'id' });
    // eslint-disable-next-line no-console
    console.log('association....finish');
    return true;
  };
  const successfulDBStart = () => (
    console.info('connection to the database has been established successfully')
  );

  const errorDBStart = (err) => (
    console.info('unable to connect to the database:', err)
  );

  const wrongEnvironment = () => {
    console.warn(`only development, staging, test and production are valid NODE_ENV variables but ${environment} is specified`);
    return process.exit(1);
  };

  const startMigrateTrue = async () => {
    try {
      await syncDB();
      successfulDBStart();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startMigrateFalse = async () => {
    try {
      // await dropDB();
      await syncDB();
      successfulDBStart();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startDev = async () => {
    try {
      await authenticateDB();

      if (migrate) {
        return startMigrateTrue();
      }

      return startMigrateFalse();
    } catch (err) {
      return errorDBStart(err);
    }
  };

  const startStage = async () => {
    try {
      await authenticateDB();

      if (migrate) {
        return startMigrateTrue();
      }

      return startMigrateFalse();
    } catch (err) {
      return errorDBStart(err);
    }
  };

  const startTest = async () => {
    try {
      await authenticateDB();
      await startMigrateFalse();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const startProd = async () => {
    try {
      await authenticateDB();
      await startMigrateFalse();
    } catch (err) {
      errorDBStart(err);
    }
  };

  const start = async () => {
    association();
    switch (environment) {
      case 'development':
        await startDev();
        break;
      case 'staging':
        await startStage();
        break;
      case 'testing':
        await startTest();
        break;
      case 'production':
        await startProd();
        break;
      default:
        await wrongEnvironment();
    }
  };

  return {
    start,
  };
};

module.exports = dbService;
