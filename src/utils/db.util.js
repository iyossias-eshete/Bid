"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var knex_1 = __importDefault(require("knex"));
var knexfile_1 = __importDefault(require("../../knexfile"));
var objection_1 = require("objection");
var dbInitializer = function () {
    var knex = {};
    var knexEnvironment = process.env.KNEX_ENVIRONMENT;
    if (knexEnvironment == 'production')
        knex = knex_1.default(knexfile_1.default.production);
    if (knexEnvironment == 'staging')
        knex = knex_1.default(knexfile_1.default.staging);
    else
        knex = knex_1.default(knexfile_1.default.development);
    objection_1.Model.knex(knex);
};
exports.default = dbInitializer;
