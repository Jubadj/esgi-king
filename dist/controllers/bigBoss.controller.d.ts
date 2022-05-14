import { Request, Response, Router } from "express";
export declare class BigBossController {
    affectAdminToRestaurant(req: Request, res: Response): Promise<void>;
    buildRoutes(): Router;
}
