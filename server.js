import dotenv from "dotenv";
import { ApolloServer } from "apollo-server-express";
import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import http from "http";
import { importSchema } from "graphql-import";
// import isAuth from "./middlewares/isAuth";
import databse from "./db.js";
import Query from "./resolvers/Query.js";
import Mutation from "./resolvers/Mutation.js";
import chalk from "chalk";
import { Authenticate } from "./middlewares/Authenticate.js";
//start
dotenv.config();

const typeDefs = importSchema("./Schema/Schema.graphql");

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50000,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

const resolvers = {
  Query,
  Mutation,
};

const app = express();

app.use(apiLimiter);
app.use(xss());
app.use(
  helmet({
    contentSecurityPolicy:
      process.env.NODE_ENV === "production" ? undefined : false,
  })
);
app.use(mongoSanitize());
app.use(cors());

app.get("/", (req, res) =>
  res.json({ "Relevel-App version": "v1", status: "healthy" })
);

const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  uploads: false,
  resolvers: {
    ...resolvers,
  },
  context: ({ req, res }) => {
    return { ...Authenticate(req), req, res };
  },
});
server.start().then(() => {
  server.applyMiddleware({ app });

  server.graphqlPath = "/register";

  databse
    .connect()
    .then(() => {
      // Use native http server to allow subscriptions
      httpServer.listen(process.env.PORT || 4000, () => {
        console.log(
          chalk
            .hex("#fab95b")
            .bold(
              `🚀 Server ready at http://localhost:${process.env.PORT || 4000}${
                server.graphqlPath
              }`
            )
        );
      });
    })
    .catch((e) => console.log(chalk.red(e)));
});
