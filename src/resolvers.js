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
var token_util_1 = __importDefault(require("./utils/token.util"));
var bid_model_1 = __importDefault(require("./models/bid.model"));
var user_model_1 = __importDefault(require("./models/user.model"));
var account_model_1 = __importDefault(require("./models/account.model"));
var users_bid_model_1 = __importDefault(require("./models/users_bid.model"));
var SECRET = 'SECRET';
;
;
;
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
                token = jsonwebtoken_1.default.sign(String(registeredUser.id), SECRET);
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
//TODO: Eager loading, place bid, award bid
var signInUser = function (email, password) { return __awaiter(void 0, void 0, void 0, function () {
    var userMatch, user, validPassword, token, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, user_model_1.default.query()
                        .select('*')
                        .where('email', '=', email)];
            case 1:
                userMatch = _a.sent();
                if (!userMatch.length) return [3 /*break*/, 3];
                user = userMatch[0];
                return [4 /*yield*/, bcryptjs_1.default.compare(password, user.password)];
            case 2:
                validPassword = _a.sent();
                if (!validPassword)
                    throw new Error('Invalid login user name or Password');
                token = jsonwebtoken_1.default.sign(user.id.toString(), SECRET);
                return [2 /*return*/, { user: user, token: token }];
            case 3: throw new Error('Invalid login information');
            case 4:
                error_2 = _a.sent();
                throw new Error(error_2);
            case 5: return [2 /*return*/];
        }
    });
}); };
var getAllBids = function () { return __awaiter(void 0, void 0, void 0, function () {
    var bids;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bid_model_1.default.query()];
            case 1:
                bids = _a.sent();
                return [2 /*return*/, bids];
        }
    });
}); };
var createBid = function (bid, req) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, newBid;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                userId = token_util_1.default.getIdFromToken(req);
                console.log('User id is ', userId);
                return [4 /*yield*/, bid_model_1.default.query().insert(__assign(__assign({}, bid), { status: 'Open', creatorId: userId }))];
            case 1:
                newBid = _a.sent();
                return [2 /*return*/, newBid];
        }
    });
}); };
var updateBid = function (bid, req) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, oldBid, updatedBid, updateStatus, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                userId = token_util_1.default.getIdFromToken(req);
                return [4 /*yield*/, bid_model_1.default.query().findById(bid.id)];
            case 1:
                oldBid = _a.sent();
                if (!oldBid) return [3 /*break*/, 3];
                if (oldBid.creatorId !== userId)
                    throw new Error('You are only authorized to update bids you created');
                updatedBid = {
                    id: oldBid.id,
                    creatorId: oldBid.creatorId,
                    status: bid.status ? bid.status : oldBid.status,
                    description: bid.description ? bid.description : oldBid.description,
                    name: bid.name ? bid.name : oldBid.name,
                    startingPrice: bid.startingPrice ? bid.startingPrice : oldBid.startingPrice
                };
                return [4 /*yield*/, bid_model_1.default.query()
                        .findById(bid.id)
                        .patch(__assign({}, updatedBid))];
            case 2:
                updateStatus = _a.sent();
                if (!updateStatus)
                    throw new Error('Update failed');
                return [2 /*return*/, updatedBid];
            case 3: throw new Error('Bid does not exist');
            case 4:
                error_3 = _a.sent();
                throw new Error(error_3);
            case 5: return [2 /*return*/];
        }
    });
}); };
var deleteBid = function (bidId, req) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, bidToDelete, deleteStatus, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                userId = token_util_1.default.getIdFromToken(req);
                return [4 /*yield*/, bid_model_1.default.query().findById(bidId)];
            case 1:
                bidToDelete = _a.sent();
                if (!bidToDelete) return [3 /*break*/, 3];
                if (bidToDelete.creatorId !== userId)
                    throw new Error('You are only authorized to delete bids you created');
                return [4 /*yield*/, bid_model_1.default.query().deleteById(bidId)];
            case 2:
                deleteStatus = _a.sent();
                if (!deleteStatus)
                    throw new Error('Delete failed');
                return [2 /*return*/, bidToDelete];
            case 3: throw new Error('Bid does not exist');
            case 4:
                error_4 = _a.sent();
                throw new Error(error_4);
            case 5: return [2 /*return*/];
        }
    });
}); };
var placeBid = function (usersBid, req) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, user, userBalance, bidStatus, maxPlaced, placedUserBid, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                console.log('Here 2');
                userId = token_util_1.default.getIdFromToken(req);
                return [4 /*yield*/, user_model_1.default.query().findById(userId)];
            case 1:
                user = _a.sent();
                return [4 /*yield*/, account_model_1.default.query().select('amount').where('holdersEmail', '=', user.email)];
            case 2:
                userBalance = _a.sent();
                if (userBalance[0].amount < usersBid.amount)
                    throw new Error('You do not have enough balance in your account to place this bid.');
                return [4 /*yield*/, bid_model_1.default.query()
                        .select('status', 'startingPrice')
                        .where('id', '=', usersBid.bidId)];
            case 3:
                bidStatus = _a.sent();
                if (!bidStatus.length) return [3 /*break*/, 6];
                console.log('Here 3.1');
                if (bidStatus[0].status === 'Closed') {
                    console.log('Here 3.2');
                    throw new Error('This bid is closed');
                }
                if (bidStatus[0].startingPrice > usersBid.amount)
                    throw new Error('You can not place a bid lower than the starting price');
                console.log('Here 4');
                return [4 /*yield*/, users_bid_model_1.default.query()
                        .select('bidId')
                        .where('bidId', '=', usersBid.bidId)
                        .groupBy('bidId')
                        .max('amount')];
            case 4:
                maxPlaced = _a.sent();
                ;
                if (maxPlaced.length) {
                    if (maxPlaced[0].max > usersBid.amount)
                        throw new Error('You can place a bid that is lower than the highest bid already placed. Please place a higher bid');
                }
                usersBid.userId = userId;
                return [4 /*yield*/, users_bid_model_1.default.query().insert(__assign({}, usersBid))];
            case 5:
                placedUserBid = _a.sent();
                console.log('Here 5');
                return [2 /*return*/, placedUserBid];
            case 6: throw new Error('Bid not found');
            case 7:
                error_5 = _a.sent();
                throw new Error(error_5);
            case 8: return [2 /*return*/];
        }
    });
}); };
var awardBid = function (bidId, winnersId, req) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, userToBeAwarded, bidInfo, placedBid, awardedBid, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                userId = token_util_1.default.getIdFromToken(req);
                return [4 /*yield*/, user_model_1.default.query().findById(winnersId)];
            case 1:
                userToBeAwarded = _a.sent();
                console.log('User is ');
                console.log(userToBeAwarded);
                if (!userToBeAwarded)
                    throw new Error('The specified user does not exist');
                return [4 /*yield*/, bid_model_1.default.query()
                        .select('status', 'creatorId')
                        .where('id', '=', bidId)];
            case 2:
                bidInfo = _a.sent();
                if (!bidInfo.length) return [3 /*break*/, 6];
                if (bidInfo[0].status === 'Closed') {
                    throw new Error('This bid can not be awarded because it is closed');
                }
                if (bidInfo[0].creatorId !== userId) {
                    throw new Error('This bid is not yours to award');
                }
                return [4 /*yield*/, users_bid_model_1.default.query().select('amount').where('userId', '=', winnersId)];
            case 3:
                placedBid = _a.sent();
                if (!placedBid.length) return [3 /*break*/, 5];
                return [4 /*yield*/, bid_model_1.default.query().patchAndFetchById(bidId, {
                        awardedTo: winnersId,
                        status: 'Closed'
                    })];
            case 4:
                awardedBid = _a.sent();
                return [2 /*return*/, awardedBid];
            case 5: throw new Error('You can not award the bid to someone who has not placed a bid');
            case 6: throw new Error('Bid not found');
            case 7:
                error_6 = _a.sent();
                throw new Error(error_6);
            case 8: return [2 /*return*/];
        }
    });
}); };
var resolvers = {
    Query: {
        users: function () { return users; },
        bids: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, getAllBids()];
        }); }); }
    },
    Mutation: {
        register: function (parent, _a, context) {
            var email = _a.email, password = _a.password, firstName = _a.firstName, lastName = _a.lastName, accountNumber = _a.accountNumber, sex = _a.sex;
            return __awaiter(void 0, void 0, void 0, function () {
                var newUser, registeredUserData;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            newUser = { email: email, password: password, firstName: firstName, lastName: lastName, accountNumber: accountNumber, sex: sex };
                            return [4 /*yield*/, registerUser(newUser)];
                        case 1:
                            registeredUserData = _b.sent();
                            return [2 /*return*/, registeredUserData];
                    }
                });
            });
        },
        //TODO: do signIn
        signIn: function (parent, _a, context) {
            var email = _a.email, password = _a.password;
            return __awaiter(void 0, void 0, void 0, function () {
                var AuthenticatedUserData;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, signInUser(email, password)];
                        case 1:
                            AuthenticatedUserData = _b.sent();
                            return [2 /*return*/, AuthenticatedUserData];
                    }
                });
            });
        },
        createBid: function (parent, _a, context) {
            var name = _a.name, description = _a.description, startingPrice = _a.startingPrice;
            return __awaiter(void 0, void 0, void 0, function () {
                var newBid, createdBid;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            newBid = { name: name, description: description, startingPrice: startingPrice };
                            return [4 /*yield*/, createBid(newBid, context.req)];
                        case 1:
                            createdBid = _b.sent();
                            return [2 /*return*/, createdBid];
                    }
                });
            });
        },
        //updateBid(id: Int!, name : String, description : String, startingPrice: Float, status : BidStatus ) : Bid 
        updateBid: function (parent, _a, context) {
            var id = _a.id, name = _a.name, description = _a.description, startingPrice = _a.startingPrice, status = _a.status, creatorId = _a.creatorId;
            return __awaiter(void 0, void 0, void 0, function () {
                var oldBid, updatedBid;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            oldBid = { id: id, name: name, description: description, startingPrice: startingPrice, status: status, creatorId: creatorId };
                            return [4 /*yield*/, updateBid(oldBid, context.req)];
                        case 1:
                            updatedBid = _b.sent();
                            return [2 /*return*/, updatedBid];
                    }
                });
            });
        },
        deleteBid: function (parent, _a, context) {
            var id = _a.id;
            return __awaiter(void 0, void 0, void 0, function () {
                var deletedBid;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            console.log('Id is of type');
                            console.log(typeof id);
                            return [4 /*yield*/, deleteBid(id, context.req)];
                        case 1:
                            deletedBid = _b.sent();
                            return [2 /*return*/, deletedBid];
                    }
                });
            });
        },
        placeBid: function (parent, _a, context) {
            var bidId = _a.bidId, amount = _a.amount;
            return __awaiter(void 0, void 0, void 0, function () {
                var bidToPlace, palacedBid;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            bidToPlace = { bidId: bidId, amount: amount, userId: -1 };
                            console.log('Here 1');
                            return [4 /*yield*/, placeBid(bidToPlace, context.req)];
                        case 1:
                            palacedBid = _b.sent();
                            console.log('Here 6');
                            return [2 /*return*/, palacedBid];
                    }
                });
            });
        },
        awardBid: function (parent, _a, context) {
            var bidId = _a.bidId, winnersId = _a.winnersId;
            return __awaiter(void 0, void 0, void 0, function () {
                var awardedBid;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, awardBid(bidId, winnersId, context.req)];
                        case 1:
                            awardedBid = _b.sent();
                            return [2 /*return*/, awardedBid];
                    }
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
