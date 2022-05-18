import express, {Router, Request, Response} from "express";
import {canSeeProduct, checkUserConnected, isAdmin, isBigBoss} from "../middlewares";
import {MenuService} from "../services";

export class MenuController {

    async createMenu(req: Request, res: Response) {
        const menuBody = req.body;
        if(!menuBody.name || !menuBody.product || !menuBody.price) {
            console.log("CreateMenu error: Parameters are missing.")
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const oldMenu = await MenuService.getInstance().getByName(menuBody.name);
            if (oldMenu === undefined){
                const menu = await MenuService.getInstance().createMenu({
                    name: menuBody.name,
                    product: menuBody.product,
                    price: menuBody.price
                });
                res.json(menu);
            }
            console.log("CreateMenu error: This Menu already exist.")
            res.status(400).end(); // erreur des données utilisateurs
            return;
        } catch(err) {
            res.status(400).end(); // erreur des données utilisateurs
            return;
        }
    }

    async getAllMenus(req: Request, res: Response) {
        const menus = await MenuService.getInstance().getAll();
        res.json(menus);
    }

    async getMenu(req: Request, res: Response) {
        try {
            const menu = await MenuService.getInstance().getById(req.params.menu_id);
            if(menu === null) {
                res.status(404).end();
                return;
            }
            res.json(menu);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async deleteMenu(req: Request, res: Response) {
        try {
            const success = await MenuService.getInstance().deleteById(req.params.menu_id);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateMenu(req: Request, res: Response) {
        try {
            const menu = await MenuService.getInstance()
                .updateById(req.params.menu_id, req.body);
            if(!menu) {
                res.status(404).end();
                return;
            }
            res.json(menu);
        } catch (err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();

        router.use(checkUserConnected());
        router.post('/', express.json(), this.createMenu.bind(this), isAdmin());
        router.get('/', this.getAllMenus.bind(this), canSeeProduct());
        router.get('/:menu_id', this.getMenu.bind(this), canSeeProduct());
        router.delete('/:menu_id', this.deleteMenu.bind(this), isAdmin());
        router.put('/:menu_id', express.json(), this.updateMenu.bind(this), isAdmin());
        return router;
    }
}
