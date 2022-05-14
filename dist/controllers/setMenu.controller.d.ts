import { Router, Request, Response } from "express";
export declare class SetMenuController {
    createNewMenu(req: Request, res: Response): Promise<void>;
    createSetMenu(req: Request, res: Response): Promise<void>;
    getAllSetMenus(req: Request, res: Response): Promise<void>;
    getSetMenu(req: Request, res: Response): Promise<void>;
    deleteSetMenu(req: Request, res: Response): Promise<void>;
    updateSetMenu(req: Request, res: Response): Promise<void>;
    buildRoutes(): Router;
}
