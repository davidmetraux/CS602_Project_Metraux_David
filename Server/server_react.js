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
app.engine('handlebars', engine({defaultLayout: ''}));

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


app.get('/api/lookupByProjectName/:pname',
  async (req, res) => {
    const result = await storeDB.lookupByProductName(req.param.pname)
    res.json(result);
});

app.get('/api/productsWithinRange/:start/:end',
  async (req, res) => {
    const result = await storeDB.productsWithinRange(req.param.start, req.params.end)
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
