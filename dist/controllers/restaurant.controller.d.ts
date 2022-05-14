import { Router, Request, Response } from "express";
export declare class RestaurantController {
    createRestaurant(req: Request, res: Response): Promise<void>;
    getAllRestaurants(req: Request, res: Response): Promise<void>;
    getRestaurant(req: Request, res: Response): Promise<void>;
    deleteRestaurant(req: Request, res: Response): Promise<void>;
    updateRestaurant(req: Request, res: Response): Promise<void>;
    buildRoutes(): Router;
}
