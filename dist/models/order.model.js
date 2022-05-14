"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
require("./product.model");
const order_enum_1 = require("../utils/order.enum");
const orderSchema = new mongoose_1.Schema({
    restaurant: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: "restaurant"
    },
    customer: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "user"
    },
    customerName: {
        type: mongoose_1.Schema.Types.String,
        required: true
    },
    menuList: [{
            type: mongoose_1.Schema.Types.String
        }],
    productList: [{
            type: mongoose_1.Schema.Types.String
        }],
    price: {
        type: mongoose_1.Schema.Types.Number,
        required: true
    },
    mode: {
        type: mongoose_1.Schema.Types.String,
        required: true
    },
    statusPreparation: {
        type: mongoose_1.Schema.Types.String,
        default: order_enum_1.StatusPreparation.TODO
    }
}, {
    collection: "order",
    timestamps: true,
    versionKey: false
});
exports.OrderModel = mongoose_1.default.model("Order", orderSchema);
//# sourceMappingURL=order.model.js.map