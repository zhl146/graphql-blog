import * as functions from "firebase-functions"
import express from "express";
import bodyParser from "body-parser";
import { graphqlExpress, graphiqlExpress } from "apollo-server-express";
import { makeExecutableSchema } from "graphql-tools";
import cors from "cors";

import blogResolvers from "./graphQL/blog.resolvers";
import blogTypeDefs from "./graphQL/blog.typedefs";
import dbConnect from "./config/mongo.config";

const URL = "http://localhost";
const PORT = 3001;

const start = async () => {
  try {
    const schema = makeExecutableSchema({
      typeDefs: blogTypeDefs,
      resolvers: blogResolvers
    });

    const context = await dbConnect();

    const app = express();

    app.use(cors());
    app.use("/graphql", bodyParser.json(), graphqlExpress({ schema, context }));
    app.use(
      "/graphiql",
      graphiqlExpress({
        endpointURL: "/graphql"
      })
    );
    app.listen(PORT, () => {
      console.log(`Visit ${URL}:${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

export default start;
