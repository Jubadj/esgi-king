import {config} from "dotenv";
config();

import express from "express";
import {AuthController, RestaurantController} from "./controllers";
import mongoose, {Mongoose} from "mongoose";

async function startServer(): Promise<void> {

    const m: Mongoose = await mongoose.connect(process.env.MONGO_URI as string, {
        auth: {
            username: process.env.MONGO_USER  as string,
            password: process.env.MONGO_PASSWORD as string
        }
    });

    const app = express();

    const authController = new AuthController();
    app.use('/auth', authController.buildRoutes())

    const restaurantController = new RestaurantController();
    app.use('/restaurant', restaurantController.buildRoutes()); // enregistrement d'un routeur

    app.listen(process.env.PORT, function() {
        console.log("Server listening on port " + process.env.PORT);
    });
}

startServer().catch(console.error);
