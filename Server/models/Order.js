import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  _id: String,
  quantities: [{
      type: String,
      ref: 'Quantity'
  }],
  customer: {
    type: String,
    ref: 'Customer'
  }
}, 
{collection : 'orders'});

export const Order = mongoose.model(
  'Order', orderSchema);
