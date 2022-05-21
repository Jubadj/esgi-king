import {AdminDocument, RestaurantDocument} from "../models";
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

    /*
    * Affect an admin user to restaurant
    * */
    public async affectAdmin(adminId: string, restaurantId: string): Promise< RestaurantDocument| null> {
        const admin = await AdminService.getInstance().getById(adminId);
        const restaurant = await RestaurantService.getInstance().getById(restaurantId);
        console.log("admin restaurant");
        if(restaurant === null){
            console.log("affectAdmin error : restaurant not found");
            return null;
        }
        if(admin === null){
            console.log("affectAdmin error : admin not found");
            return null;
        }
        try{
            restaurant.admin = adminId;
            admin.restaurant = restaurantId;
            await restaurant.save();
            await admin.save();
            return restaurant;
        }catch(err){
            console.log(err);
            return null;
        }



    }
}