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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantService = void 0;
const models_1 = require("../models");
class RestaurantService {
    constructor() { }
    static getInstance() {
        if (RestaurantService.instance === undefined) {
            RestaurantService.instance = new RestaurantService();
        }
        return RestaurantService.instance;
    }
    createRestaurant(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = new models_1.RestaurantModel(props);
            const restaurant = yield model.save();
            return restaurant;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.RestaurantModel.find().exec();
        });
    }
    getById(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.RestaurantModel.findById(restaurantId).exec();
        });
    }
    deleteById(restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield models_1.RestaurantModel.deleteOne({ _id: restaurantId }).exec();
            return res.deletedCount === 1;
        });
    }
    updateById(restaurantId, props) {
        return __awaiter(this, void 0, void 0, function* () {
            const restaurant = yield this.getById(restaurantId);
            if (!restaurant) {
                return null;
            }
            if (props.name !== undefined) {
                restaurant.name = props.name;
            }
            if (props.address !== undefined) {
                restaurant.address = props.address;
            }
            if (props.city !== undefined) {
                restaurant.city = props.city;
            }
            if (props.postalCode !== undefined) {
                restaurant.postalCode = props.postalCode;
            }
            const res = yield restaurant.save();
            return res;
        });
    }
}
exports.RestaurantService = RestaurantService;
//# sourceMappingURL=restaurant.service.js.map