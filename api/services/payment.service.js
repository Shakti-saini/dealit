const axios = require('axios');
const moment = require('moment');
const crypto = require('crypto');
const braintree = require('braintree');
const helperService = require('./helper.service');
const AllModels = require('../services/model.service');

exports.braintreeInit = async () => new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BrainTreeMerchantId,
  publicKey: process.env.BrainTreePublicKey,
  privateKey: process.env.BrainTreePrivateKey,
});

exports.braintreeRefund = async (order, amount) => {
  const { Paymentlog } = AllModels();

  const gateway = await this.braintreeInit();
  await gateway.transaction.refund(order.merchant_reference, amount, async (err, result) => {
    console.log(err);
    if (result) {
      // payment log..
      const payment = await Paymentlog.create({
        user_id: order.user_id,
        payment_method: 'Braintree',
        transaction_id: result.transaction.id,
        order_tracking_id: order.order_tracking_id,
        status: result.transaction.status,
        type: 'refund',
        logbody: JSON.stringify(result),
      });
    }
  });
};

exports.pesapal = async (data = {}) => {
  const configKey = {
    consumer_key: 'Ggk24BMccKXmriYLvU0TJlwfb5kH9EKl',
    consumer_secret: 'GUsJtSDcmv2/z6Wwg1UC3rakXuU=',
  };
  try {
    const tokenData = await axios.post('https://pay.pesapal.com/v3/api/Auth/RequestToken', configKey);

    let postdata = {
      url: `https://api.dealit.uk/api/payment/ipn?user_id=${data.user_id}&address_id=${data.addressId}&billing_address_id=${data.billingAddressId}&amount=${data.totalAmount}&shipping_amount=${data.shipping_amount}&item_amount=${data.item_amount}&tax_amount=${data.tax_amount}&payment_menthod='Pesapal'&sale_type=${data.sale_type}`,
      ipn_notification_type: 'GET',
    };

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://pay.pesapal.com/v3/api/URLSetup/RegisterIPN',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenData.data.token}`,
      },
      data: postdata,
    };

    const ipnData = await axios.request(config);
    if (ipnData.data) {
      config.method = 'get';
      config.url = 'https://pay.pesapal.com/v3/apiURLSetup/GetIpnList';
      await axios.request(config);
      postdata = {
        id: new Date().getTime(),
        currency: 'KES',
        amount: data.totalAmount,
        description: 'Payment description goes here',
        callback_url: 'https://dealit.uk/#/myorders',
        cancellation_url: 'https://dealit.uk/#/checkout',
        notification_id: ipnData.data.ipn_id,
        billing_address: {
          email_address: data.user.email,
          phone_number: data.user.phone,
          country_code: '+91',
          first_name: data.user.first_name,
          middle_name: data.user.middle_name,
          last_name: data.user.last_name,
          line_1: '',
          line_2: '',
          city: data.user.city,
          state: data.user.state,
          postal_code: data.user.zipcode,
          zip_code: data.user.zipcode,
        },
      };
      config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://pay.pesapal.com/v3/api/Transactions/SubmitOrderRequest',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenData.data.token}`,
        },
        data: postdata,
      };
      const resultData = await axios.request(config);
      if (resultData.data.error) {
        return {
          error: resultData.data.error.message,
          success: false,
        };
      }
      return {
        error: '',
        success: true,
        data: resultData.data,
      };
    }
  } catch (err) {
    return {
      error: 'Someting went wrong',
      success: false,
    };
  }
};
exports.pesapalTransactionSatus = async (orderTrackingId = {}) => {
  const configKey = {
    consumer_key: 'Ggk24BMccKXmriYLvU0TJlwfb5kH9EKl',
    consumer_secret: 'GUsJtSDcmv2/z6Wwg1UC3rakXuU=',
  };
  try {
    const tokenData = await axios.post('https://pay.pesapal.com/v3/api/Auth/RequestToken', configKey);
    const config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: `https://pay.pesapal.com/v3/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokenData.data.token}`,
      },
    };

    const transactionData = await axios.request(config);
    return transactionData;
  } catch (err) {
    return {
      error: 'Someting went wrong',
      success: false,
    };
  }
};

