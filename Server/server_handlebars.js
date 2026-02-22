// import passport from 'passport';
// import {Strategy as LocalStrategy} from 'passport-local';

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { GraphQLError } from 'graphql';

import * as storeDB 
    from './storeModule.js';

import cors from "cors";

 
import {typeDefs_Queries, typeDefs_Mutations,
         resolvers_Queries, resolvers_Mutations} 
    from "./server_graphQL_apollo.js";


// const tokenSecret = 'cs602-secret';

import express, { json } from 'express';
import session from 'express-session';

const app = express();


// to parse request body
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Use express session
app.use(
  session({
    secret: 'cs602_secret', 
    resave: false, 
    saveUninitialized: false
  })
);

// Initialize Passport and session
// app.use(passport.initialize());
// app.use(passport.session());

// Serialize user information
// passport.serializeUser((user, cb) => {
//   console.log("Serialize", user);
//   cb(null, {
//     id: user.id,
//     name: user.name,
//     role: user.role
//   });
// });

// Deserialize user information
// passport.deserializeUser((obj, cb) => {
//   console.log("DeSerialize", obj);
//   cb(null, obj);
// });


// for pretty print JSON response
app.set('json spaces', 2);

// setup handlebars view engine
import { engine } from 'express-handlebars';
app.engine('handlebars', 
		engine({defaultLayout: 'main'}));

app.set('view engine', 'handlebars');
app.set('views', './views');

// static resources
app.use(express.static('./public'));


app.get('/', (req, res) => {
    res.render('index');
});

app.get('/login', (req, res) => {
    res.render('login');
});
 


app.post('/login', 
  // passport.authenticate('local', { failureRedirect: '/' }),
  function(req, res) {
    res.send({ token: 'Bearer Success'});
  });



const server = new ApolloServer({
  typeDefs: [typeDefs_Queries, typeDefs_Mutations], 
  resolvers: [resolvers_Queries, resolvers_Mutations]});

// Note you must call `start()` on the `ApolloServer`
// instance before passing the instance to `expressMiddleware`

await server.start();



// protected route middleware function
// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/');
// }

app.use("/graphql", 
  // ensureAuthenticated,
  cors(),
  json(), 
  expressMiddleware(server, 
    // {
    // context: async ({ req, res }) => {
  
    //     // Add the user to the context
    //     return { user: req.user };
      
    // }
  // }
));


//views

app.get('/products', 
  async (req, res) => {

    const result = await storeDB.allProducts()
    

    res.render('allProducts', 
		{products: result.map(product => product.toJSON())});
  }
);

app.get('/lookupByProductName', 
  async (req, res) => {
	if (req.query.pname) {
		const result = await storeDB.lookupByProductName(req.query.pname)
		res.render('productSearch', 
			{query: req.query.pname, products: result.map(product => product.toJSON())});
	} else {
		res.render('productSearchForm');
	}
});

app.post('/lookupByProductName', 
  async (req, res) => {
	let result = await storeDB.lookupByProductName(req.body.pname);
	res.render('productSearch', 
		{query: req.body.pname, products: result.map(product => product.toJSON())});
});


app.get('/lookupByProductName/:pname',
  async (req, res) => {
    const result = await storeDB.lookupByProductName(req.params.pname)

    console.log(result)
    res.render('productSearch', 
		{query: req.params.pname, products: result.map(product => product.toJSON())});
});


app.get('/cart',
  async (req, res) => {
    //let's say we're abby for now
    const result = await storeDB.getCart("1")

    console.log(result)
    res.render('cart', 
		{quantities: result.quantities.map(quantity => quantity.toJSON())});
});


app.post('/cart',
  async (req, res) => {
    //let's say we're abby for now
    // let customerId=req.body.customerId
    let customerId="1"
    let productId=req.body.productId

    await storeDB.removeFromCart(customerId, productId)
    res.redirect('/cart');
});

//api

app.get('/api/lookupByProductName/:pname',
  async (req, res) => {
    const result = await storeDB.lookupByProductName(req.params.pname)
    res.json(result);
});

app.get('/api/productsWithinRange/:start/:end',
  async (req, res) => {
    const result = await storeDB.productsWithinRange(req.params.start, req.params.end)
    res.json(result);
});

app.get('/api/products', 
  async (req, res) => {

    const result = await storeDB.allProducts()
    res.json(result);
  }
);

const PORT = 5555;

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
