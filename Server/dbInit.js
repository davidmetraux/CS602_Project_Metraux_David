import fs from 'node:fs';

import { MongoClient, ServerApiVersion } 
  from "mongodb";

import {dbURL}  from "./credentials.js";

export const users = [
    {
        _id: "1",
        name:"Abby",
        username: "abby",
        password: "1234",
        role:"user",
        orders: ["1"]
    },
    {
        _id:"2",
        name: "Barry",
        username: "barry",        
        password: "2345",
        role:"user",
       orders: ["2"] 
    },
    {
        _id:"3",
        name: "Charlene",
        username: "charlene",        
        password: "3456",
        role:"admin",
        orders: ["3"] 
    }
]

const client = new MongoClient(dbURL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let result;


//products
const json1Data = fs.readFileSync('cs602_project_products.json');
const productData = JSON.parse(json1Data);
console.log("Read", productData.length, "products");

const productsCollection = client.db("cs602_project").collection("products");
await productsCollection.deleteMany({});
result = await productsCollection.insertMany(productData);
console.log('Inserted Ids:', result.insertedIds);


//orders
const json2Data = fs.readFileSync('cs602_project_orders.json');
const orderData = JSON.parse(json2Data);
console.log("Read", orderData.length, "orders");

const ordersCollection = client.db("cs602_project").collection("orders");
await ordersCollection.deleteMany({});
result = await ordersCollection.insertMany(orderData);
console.log('Inserted Ids:', result.insertedIds);

//customers


export function findUser (username) {
  return users.find(user => 
            user.username == username);
}

export async function  validateUser(name, password) {
  return users.find(user => 
            user.username == name && user.password == password);
}


const customerData = users
console.log("Read", customerData.length, "customers");

const customerCollection = client.db("cs602_project").collection("customers");
await customerCollection.deleteMany({});
result = await customerCollection.insertMany(customerData);
console.log('Inserted Ids:', result.insertedIds);

//quantities
const json4Data = fs.readFileSync('cs602_project_quantities.json');
const quantityData = JSON.parse(json4Data);
console.log("Read", quantityData.length, "quantities");

const quantitiesCollection = client.db("cs602_project").collection("quantities");
await quantitiesCollection.deleteMany({});
result = await quantitiesCollection.insertMany(quantityData);
console.log('Inserted Ids:', result.insertedIds);



await client.close();
