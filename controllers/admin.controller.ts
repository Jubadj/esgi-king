import express, {Router, Request, Response} from "express";
import {AdminService} from "../services";
import {checkUserConnected} from "../middlewares";

export class AdminController {

    async createAdmin(req: Request, res: Response) {
        const adminBody = req.body;
        if(!adminBody.name || !adminBody.intensity || !adminBody.price) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const admin = await AdminService.getInstance().createAdmin({
                name: adminBody.name,
                intensity: adminBody.intensity,
                price: adminBody.price,
                origin: adminBody.origin
            });
            res.json(admin);
        } catch(err) {
            res.status(400).end(); // erreur des données utilisateurs
            return;
        }
    }

    async getAllAdmins(req: Request, res: Response) {
        const admins = await AdminService.getInstance().getAll();
        res.json(admins);
    }

    async getAdmin(req: Request, res: Response) {
        try {
            const admin = await AdminService.getInstance().getById(req.params.admin_id);
            if(admin === null) {
                res.status(404).end();
                return;
            }
            res.json(admin);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async deleteAdmin(req: Request, res: Response) {
        try {
            const success = await AdminService.getInstance().deleteById(req.params.admin_id);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateAdmin(req: Request, res: Response) {
        try {
            const admin = await AdminService.getInstance()
                .updateById(req.params.admin_id, req.body);
            if(!admin) {
                res.status(404).end();
                return;
            }
            res.json(admin);
        } catch (err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        //router.use();
        router.use(checkUserConnected());
        router.post('/', express.json(), this.createAdmin.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/', this.getAllAdmins.bind(this));
        router.get('/:admin_id', this.getAdmin.bind(this));
        router.delete('/:admin_id', this.deleteAdmin.bind(this));
        router.put('/:admin_id', express.json(), this.updateAdmin.bind(this));
        return router;
    }
}
