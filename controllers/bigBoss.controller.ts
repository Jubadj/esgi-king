import {AdminService, AuthService, RestaurantService} from "../services";
import express, {Request, Response, Router} from "express";
import {checkUserConnected, ROLE} from "../middlewares";
import {BigBossService} from "../services/bigBoss.service";


export class BigBossController {
    async affectAdminToRestaurant(req: Request, res: Response) {
        try {
            const success = await BigBossService.getInstance().affectAdmin(req.params.admin_id, req.params.restaurant_id);
            if(success){
                res.status(204).end();
            }else{
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    // TODO function to manage procduct and menu enums creating

    buildRoutes(): Router {
        const router = express.Router();
        router.put('/affectation/:admin_id/:restaurant_id', express.json(), this.affectAdminToRestaurant.bind(this));
        return router;
    }
}