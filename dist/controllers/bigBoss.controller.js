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
exports.BigBossController = void 0;
const express_1 = __importDefault(require("express"));
const bigBoss_service_1 = require("../services/bigBoss.service");
class BigBossController {
    affectAdminToRestaurant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield bigBoss_service_1.BigBossService.getInstance().affectAdmin(req.params.admin_id, req.params.restaurant_id);
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
    // TODO function to manage procduct and menu enums creating
    buildRoutes() {
        const router = express_1.default.Router();
        router.put('/affectation/:admin_id/:restaurant_id', express_1.default.json(), this.affectAdminToRestaurant.bind(this));
        return router;
    }
}
exports.BigBossController = BigBossController;
//# sourceMappingURL=bigBoss.controller.js.map