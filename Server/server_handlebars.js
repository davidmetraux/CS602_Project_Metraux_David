import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { GraphQLError } from 'graphql';

import { validateUser, findUser } from './dbUsers.js';

import * as storeDB 
    from './storeModule.js';

import cors from "cors";

 
import {typeDefs_Queries, typeDefs_Mutations,
         resolvers_Queries, resolvers_Mutations} 
    from "./server_graphQL_apollo.js";


import express, { json } from 'express';
import session from 'express-session';

const tokenSecret = 'cs602-secret';

passport.use(
  new LocalStrategy(
    function (username, password, cb) {
      process.nextTick(async function () {
        const user = await validateUser(username, password);
        if (!user) { 
          return cb(null, false, 
            { message: 'Incorrect username or password.' }); 
        }
        else {
          return cb(null, user);  
        }
  
      });
    }
  )
);

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

//Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Serialize user information
passport.serializeUser((user, cb) => {
  console.log("Serialize", user);
  cb(null, {
    id: user.id,
    username: user.username,
    role: user.role
  });
});

// Deserialize user information
passport.deserializeUser((obj, cb) => {
  console.log("DeSerialize", obj);
  cb(null, obj);
});


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





app.post('/login', 
  passport.authenticate('local', 
    { successRedirect: "/",
      failureRedirect: '/login', 
      failureMessage: true })
);



const server = new ApolloServer({
  typeDefs: [typeDefs_Queries, typeDefs_Mutations], 
  resolvers: [resolvers_Queries, resolvers_Mutations]});

// Note you must call `start()` on the `ApolloServer`
// instance before passing the instance to `expressMiddleware`

await server.start();



//protected route middleware function
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// protected route middleware function
const ensureAuthorized = (requiredRole) => {
  return (req, res, next) => {
    if (req.isAuthenticated) {
      const user = req.user;
      if (user?.role === requiredRole) {
        return next();
      } else {
        res.render('error', 
          { user: req.user,
            message: 'Insufficient access permissions'});
      }
    } else {
      res.redirect('/login'); 
    }
  }
}

app.use("/graphql", 
  ensureAuthenticated,
  cors(),
  json(), 
  expressMiddleware(server, 
    {
    context: async ({ req, res }) => {
  
        // Add the user to the context
        return { user: req.user };
      
    }
  }
));


//views

app.get('/', (req, res) => {
      console.log("User", req.user);
  res.render('index', {user: req.user});  
});

app.get('/login', (req, res) => {
    res.render('login');
});
 

app.get('/products', ensureAuthenticated,
  async (req, res) => {

    const result = await storeDB.allProducts()
    

    res.render('allProducts', 
		{user: req.user, products: result.map(product => product.toJSON())});
  }
);

app.post('/products', ensureAuthenticated,
  async (req, res) => {
    //let's say we're abby for now
     let customerId =  findUser(req.user.username)._id


    let productId = req.body.productId
    let numberToAdd = req.body[productId.toString()+"input"]
    console.log(req.body)
    if (numberToAdd && parseInt(numberToAdd)){
      const result = await storeDB.moveToCart(productId, customerId, parseInt(numberToAdd))
      res.redirect('/cart');
    } else {
      res.redirect('back');
    }
    
    
  }
);

app.get('/lookupByProductName', ensureAuthenticated,
  async (req, res) => {
	if (req.query.pname) {
		const result = await storeDB.lookupByProductName(req.query.pname)
		res.render('productSearch', 
			{query: req.query.pname, products: result.map(product => product.toJSON())});
	} else {
		res.render('productSearchForm', {user: req.user});
	}
});

app.post('/lookupByProductName', ensureAuthenticated,
  async (req, res) => {
    let result = await storeDB.lookupByProductName(req.body.pname);
    res.render('productSearch', 
      {user: req.user, query: req.body.pname, products: result.map(product => product.toJSON())});
});


app.get('/lookupByProductName/:pname', ensureAuthenticated,
  async (req, res) => {
    const result = await storeDB.lookupByProductName(req.params.pname)

    console.log(result)
    res.render('productSearch', 
		{user: req.user, query: req.params.pname, products: result.map(product => product.toJSON())});
});


app.get('/cart', ensureAuthenticated,
  async (req, res) => {
    //let's say we're abby for now
     let customerId =  findUser(req.user.username)._id
    const result = await storeDB.getCart(customerId)

    console.log(result)
    res.render('cart', 
		{user: req.user, quantities: result.quantities.map(quantity => quantity.toJSON())});
});


app.post('/cart', ensureAuthenticated,
  async (req, res) => {
     let customerId =  findUser(req.user.username)._id

    if (req.body.productId){
      let productId=req.body.productId
      await storeDB.removeFromCart(customerId, productId)
    } 
    if (req.body.submitOrder){
      await storeDB.submitOrder(customerId)

    }
    
    res.redirect('/cart');
});

app.get('/pastOrders', ensureAuthenticated,
  async (req, res) => {
    let customerId =  findUser(req.user.username)._id
    const result = await storeDB.getPastOrders(customerId)
    
    res.render('pastOrders', 
    {user: req.user, orders: result});
});

app.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

//admin
app.get('/allUsers', ensureAuthenticated, ensureAuthorized("admin"),
  async (req, res) => {
    const result = await storeDB.getAllCustomers()
    console.log(result)

    
    res.render('allUsers', 
    {user: req.user, customers: result.map((customer)=>customer.toJSON())});
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

// for debugging
app.get('/session', (req, res) => {
  res.json(req.session);
});

const PORT = 5555;

// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
