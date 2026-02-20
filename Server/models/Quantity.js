import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const quantitySchema = new Schema({
  _id: String,
  quantity: Number,
  product: {
      type: String,
      ref: 'Product'
  },
  order: {
    type: String,
    ref: "Order"
  }
}, 
{collection : 'quantities'});

export const Quantity = mongoose.model(
  'Quantity', quantitySchema);
