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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_enum_1 = require("../utils/order.enum");
const express_1 = __importDefault(require("express"));
class OrderController {
    createOrderOffline(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderBody = req.body;
            if (!orderBody.customerName) {
                console.log("created order error: customerName is missing!");
                res.status(400).end(); // 400 -> bad request
                return;
            }
            const restaurantObj = yield services_1.RestaurantService.getInstance().getById(req.params.restaurant_id);
            // Verify if restaurant exist in DB
            if (restaurantObj === null) {
                console.log("created order error: Restaurant not found!");
                res.status(400).end(); // 400 -> bad request
                return;
            }
            try {
                const order = yield services_1.OrderService.getInstance().createOrder({
                    restaurant: restaurantObj,
                    customerName: orderBody.customerName,
                    productList: orderBody.productList,
                    menuList: orderBody.menuList,
                    price: yield services_1.OrderService.getInstance().calculatePrice(null, null),
                    mode: "Sur place" //TODO as enum
                });
                res.json(order);
            }
            catch (err) {
                console.log("created order !");
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
        });
    }
    createOrderOnline(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderBody = req.body;
            // Verify if restaurant exist in DB
            const restaurant = services_1.RestaurantService.getInstance().getById(req.params.restaurant_id);
            if (restaurant === null) {
                res.status(400).end(); // 400 -> bad request
                return;
            }
            // Get the user token
            const authorization = req.headers['authorization'];
            if (authorization === undefined) {
                res.status(401).end();
                return;
            }
            const parts = authorization.split(" ");
            if (parts.length !== 2) {
                res.status(401).end();
                return;
            }
            if (parts[0] !== 'Bearer') {
                res.status(401).end();
                return;
            }
            const token = parts[1];
            try {
                // Get customer user_id
                const user = yield services_1.AuthService.getInstance().getUserFromToken(token);
                if (user === null) {
                    res.status(401).end();
                    return;
                }
                const restaurantObj = yield services_1.RestaurantService.getInstance().getById(req.params.restaurant_id);
                const order = yield services_1.OrderService.getInstance().createOrder({
                    restaurant: restaurantObj,
                    customer: user,
                    customerName: user.firstName + " " + user.lastName,
                    productList: orderBody.productList,
                    menuList: orderBody.menuList,
                    price: yield services_1.OrderService.getInstance().calculatePrice(null, null),
                    mode: "A distance",
                    statusPreparation: order_enum_1.StatusPreparation.TODO
                });
                res.json(order);
            }
            catch (err) {
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
        });
    }
    getAllOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield services_1.OrderService.getInstance().getAll();
            res.json(orders);
        });
    }
    getHistoryOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the user token
            const authorization = req.headers['authorization'];
            if (authorization === undefined) {
                res.status(401).end();
                return;
            }
            const parts = authorization.split(" ");
            if (parts.length !== 2) {
                res.status(401).end();
                return;
            }
            if (parts[0] !== 'Bearer') {
                res.status(401).end();
                return;
            }
            const token = parts[1];
            const customer = yield services_1.AuthService.getInstance().getUserFromToken(token);
            if (customer === null) {
                res.status(401).end();
                return;
            }
            const orders = yield services_1.OrderService.getInstance().getAllOwn(customer._id);
            res.json(orders);
        });
    }
    getOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield services_1.OrderService.getInstance().getById(req.params.order_id);
                if (order === null) {
                    res.status(404).end();
                    return;
                }
                res.json(order);
            }
            catch (err) {
                res.status(400).end();
                return;
            }
        });
    }
    deleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield services_1.OrderService.getInstance().deleteById(req.params.order_id);
                if (success) {
                    res.status(204).end();
                }
                else {
                    res.status(404).end();
                }
            }
            catch (err) {
                res.status(400).end();
            }
        });
    }
    updateOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield services_1.OrderService.getInstance()
                    .updateById(req.params.order_id, req.body);
                if (!order) {
                    res.status(404).end();
                    return;
                }
                res.json(order);
            }
            catch (err) {
                res.status(400).end();
            }
        });
    }
    buildRoutes() {
        const router = express_1.default.Router();
        //Offline Order
        router.post('/offline/:restaurant_id', express_1.default.json(), this.createOrderOffline.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.use((0, middlewares_1.checkUserConnected)());
        // Online order
        router.post('/online/:restaurant_id', (0, middlewares_1.isCustomer)(), express_1.default.json(), this.createOrderOnline.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/allOrders', (0, middlewares_1.isAdmin)(), this.getAllOrders.bind(this));
        router.get('/historyOrder', (0, middlewares_1.isCustomer)(), this.getHistoryOrders.bind(this));
        router.get('/:order_id', (0, middlewares_1.canSeeOrder)(), this.getOrder.bind(this));
        //router.get('customer/:order_id', isCustomer(), this.getCustomerOrder.bind(this));
        router.delete('/:order_id', (0, middlewares_1.isAdmin)(), this.deleteOrder.bind(this));
        router.put('/:order_id', express_1.default.json(), this.updateOrder.bind(this));
        return router;
    }
}
exports.OrderController = OrderController;
const middlewares_1 = require("../middlewares");
const services_1 = require("../services");
//# sourceMappingURL=order.controller.js.map