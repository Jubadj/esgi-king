import {StatusPreparation} from "../utils/order.enum";

import express, {Router, Request, Response, RequestHandler} from "express";

export class OrderController {

    async createOrderOffline(req: Request, res: Response) {
        const orderBody = req.body;
        if (!orderBody.customerName){
            console.log("created order error: customerName is missing!");
            res.status(400).end(); // 400 -> bad request
            return;
        }

        const restaurantObj = await RestaurantService.getInstance().getById(req.params.restaurant_id);
        // Verify if restaurant exist in DB
        if(restaurantObj === null ){
            console.log("created order error: Restaurant not found!");
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const order = await OrderService.getInstance().createOrder({
                restaurant: restaurantObj,
                customerName: orderBody.customerName,
                productList: orderBody.productList,
                menuList: orderBody.menuList,
                price: await OrderService.getInstance().calculatePrice(null, null),
                mode: "Sur place" //TODO as enum
            });
            res.json(order);
        } catch(err) {
            console.log("created order !");
            res.status(400).end(); // erreur des données utilisateurs
            return;
        }
    }

    async createOrderOnline(req: Request, res: Response) {
        const orderBody = req.body;

        // Verify if restaurant exist in DB
        const restaurant = RestaurantService.getInstance().getById(req.params.restaurant_id);
        if(restaurant === null ){
            res.status(400).end(); // 400 -> bad request
            return;
        }

        // Get the user token
        const authorization = req.headers['authorization'];
        if(authorization === undefined) {
            res.status(401).end();
            return;
        }
        const parts = authorization.split(" ");
        if(parts.length !== 2) {
            res.status(401).end();
            return;
        }
        if(parts[0] !== 'Bearer') {
            res.status(401).end();
            return;
        }
        const token = parts[1];
        try {
            // Get customer user_id
            const user = await AuthService.getInstance().getUserFromToken(token);
            if(user === null) {
                res.status(401).end();
                return;
            }

            const restaurantObj = await RestaurantService.getInstance().getById(req.params.restaurant_id);
            const order = await OrderService.getInstance().createOrder({
                restaurant: restaurantObj,
                customer: user,
                customerName: user.firstName + " " + user.lastName,
                productList: orderBody.productList,
                menuList: orderBody.menuList,
                price: await OrderService.getInstance().calculatePrice(null, null),//TODO calculate price
                mode: "A distance",
                statusPreparation: StatusPreparation.TODO
            });
            res.json(order);
        } catch(err) {
            res.status(400).end(); // erreur des données utilisateurs
            return;
        }
    }

    async getAllOrders(req: Request, res: Response) {
        const orders = await OrderService.getInstance().getAll();
        res.json(orders);
    }

    async getHistoryOrders(req: Request, res: Response) {
        // Get the user token
        const authorization = req.headers['authorization'];
        if(authorization === undefined) {
            res.status(401).end();
            return;
        }
        const parts = authorization.split(" ");
        if(parts.length !== 2) {
            res.status(401).end();
            return;
        }
        if(parts[0] !== 'Bearer') {
            res.status(401).end();
            return;
        }
        const token = parts[1];
        const customer = await AuthService.getInstance().getUserFromToken(token);
        if(customer === null) {
            res.status(401).end();
            return;
        }
        const orders = await OrderService.getInstance().getAllOwn(customer._id);
        res.json(orders);
    }

    async getOrder(req: Request, res: Response) {
        try {
            const order = await OrderService.getInstance().getById(req.params.order_id);
            if(order === null) {
                res.status(404).end();
                return;
            }
            res.json(order);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async deleteOrder(req: Request, res: Response) {
        try {
            const success = await OrderService.getInstance().deleteById(req.params.order_id);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateOrder(req: Request, res: Response) {
        try {
            const order = await OrderService.getInstance()
                .updateById(req.params.order_id, req.body);
            if(!order) {
                res.status(404).end();
                return;
            }
            res.json(order);
        } catch (err) {
            res.status(400).end();
        }
    }

    async updateOrderStatus(req: Request, res: Response) {
        try {
            const order = await OrderService.getInstance()
                .updateStatus(req.params.order_id, req.body.statusPreparation);
            if(!order) {
                console.log("problem with order");
                res.status(404).end();
                return;
            }
            res.json(order);
        } catch (err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();

        //Offline Order
        router.post('/offline/:restaurant_id', express.json(), this.createOrderOffline.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.use(checkUserConnected());
        // Online order
        router.post('/online/:restaurant_id', isCustomer(), express.json(), this.createOrderOnline.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/allOrders', isAdmin(), this.getAllOrders.bind(this));

        router.get('/historyOrder', isCustomer(), this.getHistoryOrders.bind(this));
        router.get('/:order_id', canSeeOrder(), this.getOrder.bind(this));

        router.delete('/:order_id', isAdmin(), this.deleteOrder.bind(this));
        router.put('/:order_id', isAdmin(), express.json(), this.updateOrder.bind(this));

        router.put('/status/:order_id', canChangeOrderStatus(), this.updateOrderStatus.bind(this));
        return router;
    }
}
import {
    checkUserConnected,
    canSeeProduct,
    isAdmin,
    isBigBoss,
    isCustomer,
    isPreparer,
    ROLE,
    canSeeOrder, canChangeOrderStatus
} from "../middlewares";

import {AuthService, OrderService, RestaurantService} from "../services";
import {SecurityUtils} from "../utils";
import {AuthController} from "./auth.controller";
