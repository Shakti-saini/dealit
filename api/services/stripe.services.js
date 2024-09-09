const Stripe = require('stripe');

const stripe = Stripe('sk_test_51PpUfuRt1hlGrWiSk0SZbdb30jC9wUIw5UijoDPWfMlybM7wVHjXzQ0qr74Ad5uJFfBzu93AVf2ur8OyloUGGsXP00Vyw5YZTy');
const AllModels = require('../services/model.service');

const stripeService = () => {
  const attachSourceToCustomer = async (customerId, sourceId) => {
    try {
      const source = await stripe.customers.createSource(customerId, {
        source: sourceId,
      });
      console.log('Source attached:', source);
      return source;
    } catch (error) {
      console.error('Error attaching source:', error);
      throw error;
    }
  };
  const createPaymentIntent = async (data, random, userInfo) => {
    try {
      const { Paymentlog } = AllModels();
      const paymentIntent = await stripe.paymentIntents.create({
        amount: data.amount,
        currency: 'USD', // Currency set to INR
        payment_method_types: [data.payment_method_types],
        customer: data.customer,
        payment_method: data.payment_method,
        confirm: data.confirm,

      });

      console.log('PaymentIntent created successfully:', paymentIntent);
      if (paymentIntent.status === 'succeeded') {
        // let payloadOrder = {
        //     order_date:new Date(),
        //     payment:true

        // }
        // await order.update(payloadOrder, { where: { id: orderId.id } });
        // await stripe.invoiceItems.create({
        //     customer: data.customer,
        //     amount: data.amount,
        //     currency: "USD",
        //     description: 'Payment for product',
        //     //cart_id:data.cart_id
        // });
        // const invoice = await stripe.invoices.create({
        //     customer: data.customer,
        //     auto_advance: true, // Auto-finalize the invoice
        // });

        // console.log('Invoice created successfully:');

        // const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
        // const invoiceDownloadUrl = finalizedInvoice.invoice_pdf;
        const orderId = generateProductId();
        const stripedata = {
          // currency: 'USD',
          user_id: userInfo.id,
          transaction_id: paymentIntent.id,
          status: paymentIntent.status,
          logbody: JSON.stringify(paymentIntent),
          // stripe_customerId: data.customer,
          // price: data.amount,
          order_tracking_id: random,
          order_id: 45,

        };
        await Paymentlog.create(stripedata);
      }
      return paymentIntent;
    } catch (error) {
      console.error('Error creating PaymentIntent:', error);
      return error;
    }
  };

  const refundservices = async (paymentIntentId, amount) => {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount,
      });

      return refund;
    } catch (error) {
      console.error('Error creating refund:', error);
    }
  };


  return {
    createPaymentIntent,
    attachSourceToCustomer,
    refundservices,
  };
};
module.exports = stripeService;
