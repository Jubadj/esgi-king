import express, {Router, Request, Response} from "express";
import {canSeeProduct, checkUserConnected, isAdmin, isBigBoss} from "../middlewares";
import {MenuService, ProductService} from "../services";

export class MenuController {

    async createMenu(req: Request, res: Response) {
        const menuBody = req.body;
        if(!menuBody.name || !menuBody.product || !menuBody.price) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        //Verify that all products are valid
        if(menuBody.product){
            const products = menuBody.product;
            for (let i=0; i<products.length; i++){
                const product = await ProductService.getInstance().getByName(products[i]);
                if(!product){
                    res.status(400).end(); // 400 -> bad request
                    return;
                }
            }
        }
        try {
            const oldMenu = await MenuService.getInstance().getByName(menuBody.name);
            if (oldMenu === null){
                const menu = await MenuService.getInstance().createMenu({
                    name: menuBody.name,
                    product: menuBody.product,
                    price: menuBody.price
                });
                res.json(menu);
            }

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
                res.status(400).end();
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
        router.post('/', isAdmin(),express.json(), this.createMenu.bind(this));
        router.get('/',canSeeProduct(), this.getAllMenus.bind(this));
        router.get('/:menu_id',canSeeProduct(), this.getMenu.bind(this));
        router.delete('/:menu_id',isAdmin(), this.deleteMenu.bind(this));
        router.put('/:menu_id',isAdmin(), express.json(), this.updateMenu.bind(this));
        return router;
    }
}
