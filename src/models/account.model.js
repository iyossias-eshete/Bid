"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var objection_1 = require("objection");
var Account = /** @class */ (function (_super) {
    __extends(Account, _super);
    function Account() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Account.tableName = 'account';
    Account.jsonSchema = {
        type: 'object',
        required: ['holdersFirstName', 'holdersLastName', 'amount', 'holdersEmail'],
        properties: {
            accountNumber: { type: 'number' },
            holdersEmail: { type: 'string' },
            holdersFirstName: { type: 'string' },
            holdersLastName: { type: 'string' },
            amount: { type: 'number' }
        }
    };
    return Account;
}(objection_1.Model));
exports.default = Account;
