"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var SECRET = 'SECRET';
var getIdFromToken = function (req) {
    try {
        var Authorization = req.header('authorization');
        if (Authorization === undefined || Authorization === null)
            throw new Error('Authorization bearer token not provided.');
        var token = Authorization.replace('Bearer ', '');
        var userId = Number(jsonwebtoken_1.default.verify(token, SECRET));
        return userId;
    }
    catch (error) {
        throw new Error(error);
    }
};
var utils = {
    getIdFromToken: getIdFromToken
};
exports.default = utils;
