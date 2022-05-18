import {Mode, StatusPreparation} from "../utils/order.enum";

import express, {Router, Request, Response} from "express";

export class OrderController {

    async createOrderOffline(req: Request, res: Response) {
        const orderBody = req.body;
        if (!orderBody.customerName){
            res.status(400).end().json("created order error: customerName is missing!"); // 400 -> bad request
            return;
        }

        const restaurantObj = await RestaurantService.getInstance().getById(req.params.restaurant_id);
        // Verify if restaurant exist in DB
        if(restaurantObj === null ){
            res.status(400).end().json("created order error: Restaurant not found!"); // 400 -> bad request
            return;
        }
        try {
            const order = await OrderService.getInstance().createOrder({
                restaurant: restaurantObj,
                customerName: orderBody.customerName,
                productList: orderBody.productList,
                menuList: orderBody.menuList,
                price: await OrderService.getInstance().calculatePrice(orderBody.productList, orderBody.menuList),
                mode: Mode.ONSITE,
                paid: false
            });
            res.json(order);
        } catch(err) {
            res.status(400).end().json("created order error!"); // erreur des données utilisateurs
            return;
        }
    }

    async createOrderOnline(req: Request, res: Response) {
        const orderBody = req.body;

        // Verify if restaurant exist in DB
        const restaurant = RestaurantService.getInstance().getById(req.params.restaurant_id);
        if(restaurant === null ){
            res.status(400).end().json("createOrderOnline error: restaurant not found."); // 400 -> bad request
            return;
        }

        if (!orderBody.productList && !orderBody.menuList){
            res.status(400).end().json("createOrderOnline error: Not products or menu indicated."); // 400 -> bad request
            return;
        }

        if(orderBody.productList){
            const products = orderBody.productList;
            for (let i=0; i<products.length; i++){
                const product = await ProductService.getInstance().getByName(products[i]);
                if(!product){
                    res.status(400).end().json("createOrderOnline error: Product not found in DB"); // 400 -> bad request
                    return;
                }
            }
        }
        if(orderBody.menuList){
            const menus = orderBody.menuList;
            for (let i=0; i<menus.length; i++){
                const menu = await MenuService.getInstance().getByName(menus[i]);
                if(!menu){
                    res.status(400).end().json("createOrderOnline error: menu not found!"); // 400 -> bad request
                    return;
                }
            }
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
                price: await OrderService.getInstance().calculatePrice(orderBody.productList, orderBody.menuList),
                mode: Mode.INDELIVERY,
                statusPreparation: StatusPreparation.TODO,
                paid: false
            });
            res.json(order);
        } catch(err) {
            res.status(400).end().json("createOrderOnline error"); // erreur des données utilisateurs
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
            console.log("Bad params");
            res.status(400).end();
        }
    }

    async payOrder(req: Request, res: Response) {
        try {
            const order = await OrderService.getInstance()
                .pay(req.params.order_id, req.body.price, req.body.discount);

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

    async prepareOrder(req: Request, res: Response){
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
        const preparer = await AuthService.getInstance().getUserFromToken(token);
        if(preparer === null) {
            res.status(401).end();
            return;
        }
        try {
            const order = await OrderService.getInstance().prepare(req.params.order_id);

            if(!order) {
                console.log("prepareOrder error: order not found");
                res.status(404).end();
                return;
            }
            order.preparer = preparer._id;
            const result = await order.save();
            res.json(result);
        } catch (err) {
            res.status(400).end();
        }
    }

    async deliverOrder(req: Request, res: Response){
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
        const deliveryMan = await AuthService.getInstance().getUserFromToken(token);
        if(deliveryMan === null) {
            res.status(401).end();
            return;
        }
        try {
            const order = await OrderService.getInstance().deliver(req.params.order_id);

            if(!order) {
                console.log("deliverOrder error: order not found");
                res.status(400).end();
                return;
            }
            order.deliveryMan = deliveryMan._id;
            const result = await order.save();
            res.json(result);
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

        router.put('/status/:order_id', canChangeOrderStatus(), express.json(), this.updateOrderStatus.bind(this));
        router.post('/pay/:order_id', isCustomer(), express.json(), this.payOrder.bind(this));

        router.post('/prepare/:order_id', isPreparer(), this.prepareOrder.bind(this));
        router.post('/deliver/:order_id', isDeliveryMan(), this.deliverOrder.bind(this));

        return router;
    }
}
import {
    checkUserConnected,
    isAdmin,
    isCustomer,
    isPreparer,
    canSeeOrder, canChangeOrderStatus, isDeliveryMan
} from "../middlewares";

import {AuthService, MenuService, OrderService, ProductService, RestaurantService} from "../services";
