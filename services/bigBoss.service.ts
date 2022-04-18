import {AdminDocument, AdminProps, RestaurantDocument, UserDocument, UserProps} from "../models";
import {Request, request, Response} from "express";
import {AdminService} from "./admin.service";
import {RestaurantService} from "../services";

export class BigBossService {

    private static instance?: BigBossService;

    public static getInstance(): BigBossService {
        if (BigBossService.instance === undefined) {
            BigBossService.instance = new BigBossService();
        }
        return BigBossService.instance;
    }

    private constructor() {
    }

    public async affectAdmin(adminId: string, restaurantId: string): Promise<[AdminDocument, RestaurantDocument] | null> {
        const admin = await AdminService.getInstance().getById(adminId);
        const restaurant = await RestaurantService.getInstance().getById(restaurantId);

        if(restaurant !== null && admin !== null){
            restaurant.admin = adminId;
            admin.restaurant = restaurantId;
            await restaurant.save();
            await admin.save();
            return [admin, restaurant];
        }
        return null;
    }
}