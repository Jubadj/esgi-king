export class OrderController {

    async createOrder(req: Request, res: Response) {
        const orderBody = req.body;
        if(!orderBody.restaurant || !orderBody.customer) {
            res.status(400).end(); // 400 -> bad request
            return;
        }

        const restaurantObj = await RestaurantService.getInstance().getById(orderBody.restaurant);
        const customerObj = await AuthService.getInstance().getById(orderBody.customer);
        try {
            if ( !restaurantObj || !customerObj ){
                res.status(400).end(); // 400 ->bad request
            }
            const order = await OrderService.getInstance().createOrder({
                restaurant: restaurantObj,
                customer: customerObj,
                productList: orderBody.productList,
                menuList: orderBody.menuList,
                mode: orderBody.mode
            });
            res.json(order);
        } catch(err) {
            res.status(400).end(); // erreur des données utilisateurs
            return;
        }
    }

    async createOrderOnline(req: Request, res: Response) {
        const orderBody = req.body;
        //Verify if we have all written attributes in the body
        if(!orderBody.restaurant) {
            res.status(400).end(); // 400 -> bad request
            return;
        }

        // Verify if restaurant exist in DB
        const restaurant = RestaurantService.getInstance().getById(orderBody.restaurant);
        if(restaurant === null ){
            res.status(400).end(); // 400 -> bad request
            return;
        }

        // Get the user token
        const authorization = req.headers['authorization'];
        if(authorization === undefined) {
            console.log("test")
            res.status(401).end();
            return;
        }
        const parts = authorization.split(" ");
        if(parts.length !== 2) {
            console.log("test2")
            res.status(401).end();
            return;
        }
        if(parts[0] !== 'Bearer') {
            console.log("test3")
            res.status(401).end();
            return;
        }
        const token = parts[1];
        try {
            // Get customer user_id
            const user = await AuthService.getInstance().getUserFromToken(token);
            if(user === null) {
                console.log("test4")
                res.status(401).end();
                return;
            }
            const customer_id = user._id;
            const restaurantObj = await RestaurantService.getInstance().getById(orderBody.restaurant);
            const order = await OrderService.getInstance().createOrder({
                restaurant: restaurantObj,
                customer: user,
                productList: orderBody.productList,
                menuList: orderBody.menuList,
                price: orderBody.price,
                mode: orderBody.mode,
                statusPreparation: orderBody.statusPreparation
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

    buildRoutes(): Router {
        const router = express.Router();

        // When in restaurant "Sur place"
        router.post('/', express.json(), isCustomer(), this.createOrder.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        // Online order
        //router.post('/online', express.json(), checkUserConnected(), isCustomer(), this.createOrderOnline.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.post('/online', express.json(),  this.createOrderOnline.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/', checkUserConnected(), canSeeProduct(), this.getAllOrders.bind(this));
        router.get('/:order_id', checkUserConnected(), canSeeProduct(), this.getOrder.bind(this));
        router.delete('/:order_id', checkUserConnected(), canSeeProduct(), this.deleteOrder.bind(this));
        router.put('/:order_id', express.json(), checkUserConnected(), canSeeProduct(), this.updateOrder.bind(this));
        return router;
    }
}

import express, {Router, Request, Response} from "express";
import {checkUserConnected, canSeeProduct, isAdmin, isBigBoss, isCustomer, isPreparer} from "../middlewares";

import {AuthService, OrderService, RestaurantService} from "../services";
