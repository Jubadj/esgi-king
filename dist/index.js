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
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const express_1 = __importDefault(require("express"));
const controllers_1 = require("./controllers");
const mongoose_1 = __importDefault(require("mongoose"));
const admin_controller_1 = require("./controllers/admin.controller");
const bigBoss_controller_1 = require("./controllers/bigBoss.controller");
const setMenu_controller_1 = require("./controllers/setMenu.controller");
const order_controller_1 = require("./controllers/order.controller");
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const m = yield mongoose_1.default.connect(process.env.MONGO_URI, {
            auth: {
                username: process.env.MONGO_USER,
                password: process.env.MONGO_PASSWORD
            }
        });
        const app = (0, express_1.default)();
        const authController = new controllers_1.AuthController();
        app.use('/auth', authController.buildRoutes());
        const restaurantController = new controllers_1.RestaurantController();
        app.use('/restaurant', restaurantController.buildRoutes()); // enregistrement d'un routeur
        const adminController = new admin_controller_1.AdminController();
        app.use('/admin', adminController.buildRoutes()); // enregistrement d'un routeur
        const bigBossController = new bigBoss_controller_1.BigBossController();
        app.use('/bigBoss', bigBossController.buildRoutes()); // enregistrement d'un routeur
        const productController = new controllers_1.ProductController();
        app.use('/product', productController.buildRoutes()); // enregistrement d'un routeur
        const setMenuController = new setMenu_controller_1.SetMenuController();
        app.use('/setMenu', setMenuController.buildRoutes()); // enregistrement d'un routeur
        const orderController = new order_controller_1.OrderController();
        app.use('/order', orderController.buildRoutes()); // enregistrement d'un routeur
        app.listen(process.env.PORT, function () {
            console.log("Server listening on port " + process.env.PORT);
        });
    });
}
startServer().catch(console.error);
//# sourceMappingURL=index.js.map