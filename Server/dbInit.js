import fs from 'node:fs';

import { MongoClient, ServerApiVersion } 
  from "mongodb";

import {dbURL}  from "./credentials.js";

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
const json3Data = fs.readFileSync('cs602_project_customers.json');
const customerData = JSON.parse(json3Data);
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
