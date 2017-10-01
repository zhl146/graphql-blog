import express from 'express'
import bodyParser from 'body-parser'
import {graphqlExpress, graphiqlExpress} from 'apollo-server-express'
import {makeExecutableSchema} from 'graphql-tools'
import cors from 'cors'

import { makeBlogResolvers } from "./graphQL/blog/blog.resolvers";
import { blogTypeDefs } from "./graphQL/blog/blog.typedefs";
import { dbConnect } from "./mongoConnection";

const URL = 'http://localhost';
const PORT = 3001;

export const start = async () => {
  try {

    const db = await dbConnect();

    const schema = makeExecutableSchema({
      typeDefs: blogTypeDefs,
      resolvers: makeBlogResolvers(db)
    });

    const app = express();

    app.use(cors());
    app.use('/graphql', bodyParser.json(), graphqlExpress({schema}));
    app.use('/graphiql', graphiqlExpress({
      endpointURL: '/graphql'
    }));
    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}`)
    })
  } catch (e) {
    console.log(e)
  }

};
