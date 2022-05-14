"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetMenuController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const middlewares_1 = require("../middlewares");
const utils_1 = require("../utils");
class SetMenuController {
    createNewMenu(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const setMenuBody = req.body;
            if (!setMenuBody.name || !setMenuBody.product || !setMenuBody.price) {
                res.status(400).end(); // 400 -> bad request
                return;
            }
            try {
                const setMenu = yield services_1.SetMenuService.getInstance().createSetMenu({
                    name: setMenuBody.name,
                    product: setMenuBody.product,
                    price: setMenuBody.price
                });
                res.json(setMenu);
            }
            catch (err) {
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
        });
    }
    createSetMenu(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const menuBody = req.body;
            const menuName = menuBody.name.toString();
            // Verify the name is enterred in the request body
            if (!menuName) {
                res.status(400).end(); // 400 -> bad request
                return;
            }
            try {
                // Verify if the menu name exist in the menu enum
                if (!(menuName in utils_1.menuEnum)) {
                    res.status(400).end(); // 400 -> bad request
                    return;
                }
                const setMenu = yield services_1.SetMenuService.getInstance().createSetMenu({
                    name: menuName,
                    product: utils_1.menuEnum[menuName].product,
                    price: utils_1.menuEnum[menuName].price
                });
                res.json(setMenu);
            }
            catch (err) {
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
        });
    }
    getAllSetMenus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const setMenus = yield services_1.SetMenuService.getInstance().getAll();
            res.json(setMenus);
        });
    }
    getSetMenu(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const setMenu = yield services_1.SetMenuService.getInstance().getById(req.params.setMenu_id);
                if (setMenu === null) {
                    res.status(404).end();
                    return;
                }
                res.json(setMenu);
            }
            catch (err) {
                res.status(400).end();
                return;
            }
        });
    }
    deleteSetMenu(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield services_1.SetMenuService.getInstance().deleteById(req.params.setMenu_id);
                if (success) {
                    res.status(204).end();
                }
                else {
                    res.status(404).end();
                }
            }
            catch (err) {
                res.status(400).end();
            }
        });
    }
    updateSetMenu(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const setMenu = yield services_1.SetMenuService.getInstance()
                    .updateById(req.params.setMenu_id, req.body);
                if (!setMenu) {
                    res.status(404).end();
                    return;
                }
                res.json(setMenu);
            }
            catch (err) {
                res.status(400).end();
            }
        });
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.use((0, middlewares_1.checkUserConnected)());
        //router.post('/', express.json(), this.createNewSetMenu.bind(this), isBigBoss()); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.post('/', express_1.default.json(), this.createSetMenu.bind(this), (0, middlewares_1.isAdmin)()); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/', this.getAllSetMenus.bind(this), (0, middlewares_1.canSeeProduct)());
        router.get('/:setMenu_id', this.getSetMenu.bind(this), (0, middlewares_1.canSeeProduct)());
        router.delete('/:setMenu_id', this.deleteSetMenu.bind(this), (0, middlewares_1.isAdmin)());
        router.put('/:setMenu_id', express_1.default.json(), this.updateSetMenu.bind(this), (0, middlewares_1.isAdmin)());
        return router;
    }
}
exports.SetMenuController = SetMenuController;
//# sourceMappingURL=setMenu.controller.js.map