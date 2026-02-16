import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  _id: String,
  products: [{
      type: String,
      ref: 'Quantity'
  }]
}, 
{collection : 'orders'});

export const Order = mongoose.model(
  'Order', orderSchema);
