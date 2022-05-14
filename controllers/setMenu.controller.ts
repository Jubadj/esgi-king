import express, {Router, Request, Response} from "express";
import {ProductService, SetMenuService} from "../services";
import {canSeeProduct, checkUserConnected, isAdmin, isBigBoss} from "../middlewares";
import {menuEnum, productEnum} from "../enums";

export class SetMenuController {

    async createNewMenu(req: Request, res: Response) {
        const setMenuBody = req.body;
        if(!setMenuBody.name || !setMenuBody.product || !setMenuBody.price) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const setMenu = await SetMenuService.getInstance().createSetMenu({
                name: setMenuBody.name,
                product: setMenuBody.product,
                price: setMenuBody.price
            });
            res.json(setMenu);
        } catch(err) {
            res.status(400).end(); // erreur des données utilisateurs
            return;
        }
    }

    async createSetMenu(req: Request, res: Response) {
        const menuBody = req.body;
        const menuName = menuBody.name.toString();
        // Verify the name is enterred in the request body
        if(!menuName) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            // Verify if the menu name exist in the menu enum
            if(!(menuName in menuEnum)){
                res.status(400).end(); // 400 -> bad request
                return;
            }
            const setMenu = await SetMenuService.getInstance().createSetMenu({
                name: menuName,
                product: menuEnum[menuName as keyof typeof menuEnum].product,
                price: menuEnum[menuName as keyof typeof menuEnum].price
            });
            res.json(setMenu);
        } catch(err) {
            res.status(400).end(); // erreur des données utilisateurs
            return;
        }
    }

    async getAllSetMenus(req: Request, res: Response) {
        const setMenus = await SetMenuService.getInstance().getAll();
        res.json(setMenus);
    }

    async getSetMenu(req: Request, res: Response) {
        try {
            const setMenu = await SetMenuService.getInstance().getById(req.params.setMenu_id);
            if(setMenu === null) {
                res.status(404).end();
                return;
            }
            res.json(setMenu);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async deleteSetMenu(req: Request, res: Response) {
        try {
            const success = await SetMenuService.getInstance().deleteById(req.params.setMenu_id);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateSetMenu(req: Request, res: Response) {
        try {
            const setMenu = await SetMenuService.getInstance()
                .updateById(req.params.setMenu_id, req.body);
            if(!setMenu) {
                res.status(404).end();
                return;
            }
            res.json(setMenu);
        } catch (err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();

        router.use(checkUserConnected());
        //router.post('/', express.json(), this.createNewSetMenu.bind(this), isBigBoss()); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.post('/', express.json(), this.createSetMenu.bind(this), isAdmin()); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/', this.getAllSetMenus.bind(this), canSeeProduct());
        router.get('/:setMenu_id', this.getSetMenu.bind(this), canSeeProduct());
        router.delete('/:setMenu_id', this.deleteSetMenu.bind(this), isAdmin());
        router.put('/:setMenu_id', express.json(), this.updateSetMenu.bind(this), isAdmin());
        return router;
    }
}
