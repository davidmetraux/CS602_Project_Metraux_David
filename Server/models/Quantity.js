import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const quantitySchema = new Schema({
  _id: String,
  quantity: Number,
  product: {
      type: String,
      rf: 'Product'
  }
}, 
{collection : 'quantity'});

export const Quantity = mongoose.model(
  'Quantity', quantitySchema);
