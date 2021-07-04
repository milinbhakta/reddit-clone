import { MikroORM } from "@mikro-orm/core";
import { _prod_ } from "./constants";
import "reflect-metadata";
import mikroConfig from "./mikro-orm.config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { HelloResolver } from "./resolvers/hello";
import { PostResolver } from "./resolvers/post";

const main = async () => {
  const orm = await MikroORM.init(mikroConfig);
  await orm.getMigrator().up();

  // Create an express application
  const app = express();

  // hello world to check express is setup correctly
  app.get("/", (_req, res) => {
    res.send("Hello from Express!");
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver],
      validate: false,
    }),
    context: () => ({ em: orm.em }),
  });

  apolloServer.applyMiddleware({ app });

  app.listen(process.env.EXPRESS_PORT, () => {
    console.log(`Server started on localhost:${process.env.EXPRESS_PORT}`);
  });
};

main().catch((err) => {
  console.log(err);
});
