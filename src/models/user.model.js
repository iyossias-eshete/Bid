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
var User = /** @class */ (function (_super) {
    __extends(User, _super);
    function User() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    User.tableName = 'user';
    User.jsonSchema = {
        type: 'object',
        required: ['email', 'password', 'firstName', 'lastName', 'accountNumber', 'sex'],
        properties: {
            id: { type: 'integer' },
            email: { type: 'string' },
            password: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            accountNumber: { type: 'integer' },
            sex: { type: 'string' }
        }
    };
    return User;
}(objection_1.Model));
exports.default = User;
