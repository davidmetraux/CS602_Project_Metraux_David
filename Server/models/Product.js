import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const productSchema = new Schema({
  _id: String,
  name: String,
  description: String,
  price: Number,
  quantity: Number
}, 
{collection : 'products'});

export const Product = mongoose.model(
  'Product', productSchema);
