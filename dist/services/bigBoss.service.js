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
exports.BigBossService = void 0;
const admin_service_1 = require("./admin.service");
const services_1 = require("../services");
class BigBossService {
    constructor() {
    }
    static getInstance() {
        if (BigBossService.instance === undefined) {
            BigBossService.instance = new BigBossService();
        }
        return BigBossService.instance;
    }
    affectAdmin(adminId, restaurantId) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield admin_service_1.AdminService.getInstance().getById(adminId);
            const restaurant = yield services_1.RestaurantService.getInstance().getById(restaurantId);
            if (restaurant !== null && admin !== null) {
                restaurant.admin = adminId;
                admin.restaurant = restaurantId;
                yield restaurant.save();
                yield admin.save();
                return [admin, restaurant];
            }
            return null;
        });
    }
}
exports.BigBossService = BigBossService;
//# sourceMappingURL=bigBoss.service.js.map