exports.mpesa = async (data = {}) => {
  try {
    const consumerKey = 'kWBkdtmP8YW82s21d7NH5l52AvlVPI3z';
    const consumerSecret = 'MpiO0BDXg3AmDBET';
    const auth = new Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const config = {
      method: 'get',
      url: 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    };
    // 254708374149
    const tokenData = await axios.request(config);
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const passkey = 'da3ff44e6a57981c581159faf9d9cf0ded04fd5b35c8f39e2bf5d0ccdaa6f04d';
    const shortCode = '4110837';
    const paymentUrl = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
    const password = new Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
    const postData = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: (data.totalAmount) ? Math.round(data.totalAmount) : 1,
      PartyA: `${data.user.phone}`,
      PartyB: 4110837,
      PhoneNumber: `${data.user.phone}`,
      CallBackURL: `https://api.dealit.uk/api/order/mpesa?user_id=${data.user_id}&address_id=${data.addressId}&billing_address_id=${data.billingAddressId}&amount=${data.totalAmount}&shipping_amount=${data.shipping_amount}&item_amount=${data.item_amount}&tax_amount=${data.tax_amount}&payment_menthod='Mpesa'&sale_type=${data.sale_type}`,
      AccountReference: 'CompanyXLTD',
      TransactionDesc: 'Payment of X',
    };
    config.url = paymentUrl;
    config.method = 'Post';
    config.data = postData;
    config.headers.Authorization = `Bearer ${tokenData.data.access_token}`;
    const paymentData = await axios.request(config);
    return { error: false, data: paymentData.data };
  } catch (error) {
    return { error: true, data: 'Invalid phone number' };
  }
};

exports.mpesaQuery = async (CheckoutRequestID = {}) => {
  try {
    const consumerKey = 'kWBkdtmP8YW82s21d7NH5l52AvlVPI3z';
    const consumerSecret = 'MpiO0BDXg3AmDBET';
    const auth = new Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    const config = {
      method: 'get',
      url: 'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      headers: {
        Authorization: `Basic ${auth}`,
      },
    };
    // 254708374149
    const tokenData = await axios.request(config);
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const passkey = 'da3ff44e6a57981c581159faf9d9cf0ded04fd5b35c8f39e2bf5d0ccdaa6f04d';
    const shortCode = '4110837';
    const queryUrl = 'https://api.safaricom.co.ke/mpesa/stkpushquery/v1/query';
    const password = new Buffer.from(`${shortCode}${passkey}${timestamp}`).toString('base64');
    const postData = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      CheckoutRequestID,
    };
    config.url = queryUrl;
    config.method = 'Post';
    config.data = postData;
    config.headers.Authorization = `Bearer ${tokenData.data.access_token}`;
    const paymentData = await axios.request(config);
    return { error: false, data: paymentData.data };
  } catch (error) {
    return { error: true, data: error };
  }
};

exports.iPayQuery = async (data) => {
  try {
    const vid = 'ecml';
    const consumerSecret = '6H8e6zmw4RUHfchy#qPknbqnVEs5rB@f';
    const random = await helperService.randString(5);
    const p = {
      live: '1',
      oid: random,
      inv: random,
      ttl: (data.totalAmount) ? data.totalAmount : 1,
      tel: `${data.user.phone}`,
      eml: `${data.user.email}`,
      vid,
      curr: 'KES',
      p1: random,
      cbk: 'https://dealit.uk/#/checkout/ipay',
      cst: '1',
      crl: '2',
    };

    // make hash..
    const dataString = `${p.live}${p.oid}${p.inv}${p.ttl}${p.tel}${p.eml}${p.vid}${p.curr}${p.p1}${p.cbk}${p.cst}${p.crl}`;

    const hmac = crypto.createHmac('sha1', consumerSecret);
    hmac.update(dataString);

    p.hsh = hmac.digest('hex');

    return { error: false, data: { formdata: p, hash: p.hsh } };
  } catch (error) {
    return { error: true, data: error };
  }
};

