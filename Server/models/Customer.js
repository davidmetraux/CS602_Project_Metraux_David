import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const customerSchema = new Schema({
  _id: String,
  name: String,
}, 
{collection : 'courses'});

export const Customer = mongoose.model(
  'Customer', customerSchema);