// File: server_graphQL_apollo.js

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } 
   from '@apollo/server/standalone';

import { Customer, Product, Order, Quantity } from './models/index.js';

import * as storeDB
    from './storeModule.js';

const typeDefs_Queries = `#graphql
  type Product {
    _id: String!
    name: String!,
    description: String!,
    price: Float!,
    quantity: Int!
  }


  type Customer {
    _id: String!
    name: String!
    orders: [Order]!
  }


  type Quantity {
    _id: String!,
    quantity: Int!,
    product: Product!
    orders: [Order]!
  }


  type Order {
    _id: String!,
    quantities: [Quantity]!
    customer: Customer!
  }


  type Query {
    lookupByCustomerId(id: String!): Customer
    lookupByOrderId(id: String!): Order
    lookupByQuantityId(id: String!): Quantity
    lookupByProductId(id: String!): Product
    lookupByProductName(name: String!): [Product]!
    allProducts: [Product]!
    productsWithinRange(startInclusive: Float, endInclusive: Float): [Product]!
  }
`

const resolvers_Queries = {

  Query: {
    lookupByCustomerId: async (parent, args, context) => {
      console.log(" Lookup customer", args.id)
      const result = await storeDB.lookupByCustomerId(args.id);
      return result;
    },
    lookupByOrderId: async (parent, args, context) => {
      console.log(" Lookup order", args.id)
      const result =  await storeDB.lookupByOrderId(args.id)
      return result
    },
    lookupByQuantityId: async (parent, args, context) => {
      console.log(" Lookup quantity", args.id)
      const result = await storeDB.lookupByQuantityId(args.id)
      return result

    },
    lookupByProductId: async (parent, args, context) => {
      console.log(" Lookup product", args.id)
      const result = await storeDB.lookupByProductId(args.id)
      return result
    },
    lookupByProductName: async (parent, args, context) => {
      console.log("lookup by product name", args.name)
      const result = await storeDB.lookupByProductName(args.name)
      return result
    },

    allProducts: async (parent, args, context) => {
      console.log("all products")
      const result = await storeDB.allProducts()
      return result
    },

    productsWithinRange: async (parent, args, context) => {
      console.log("products within $"+args.startInclusive+" and $"+args.endInclusive)
      const result = await storeDB.productsWithinRange(args.startInclusive, args.endInclusive)
      return result
    }

  },


  Order: {
    customer:  async (parent, args, context) => {
      console.log(" (2) Parent Order", parent._id, " Args", args);
      const result = await parent.populate("customer");
      return result.customer;
    },

    quantities: async (parent, args, context) => {
      console.log(" (2) Parent Order", parent._id, " Args", args);
      const result = await parent.populate("quantities");
      return result.quantities;
    }
  },


  Customer: {
    orders: async (parent, args, context) => {
      console.log(" (2) Parent customer id", parent._id, "Args", args);
      const result = await parent.populate("orders");
      console.log(result)
      return result.orders;
    }
  },

  Quantity: {
    orders: async (parent, args, context) => {
      console.log(" (2) Parent quantity id", parent._id, "Args", args);
      const result = await parent.populate("orders");
      return result.orders;
    },

    product: async (parent, args, context) => {
      console.log(" (2) Parent quantity id", parent._id, "Args", args);
      const result = await parent.populate("product");
      return result.product;
    },


  }

};

const server = new ApolloServer(
  {typeDefs: [typeDefs_Queries], 
   resolvers: [resolvers_Queries]});


const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);

