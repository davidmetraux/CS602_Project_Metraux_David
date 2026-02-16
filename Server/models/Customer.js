import mongoose from 'mongoose';
const Schema = mongoose.Schema;


const customerSchema = new Schema({
  _id: String,
  Name: String,
  coordinator: {
      type: String,
      ref: 'Coordinator'
  }
}, 
{collection : 'courses'});

export const Customer = mongoose.model(
  'Customer', customerSchema);