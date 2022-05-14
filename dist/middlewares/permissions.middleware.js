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
exports.canSeeOrder = exports.canSeeProduct = void 0;
const services_1 = require("../services");
const auth_middleware_1 = require("./auth.middleware");
function canSeeProduct() {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = req.headers['authorization'];
            if (authorization === undefined) {
                res.status(401).end();
                return;
            }
            const parts = authorization.split(" ");
            const token = parts[1];
            try {
                const user = yield services_1.AuthService.getInstance().getUserFrom(token);
                if (user === null || user.role !== auth_middleware_1.ROLE.ADMIN || user.role !== auth_middleware_1.ROLE.CUSTOMER || user.role !== auth_middleware_1.ROLE.PREPARER) {
                    res.status(401).end();
                    return;
                }
                req.user = user;
                next();
            }
            catch (err) {
                res.status(401).end();
            }
        });
    };
}
exports.canSeeProduct = canSeeProduct;
// If is customer, verify his id with the id in the order
function canSeeOrder() {
    return function (req, res, next) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const authorization = req.headers['authorization'];
            if (authorization === undefined) {
                res.status(401).end();
                return;
            }
            const parts = authorization.split(" ");
            const token = parts[1];
            try {
                const user = yield services_1.AuthService.getInstance().getUserFrom(token);
                const order = yield services_1.OrderService.getInstance().getById(req.params.order_id);
                if (user === null || order === null) {
                    console.log("Order or user problem");
                    res.status(401).end();
                    return;
                }
                if (user.role === auth_middleware_1.ROLE.CUSTOMER) {
                    console.log(user._id);
                    console.log((_a = order.customer) === null || _a === void 0 ? void 0 : _a._id);
                    if (!((_b = order.customer) === null || _b === void 0 ? void 0 : _b._id.equals(user._id))) {
                        console.log("This is not your order ;) : Incorrect customer id");
                        res.status(401).end();
                        return;
                    }
                }
                next();
            }
            catch (err) {
                res.status(401).end();
            }
        });
    };
}
exports.canSeeOrder = canSeeOrder;
//# sourceMappingURL=permissions.middleware.js.map