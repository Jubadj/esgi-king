"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const models_1 = require("../models");
class OrderService {
    constructor() { }
    static getInstance() {
        if (OrderService.instance === undefined) {
            OrderService.instance = new OrderService();
        }
        return OrderService.instance;
    }
    createOrder(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = new models_1.OrderModel(props);
            return yield model.save();
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.OrderModel.find().exec();
        });
    }
    getAllOwn(customer_id) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.OrderModel.find({ "customer": customer_id }).exec();
        });
    }
    getById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.OrderModel.findById(orderId).exec();
        });
    }
    deleteById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield models_1.OrderModel.deleteOne({ _id: orderId }).exec();
            return res.deletedCount === 1;
        });
    }
    // TODO
    calculatePrice(productList, menuList) {
        return __awaiter(this, void 0, void 0, function* () {
            // for (let i = 0; i < productList.lenght; i++) {
            //     console.log ("Block statement execution no." + i);
            // }
            // for (let i = 0; i < menuList.lenght; i++) {
            //     console.log ("Block statement execution no." + i);
            // }
            return 5;
        });
    }
    updateById(orderId, props) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield this.getById(orderId);
            if (!order) {
                return null;
            }
            if (props.restaurant !== undefined) {
                order.restaurant = props.restaurant;
            }
            if (props.customerName !== undefined) {
                order.customerName = props.customerName;
            }
            if (props.productList !== undefined) {
                order.productList = props.productList;
            }
            if (props.menuList !== undefined) {
                order.menuList = props.menuList;
            }
            if (props.price !== undefined) {
                order.price = props.price;
            }
            if (props.mode !== undefined) {
                order.mode = props.mode;
            }
            if (props.statusPreparation !== undefined) {
                order.statusPreparation = props.statusPreparation;
            }
            return yield order.save();
        });
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map