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
exports.AdminController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const middlewares_1 = require("../middlewares");
class AdminController {
    createAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminBody = req.body;
            if (!adminBody.username) {
                res.status(400).end(); // 400 -> bad request
                return;
            }
            try {
                const admin = yield services_1.AdminService.getInstance().createAdmin({
                    username: adminBody.username,
                    restaurant: adminBody.restaurant,
                });
                res.json(admin);
                console.log("ok");
            }
            catch (err) {
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
        });
    }
    getAllAdmins(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const admins = yield services_1.AdminService.getInstance().getAll();
            res.json(admins);
        });
    }
    getAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield services_1.AdminService.getInstance().getById(req.params.admin_id);
                if (admin === null) {
                    res.status(404).end();
                    return;
                }
                res.json(admin);
            }
            catch (err) {
                res.status(400).end();
                return;
            }
        });
    }
    deleteAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield services_1.AdminService.getInstance().deleteById(req.params.admin_id);
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
    updateAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const admin = yield services_1.AdminService.getInstance()
                    .updateById(req.params.admin_id, req.body);
                if (!admin) {
                    res.status(404).end();
                    return;
                }
                res.json(admin);
            }
            catch (err) {
                res.status(400).end();
            }
        });
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.use((0, middlewares_1.checkUserConnected)());
        router.use((0, middlewares_1.isBigBoss)());
        router.post('/', express_1.default.json(), this.createAdmin.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/', this.getAllAdmins.bind(this));
        router.get('/:admin_id', this.getAdmin.bind(this));
        router.delete('/:admin_id', this.deleteAdmin.bind(this));
        router.put('/:admin_id', express_1.default.json(), this.updateAdmin.bind(this));
        return router;
    }
}
exports.AdminController = AdminController;
//# sourceMappingURL=admin.controller.js.map