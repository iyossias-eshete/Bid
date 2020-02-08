"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var apollo_server_1 = require("apollo-server");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var SECRET = 'SECRET';
;
;
// const userType = {
//   id: String,
//   email: String,
//   firstName: String,
//   lastName : String,
//   password: String,
//   accountNumber : Number,
//   sex : String
// }
var typeDefs = apollo_server_1.gql(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n  enum Sex{\n    Male\n    Female\n  }\n\n  type User{\n    id: Int\n    email: String!\n    firstName: String!\n    lastName : String!\n    password: String!\n    accountNumber : Int!\n    sex : Sex!\n  }\n\n  type authenticatedUser{\n    user :User\n    token : String\n  }\n  \n  type testTypeQ{\n    value1 :String\n    value2 : Int\n  }\n\n   type Query {\n    \n    users: [User]\n  }\n\n  type Mutation{\n    register(email: String!, password: String!, firstName: String!, lastName: String!, accountNumber: Int!, sex: String!) : authenticatedUser\n    signIn(email: String!, password: String!) : authenticatedUser  \n    testMut(sex: String!) : testTypeQ\n    #testMut(value1: String!, value2: Int!) : testTypeQ\n  }\n"], ["\n  enum Sex{\n    Male\n    Female\n  }\n\n  type User{\n    id: Int\n    email: String!\n    firstName: String!\n    lastName : String!\n    password: String!\n    accountNumber : Int!\n    sex : Sex!\n  }\n\n  type authenticatedUser{\n    user :User\n    token : String\n  }\n  \n  type testTypeQ{\n    value1 :String\n    value2 : Int\n  }\n\n   type Query {\n    \n    users: [User]\n  }\n\n  type Mutation{\n    register(email: String!, password: String!, firstName: String!, lastName: String!, accountNumber: Int!, sex: String!) : authenticatedUser\n    signIn(email: String!, password: String!) : authenticatedUser  \n    testMut(sex: String!) : testTypeQ\n    #testMut(value1: String!, value2: Int!) : testTypeQ\n  }\n"])));
var users = [
    {
        id: 1,
        email: 'Liam@gmail.com',
        firstName: 'liam',
        lastName: 'Nelson',
        accountNumber: 2,
        sex: "Male"
    },
    {
        id: 2,
        email: 'Benji@gmail.com',
        firstName: 'Benjamin',
        lastName: 'Loyd',
        accountNumber: 4,
        sex: "Male"
    },
    {
        id: 4,
        email: 'Liya@gmail.com',
        firstName: 'Tres',
        lastName: 'Loy',
        accountNumber: 5,
        sex: "Female"
    },
    {
        id: 3,
        email: 'Glena@gmail.com',
        firstName: 'Glen',
        lastName: 'Lo',
        accountNumber: 7,
        sex: "Female"
    },
];
var registerUser = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, token;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                //TODO: check for unique email
                //encrypt password
                _a = user;
                return [4 /*yield*/, bcryptjs_1.default.hash(user.password.toString(), 10)];
            case 1: return [4 /*yield*/, (_b.sent()).toString()];
            case 2:
                //TODO: check for unique email
                //encrypt password
                _a.password = _b.sent();
                //store user
                users.push(user);
                token = jsonwebtoken_1.default.sign(user.id.toString(), SECRET);
                //send user with token
                return [2 /*return*/, {
                        token: token,
                        user: user
                    }];
        }
    });
}); };
var resolvers = {
    Query: {
        users: function () { return users; }
    },
    Mutation: {
        register: function (parent, _a, context) {
            var email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName, accountNumber = _a.accountNumber, sex = _a.sex;
            return __awaiter(void 0, void 0, void 0, function () {
                var newUser, authenticatedUserData;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            newUser = { id: -1, email: email, password: password, firstName: firstName, lastName: lastName, accountNumber: accountNumber, sex: sex };
                            return [4 /*yield*/, registerUser(newUser)];
                        case 1:
                            authenticatedUserData = _b.sent();
                            //Remove:
                            console.log(authenticatedUserData);
                            return [2 /*return*/, authenticatedUserData];
                    }
                });
            });
        },
        signIn: function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                user = { id: -1, accountNumber: 1, email: 'pspd@gmail.com', firstName: 'James', lastName: 'Grechen', password: 'ppp', sex: 'Male' };
                return [2 /*return*/, { user: user, token: '' }];
            });
        }); }
    }
};
var server = new apollo_server_1.ApolloServer({ typeDefs: typeDefs, resolvers: resolvers });
// The `listen` method launches a web server.
server.listen().then(function (_a) {
    var url = _a.url;
    console.log("\uD83D\uDE80 Server ready at " + url);
});
var templateObject_1;
