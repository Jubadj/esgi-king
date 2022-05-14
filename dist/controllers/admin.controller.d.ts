import { Router, Request, Response } from "express";
export declare class AdminController {
    createAdmin(req: Request, res: Response): Promise<void>;
    getAllAdmins(req: Request, res: Response): Promise<void>;
    getAdmin(req: Request, res: Response): Promise<void>;
    deleteAdmin(req: Request, res: Response): Promise<void>;
    updateAdmin(req: Request, res: Response): Promise<void>;
    buildRoutes(): Router;
}
