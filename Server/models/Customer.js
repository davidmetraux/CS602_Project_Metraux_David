import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const customerSchema = new Schema({
  _id: String,
  name: String,
  role: String,
  password: String,
  username: {type:String, unique: true},
  orders: [{
    type: String,
    ref: "Order"
  }]
}, 
{collection : 'customers'});

export const Customer = mongoose.model(
  'Customer', customerSchema);