"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_express_1 = require("apollo-server-express");
var express_1 = __importDefault(require("express"));
// to store environment variables, loads dotenv file initially
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//db
var db_util_1 = __importDefault(require("./utils/db.util"));
var schema_1 = __importDefault(require("./schema/schema"));
var resolvers_1 = __importDefault(require("./resolvers/resolvers"));
db_util_1.default();
var app = express_1.default();
var server = new apollo_server_express_1.ApolloServer({
    typeDefs: schema_1.default,
    resolvers: resolvers_1.default,
    context: function (_a) {
        var req = _a.req, res = _a.res;
        return ({ req: req, res: res });
    }
});
//app.use('/', graphqlEx)
server.applyMiddleware({ app: app, path: '/' });
app.listen({ port: 4000 }, function () {
    console.log("\uD83D\uDE80 Server ready at http://localhost:4000" + server.graphqlPath);
});
