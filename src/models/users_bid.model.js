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
var UsersBid = /** @class */ (function (_super) {
    __extends(UsersBid, _super);
    function UsersBid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UsersBid.tableName = 'users_bid';
    UsersBid.jsonSchema = {
        type: 'object',
        required: ['userId', 'bidId', 'bidAmount'],
        properties: {
            userId: { type: 'number' },
            bidId: { type: 'number' },
            bidAmount: { type: 'number' },
        }
    };
    return UsersBid;
}(objection_1.Model));
exports.default = UsersBid;
