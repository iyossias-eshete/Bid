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
var Bid = /** @class */ (function (_super) {
    __extends(Bid, _super);
    function Bid() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bid.tableName = 'bid';
    Bid.jsonSchema = {
        type: 'object',
        required: ['name', 'description',],
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            startingPrice: { type: 'number' },
            creatorId: { type: 'number' },
            status: { type: 'string' },
            awardedTo: { type: 'number' }
        }
    };
    return Bid;
}(objection_1.Model));
exports.default = Bid;
