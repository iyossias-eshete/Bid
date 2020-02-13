import { ApolloServer  } from 'apollo-server-express';

import express from 'express';

// to store environment variables, loads dotenv file initially
import dotenv from 'dotenv';
dotenv.config();

//db
import dbInitializer  from "./utils/db.util";


import  typeDefs  from "./schema/schema"; 
import resolvers from "./resolvers/resolvers";

dbInitializer();

const app = express();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res })

});

//app.use('/', graphqlEx)

server.applyMiddleware({ app, path: '/' });

app.listen({ port: 4000 }, () => {
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
});

