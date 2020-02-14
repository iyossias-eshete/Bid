"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var SECRET = 'SECRET';
;
;
//data source
var accounts = [
    {
        accountNumber: 1,
        accountHolderFirstName: 'Leroy',
        accountHolderLastName: 'Sane',
        amount: 500000
    },
    {
        accountNumber: 2,
        accountHolderFirstName: 'Thomas',
        accountHolderLastName: 'Tukils',
        amount: 2500000
    },
    {
        accountNumber: 3,
        accountHolderFirstName: 'Collins',
        accountHolderLastName: 'Muller',
        amount: 2500
    },
    {
        accountNumber: 12,
        accountHolderFirstName: 'Ben',
        accountHolderLastName: 'Orlando',
        amount: 1000
    }
];
var users = [
    // {
    //   id: 1,
    //   email: 'Liam@gmail.com',
    //   firstName: 'liam',
    //   lastName: 'Nelson',
    //   accountNumber: 2,
    //   sex: "Male",
    //   password:'ajksdhjashdjksa277319812'
    // },
    {
        id: 2,
        email: 'Benji@gmail.com',
        firstName: 'Benjamin',
        lastName: 'Loyd',
        accountNumber: 4,
        sex: "Male",
        password: 'ajksdhjashdjksa277319812'
    },
    {
        id: 4,
        email: 'Liya@gmail.com',
        firstName: 'Tres',
        lastName: 'Loy',
        accountNumber: 5,
        sex: "Female",
        password: 'ajksdhjashdjksa277319812'
    },
    {
        id: 3,
        email: 'Glena@gmail.com',
        firstName: 'Glen',
        lastName: 'Lo',
        accountNumber: 7,
        sex: "Female",
        password: 'ajksdhjashdjksa277319812'
    },
    {
        id: 5,
        firstName: "LeRoY",
        lastName: "sAnE",
        email: "Leroy@ManCity.com",
        accountNumber: 1,
        sex: "Male",
        password: "$2a$10$adJvj/GLNx7O0qH1XGRLX.NHUEbHDrmoOQxS1KuDQENrCDx7UMRmK" //ManCity
        //bearer eyJhbGciOiJIUzI1NiJ9.NQ.iDIkQeIGNPBDihC2GVVoC1bIKjLiQMiEhMN2ebkeMsI
    }
];
var bids = [
    {
        id: 1,
        name: 'Paradise',
        description: 'By Micheal Angelo. High quality imitation',
        startingPrice: 100000,
        creatorId: 1,
        status: 'Open'
    },
    {
        id: 2,
        name: 'Jackson Gloves',
        description: 'Micheal Jackson\'s original gold gloves.',
        startingPrice: 5000000,
        creatorId: 3,
        status: 'Open'
    },
    {
        id: 3,
        status: 'Open',
        name: 'The Medievals',
        description: 'Poems collections from various ancient literates.',
        startingPrice: 30000,
        creatorId: 2,
    },
    {
        id: 4,
        name: 'The Mac',
        description: '1974 Apple laptop. Still stunning.',
        startingPrice: 2000,
        creatorId: 4,
        status: 'Open'
    }
];
var user_model_1 = __importDefault(require("./models/user.model"));
var account_model_1 = __importDefault(require("./models/account.model"));
var registerUser = function (user) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userExists, existingAccount, registeredUser, token, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                _a = user;
                return [4 /*yield*/, bcryptjs_1.default.hash(user.password.toString(), 10)];
            case 1:
                _a.password = (_b.sent()).toString();
                return [4 /*yield*/, user_model_1.default.query()
                        .select('email')
                        .where('email', '=', user.email)];
            case 2:
                userExists = _b.sent();
                if (userExists.length)
                    throw new Error('Account with the specified email already exists');
                return [4 /*yield*/, account_model_1.default.query().findById(user.accountNumber)];
            case 3:
                existingAccount = _b.sent();
                if (!existingAccount) return [3 /*break*/, 5];
                if (existingAccount.holdersEmail !== user.email || existingAccount.holdersFirstName !== user.firstName || existingAccount.holdersLastName !== user.lastName)
                    throw new Error('Account number you specified belongs to someone else');
                return [4 /*yield*/, user_model_1.default.query().insert(__assign({}, user))];
            case 4:
                registeredUser = _b.sent();
                console.log('RU id');
                console.log(registeredUser.id);
                token = jsonwebtoken_1.default.sign(String(registeredUser.id), SECRET);
                console.log('Sending user with token');
                console.log(registeredUser, token);
                return [2 /*return*/, { user: registeredUser, token: token }];
            case 5:
                ;
                throw new Error('Please enter a vaild account. The account does not belong to you');
            case 6:
                error_1 = _b.sent();
                throw new Error(error_1);
            case 7: return [2 /*return*/];
        }
    });
}); };
/*
const registerUser = async (user: userType) => {
  //TODO: check for unique email

  //encrypt password
  user.password = (await bcrypt.hash(user.password.toString(), 10)).toString();

  //verify specified account
  let userAccount = accounts.find(account => account.accountNumber === user.accountNumber
    && account.accountHolderFirstName.toLowerCase() === user.firstName.toLowerCase()
    && account.accountHolderLastName.toLowerCase() === user.lastName.toLowerCase());
  if (!userAccount)
    throw new Error('Invalid Bank Account');

  // check if account already exists

  let existingAccount = users.find(existingUser => existingUser.accountNumber === user.accountNumber);
  if (existingAccount)
    throw new Error('You already have an account. Try logging in instead');
  //userType

  //store user
  user.id = users.length + 1;
  users.push(user);

  //generate token
  let token = jwt.sign(user.id.toString(), SECRET);

  //send user with token
  return {
    token,
    user
  }

};
*/
var accountVerifier = function () {
    //email check
    //
};
var bidCreator = function (bid, userId) { return __awaiter(void 0, void 0, void 0, function () {
    var userBid;
    return __generator(this, function (_a) {
        userBid = __assign({}, bid);
        userBid.creatorId = userId;
        userBid.id = bids.length + 1;
        bids.push(userBid);
        //send bid to user
        return [2 /*return*/, userBid];
    });
}); };
var resolvers = {
    Query: {
        users: function () { return users; },
        bids: function () { return bids; }
    },
    Mutation: {
        register: function (parent, _a, context) {
            var email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName, accountNumber = _a.accountNumber, sex = _a.sex;
            return __awaiter(void 0, void 0, void 0, function () {
                var newUser, AuthenticatedUserData;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            newUser = { email: email, password: password, firstName: firstName, lastName: lastName, accountNumber: accountNumber, sex: sex };
                            return [4 /*yield*/, registerUser(newUser)];
                        case 1:
                            AuthenticatedUserData = _b.sent();
                            return [2 /*return*/, AuthenticatedUserData];
                    }
                });
            });
        },
        //TODO: do signIn
        signIn: function (parent, _a, context) {
            var email = _a.email, password = _a.password;
            return __awaiter(void 0, void 0, void 0, function () {
                var user, validPassword, token;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            user = users.find(function (user) { return user.email === email; });
                            if (!user) {
                                throw new Error('Your account does not exist.');
                            }
                            return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
                        case 1:
                            validPassword = _b.sent();
                            if (!validPassword) {
                                throw new Error('Invalid email or password');
                            }
                            token = jsonwebtoken_1.default.sign(user.id.toString(), SECRET);
                            //send user
                            return [2 /*return*/, { user: user, token: token }];
                    }
                });
            });
        },
        createBid: function (parent, _a, context) {
            var name = _a.name, description = _a.description, startingPrice = _a.startingPrice;
            return __awaiter(void 0, void 0, void 0, function () {
                var userId, Authorization, token, newBid;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            userId = undefined;
                            //util
                            try {
                                Authorization = context.req.get('Authorization');
                                if (Authorization === undefined)
                                    throw new Error('Authorization bearer token not provided.');
                                token = Authorization.replace('Bearer ', '');
                                userId = Number(jsonwebtoken_1.default.verify(token, SECRET));
                            }
                            catch (error) {
                                throw new Error(error);
                            }
                            newBid = { id: -1, name: name, description: description, startingPrice: startingPrice, status: 'Open', creatorId: -1 };
                            return [4 /*yield*/, bidCreator(newBid, userId)];
                        case 1:
                            newBid = _b.sent();
                            return [2 /*return*/, newBid];
                    }
                });
            });
        },
        //updateBid(id: Int!, name : String, description : String, startingPrice: Float, status : BidStatus ) : Bid 
        updateBid: function (parent, _a, context) {
            var id = _a.id, name = _a.name, description = _a.description, startingPrice = _a.startingPrice, status = _a.status;
            return __awaiter(void 0, void 0, void 0, function () {
                var userId, bid;
                return __generator(this, function (_b) {
                    userId = verifyUser(context.req);
                    bid = bids.find(function (bid) { return bid.id === id; });
                    if (!bid)
                        throw new Error('Bid could not be found');
                    if (bid.creatorId !== userId)
                        throw new Error('You are only authorized to update the bids you created');
                    //updates bid in the array obj
                    bid.name = name ? name.toString() : bid.name;
                    bid.description = description ? description.toString() : bid.description;
                    bid.startingPrice = startingPrice ? Number(startingPrice) : bid.startingPrice;
                    bid.status = status ? status : bid.status;
                    return [2 /*return*/, bid];
                });
            });
        },
        deleteBid: function (parent, _a, context) {
            var id = _a.id;
            return __awaiter(void 0, void 0, void 0, function () {
                var userId, bid, deletedBidId;
                return __generator(this, function (_b) {
                    userId = verifyUser(context.req);
                    bid = bids.find(function (bid) { return bid.id === id; });
                    if (!bid)
                        throw new Error('Bid could not be found');
                    if (bid.creatorId !== userId)
                        throw new Error('You are only authorized to delete the bids you created');
                    deletedBidId = bid.id;
                    bid.id = NaN;
                    bid.description = '';
                    bid.name = '';
                    bid.status = 'Closed',
                        bid.startingPrice = -1;
                    bid.creatorId = NaN;
                    return [2 /*return*/, deletedBidId];
                });
            });
        }
    }
};
var verifyUser = function (req) {
    //util
    var userId = undefined;
    try {
        var Authorization = req.get('Authorization');
        if (Authorization === undefined)
            throw new Error('Authorization bearer token not provided.');
        var token = Authorization.replace('Bearer ', '');
        userId = Number(jsonwebtoken_1.default.verify(token, SECRET));
    }
    catch (error) {
        throw new Error(error);
    }
    // end-of-util
    return userId;
};
exports.default = resolvers;
