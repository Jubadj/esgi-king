import express, {Router, Request, Response} from "express";
import {RestaurantService} from "../services";
import {checkUserConnected, isBigBoss} from "../middlewares";
import {geocoder} from "../utils";

export class RestaurantController {

    async createRestaurant(req: Request, res: Response) {
        const restaurantBody = req.body;
        if(!restaurantBody.name || !restaurantBody.address || !restaurantBody.city || !restaurantBody.postalCode|| !restaurantBody.country) {
            res.status(400).json("createRestaurant error : Parameters are missing !").end(); // 400 -> bad request
            return;
        }
        try {
            const restaurant = await RestaurantService.getInstance().createRestaurant({
                name: restaurantBody.name,
                address: restaurantBody.address,
                city: restaurantBody.city,
                postalCode: restaurantBody.postalCode,
                country: restaurantBody.country
            });
            res.json(restaurant);
        } catch(err) {
            res.status(400).json("creatRestaurant error !").end(); // erreur des données utilisateurs
            return;
        }
    }

    async getAllRestaurants(req: Request, res: Response) {
        const restaurants = await RestaurantService.getInstance().getAll();
        res.json(restaurants);
    }

    async getRestaurant(req: Request, res: Response) {
        try {
            const restaurant = await RestaurantService.getInstance().getById(req.params.restaurant_id);
            if(restaurant === null) {
                res.status(404).end();
                return;
            }
            res.json(restaurant);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async deleteRestaurant(req: Request, res: Response) {
        try {
            const success = await RestaurantService.getInstance().deleteById(req.params.restaurant_id);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateRestaurant(req: Request, res: Response) {
        try {
            const restaurant = await RestaurantService.getInstance()
                .updateById(req.params.restaurant_id, req.body);
            if(!restaurant) {
                res.status(404).end();
                return;
            }
            res.json(restaurant);
        } catch (err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();

        router.use(checkUserConnected());
        router.use(isBigBoss());
        router.post('/', express.json(), this.createRestaurant.bind(this));
        router.get('/', this.getAllRestaurants.bind(this));
        router.get('/:restaurant_id', this.getRestaurant.bind(this));
        router.delete('/:restaurant_id', this.deleteRestaurant.bind(this));
        router.put('/:restaurant_id', express.json(), this.updateRestaurant.bind(this));
        return router;
    }
}
