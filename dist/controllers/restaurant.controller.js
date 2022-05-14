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
exports.RestaurantController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const middlewares_1 = require("../middlewares");
class RestaurantController {
    createRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const restaurantBody = req.body;
            if (!restaurantBody.name || !restaurantBody.address || !restaurantBody.city || !restaurantBody.postalCode) {
                res.status(400).end(); // 400 -> bad request
                return;
            }
            try {
                const restaurant = yield services_1.RestaurantService.getInstance().createRestaurant({
                    name: restaurantBody.name,
                    address: restaurantBody.address,
                    city: restaurantBody.city,
                    postalCode: restaurantBody.postalCode
                });
                res.json(restaurant);
                console.log("ok");
            }
            catch (err) {
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
        });
    }
    getAllRestaurants(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const restaurants = yield services_1.RestaurantService.getInstance().getAll();
            res.json(restaurants);
        });
    }
    getRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const restaurant = yield services_1.RestaurantService.getInstance().getById(req.params.restaurant_id);
                if (restaurant === null) {
                    res.status(404).end();
                    return;
                }
                res.json(restaurant);
            }
            catch (err) {
                res.status(400).end();
                return;
            }
        });
    }
    deleteRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield services_1.RestaurantService.getInstance().deleteById(req.params.restaurant_id);
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
    updateRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const restaurant = yield services_1.RestaurantService.getInstance()
                    .updateById(req.params.restaurant_id, req.body);
                if (!restaurant) {
                    res.status(404).end();
                    return;
                }
                res.json(restaurant);
            }
            catch (err) {
                res.status(400).end();
            }
        });
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.use((0, middlewares_1.checkUserConnected)());
        router.use((0, middlewares_1.isBigBoss)());
        router.post('/', express_1.default.json(), this.createRestaurant.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/', this.getAllRestaurants.bind(this));
        router.get('/:restaurant_id', this.getRestaurant.bind(this));
        router.delete('/:restaurant_id', this.deleteRestaurant.bind(this));
        router.put('/:restaurant_id', express_1.default.json(), this.updateRestaurant.bind(this));
        return router;
    }
}
exports.RestaurantController = RestaurantController;
//# sourceMappingURL=restaurant.controller.js.map