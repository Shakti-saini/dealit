const Sequelize = require('sequelize');

const sequelize = require('../../config/database');

const tableName = 'stores';

const Store = sequelize.define('Store', {
  name: {
    type: Sequelize.STRING,
    unique: false,
  },
  slug: {
    type: Sequelize.STRING,
    unique: true,
  },
  description: {
    type: Sequelize.TEXT,
    unique: false,
  },
  user_id: {
    type: Sequelize.INTEGER,
    unique: false,
  },
  logo_name: {
    type: Sequelize.TEXT,
    unique: false,
  },
  logo_path: {
    type: Sequelize.TEXT,
    unique: false,
  },
  status: {
    type: Sequelize.ENUM,
    values: ['active', 'inactive'],
    defaultValue: 'active',
  },
  photo_name: {
    type: Sequelize.STRING,
    unique: false,
  },
  photo_path: {
    type: Sequelize.STRING,
    unique: false,
  },
  video_name: {
    type: Sequelize.STRING,
    unique: false,
  },
  video_path: {
    type: Sequelize.STRING,
    unique: false,
  },
  contact_name: {
    type: Sequelize.STRING,
    unique: false,
  },
  contact_designation: {
    type: Sequelize.STRING,
    unique: false,
  },
  contact_phone: {
    type: Sequelize.STRING,
    unique: false,
  },
  contact_mobile: {
    type: Sequelize.STRING,
    unique: false,
  },
  contact_fax: {
    type: Sequelize.STRING,
    unique: false,
  },
  business_type: {
    type: Sequelize.JSON,
    unique: false,
  },
  website: {
    type: Sequelize.STRING,
    unique: false,
  },
  tax_rate: {
    type: Sequelize.STRING,
    unique: false,
  },
  shipping_domestic: {
    type: Sequelize.STRING,
    unique: false,
  },
  shipping_international: {
    type: Sequelize.STRING,
    unique: false,
  },
  legal_owner: {
    type: Sequelize.STRING,
    unique: false,
  },
  register_year: {
    type: Sequelize.STRING,
    unique: false,
  },
  register_state: {
    type: Sequelize.STRING,
    unique: false,
  },
  register_country: {
    type: Sequelize.STRING,
    unique: false,
  },
  opertaion_steet: {
    type: Sequelize.STRING,
    unique: false,
  },
  operation_city: {
    type: Sequelize.STRING,
    unique: false,
  },
  operation_country: {
    type: Sequelize.STRING,
    unique: false,
  },
  operation_zip: {
    type: Sequelize.STRING,
    unique: false,
  },
  map_location: {
    type: Sequelize.JSON,
    unique: false,
  },
  main_category_id: {
    type: Sequelize.STRING,
    unique: false,
  },
  main_products: {
    type: Sequelize.STRING,
    unique: false,
  },
  other_products: {
    type: Sequelize.STRING,
    unique: false,
  },
  office_size: {
    type: Sequelize.STRING,
    unique: false,
  },
  company_advantages: {
    type: Sequelize.JSON,
  },
  production_process: {
    type: Sequelize.JSON,
  },
  production_equipment: {
    type: Sequelize.JSON,
  },
  production_line: {
    type: Sequelize.JSON,
  },
  production_capacity: {
    type: Sequelize.JSON,
  },
  production_lines_count: {
    type: Sequelize.STRING,
    unique: false,
  },
  factory_location: {
    type: Sequelize.STRING,
    unique: false,
  },
  factory_size: {
    type: Sequelize.STRING,
    unique: false,
  },
  manufacture_contract: {
    type: Sequelize.JSON,
    unique: false,
  },
  qc_staff: {
    type: Sequelize.STRING,
    unique: false,
  },
  rd_staff: {
    type: Sequelize.STRING,
    unique: false,
  },
  annual_op_value: {
    type: Sequelize.STRING,
    unique: false,
  },
  qc_process: {
    type: Sequelize.JSON,
  },
  rd_process: {
    type: Sequelize.JSON,
  },
  testing_equipment: {
    type: Sequelize.JSON,
  },
  annual_revenue: {
    type: Sequelize.STRING,
    unique: false,
  },
  export_percentage: {
    type: Sequelize.STRING,
    unique: false,
  },
  marks_distribution: {
    type: Sequelize.JSON,
    unique: false,
  },
  started_exporting: {
    type: Sequelize.STRING,
    unique: false,
  },
  customer_case: {
    type: Sequelize.JSON,
  },
  emp_in_trade_department: {
    type: Sequelize.STRING,
    unique: false,
  },
  nearest_port: {
    type: Sequelize.STRING,
    unique: false,
  },
  average_lead_time: {
    type: Sequelize.STRING,
    unique: false,
  },
  overseas_office: {
    type: Sequelize.TINYINT,
    unique: false,
  },
  delivery_terms: {
    type: Sequelize.JSON,
    unique: false,
  },
  payment_currency: {
    type: Sequelize.JSON,
    unique: false,
  },
  payment_types: {
    type: Sequelize.JSON,
    unique: false,
  },
  language_spoken: {
    type: Sequelize.JSON,
    unique: false,
  },
  trade_shows: {
    type: Sequelize.JSON,
  },
}, {
  tableName,
});

// eslint-disable-next-line
Store.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  return values;
};

module.exports = Store;
