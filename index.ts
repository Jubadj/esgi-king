const cors = require('cors');
import {config} from "dotenv";
config();

import express from "express";
import {AuthController, DiscountController, ProductController, RestaurantController} from "./controllers";
import mongoose, {Mongoose} from "mongoose";
import {AdminController} from "./controllers/admin.controller";
import {BigBossController} from "./controllers/bigBoss.controller";
import {SetMenuController} from "./controllers/setMenu.controller";
import {OrderController} from "./controllers/order.controller";


async function startServer(): Promise<void> {

    const m: Mongoose = await mongoose.connect(process.env.MONGO_URI as string, {
        auth: {
            username: process.env.MONGO_USER  as string,
            password: process.env.MONGO_PASSWORD as string
        }
    });

    const app = express();

    app.use(express.json());

    app.use(cors());

    const authController = new AuthController();
    app.use('/auth', authController.buildRoutes())

    const restaurantController = new RestaurantController();
    app.use('/restaurant', restaurantController.buildRoutes()); // enregistrement d'un routeur

    const adminController = new AdminController();
    app.use('/admin', adminController.buildRoutes()); // enregistrement d'un routeur

    const bigBossController = new BigBossController();
    app.use('/bigBoss', bigBossController.buildRoutes()); // enregistrement d'un routeur

    const productController = new ProductController();
    app.use('/product', productController.buildRoutes()); // enregistrement d'un routeur

    const setMenuController = new SetMenuController();
    app.use('/setMenu', setMenuController.buildRoutes()); // enregistrement d'un routeur

    const orderController = new OrderController();
    app.use('/order', orderController.buildRoutes()); // enregistrement d'un routeur

    const discountController = new DiscountController();
    app.use('/discount', discountController.buildRoutes()); // enregistrement d'un routeur

    app.listen(process.env.PORT, function() {
        console.log("Server listening on port " + process.env.PORT);
    });
}

startServer().catch(console.error);
