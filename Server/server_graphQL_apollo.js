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
    order: Order!
  }


  type Order {
    _id: String!,
    quantities: [Quantity]!
    customer: Customer!
    inCart: Boolean!
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

const typeDefs_Mutations = `#graphql
  type Mutation {
    moveToCart(cartData: moveToCartInput!): Order
    submitOrder(cartData: submitOrderInput!): Order
  }

 input moveToCartInput {
    productId: String!
    customerId: String!
    quantity: Int!
  }


  input submitOrderInput {
    customerId: String!
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
    order: async (parent, args, context) => {
      console.log(" (2) Parent quantity id", parent._id, "Args", args);
      const result = await parent.populate("order");
      return result.order;
    },

    product: async (parent, args, context) => {
      console.log(" (2) Parent quantity id", parent._id, "Args", args);
      const result = await parent.populate("product");
      return result.product;
    },


  }

};

const resolvers_Mutations = {

  Mutation: {

    moveToCart: async (parent, args, context) => {
      console.log("Move item to cart", args);
      const { cartData } = args;
      
      const result = await storeDB.moveToCart(
        cartData.productId, cartData.customerId, cartData.quantity);

      return result;
    },

    // removeFromCart: async (parent, args, context) => {
    //   console.log("Remove item from cart", args);
    //   const { cartData } = args;

    //   const result = await storeDB.removeFromCart(
    //     cartData.customerId, cartData.product);

    // },

    submitOrder: async (parent, args, context) => {
      console.log("Submit order", args);
      const { cartData } = args;
      
      const result = await storeDB.submitOrder(
        cartData.customerId);

      return result
    }
  }
};

const server = new ApolloServer(
  {typeDefs: [typeDefs_Queries, typeDefs_Mutations], 
   resolvers: [resolvers_Queries, resolvers_Mutations]});


const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);

