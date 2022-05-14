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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const models_1 = require("../models");
class AdminService {
    constructor() { }
    static getInstance() {
        if (AdminService.instance === undefined) {
            AdminService.instance = new AdminService();
        }
        return AdminService.instance;
    }
    createAdmin(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = new models_1.AdminModel(props);
            const admin = yield model.save();
            return admin;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.AdminModel.find().exec();
        });
    }
    getById(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.AdminModel.findById(adminId).exec();
        });
    }
    deleteById(adminId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield models_1.AdminModel.deleteOne({ _id: adminId }).exec();
            return res.deletedCount === 1;
        });
    }
    updateById(adminId, props) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.getById(adminId);
            if (!admin) {
                return null;
            }
            if (props.username !== undefined) {
                admin.username = props.username;
            }
            if (props.restaurant !== undefined) {
                admin.restaurant = props.restaurant;
            }
            const res = yield admin.save();
            return res;
        });
    }
}
exports.AdminService = AdminService;
//# sourceMappingURL=admin.service.js.map