import { Router, Request, Response } from "express";
export declare class OrderController {
    createOrderOffline(req: Request, res: Response): Promise<void>;
    createOrderOnline(req: Request, res: Response): Promise<void>;
    getAllOrders(req: Request, res: Response): Promise<void>;
    getHistoryOrders(req: Request, res: Response): Promise<void>;
    getOrder(req: Request, res: Response): Promise<void>;
    deleteOrder(req: Request, res: Response): Promise<void>;
    updateOrder(req: Request, res: Response): Promise<void>;
    buildRoutes(): Router;
}
