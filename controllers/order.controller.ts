import express, {Router, Request, Response} from "express";

import {canAdminPreparer, checkUserConnected, isAdmin, isBigBoss, isCustomer} from "../middlewares";
import {OrderService} from "../services";

export class OrderController {

    async createOrder(req: Request, res: Response) {
        const orderBody = req.body;
        if(!orderBody.restaurant || !orderBody.customer) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const order = await OrderService.getInstance().createOrder({
                restaurant: orderBody.restaurant,
                customer: orderBody.customer,
                productList: orderBody.productList,
                menuList: orderBody.menuList,
                price: orderBody.price
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

        router.post('/', express.json(), this.createOrder.bind(this), checkUserConnected(), isCustomer()); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/', this.getAllOrders.bind(this), checkUserConnected(), canAdminPreparer());
        router.get('/:order_id', this.getOrder.bind(this), checkUserConnected(), canAdminPreparer())
        router.delete('/:order_id', this.deleteOrder.bind(this), checkUserConnected(), canAdminPreparer());
        router.put('/:order_id', express.json(), this.updateOrder.bind(this), checkUserConnected(), canAdminPreparer());
        return router;
    }
}
