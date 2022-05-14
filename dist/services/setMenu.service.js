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
exports.SetMenuService = void 0;
const models_1 = require("../models");
class SetMenuService {
    constructor() { }
    static getInstance() {
        if (SetMenuService.instance === undefined) {
            SetMenuService.instance = new SetMenuService();
        }
        return SetMenuService.instance;
    }
    createSetMenu(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = new models_1.SetMenuModel(props);
            const setMenu = yield model.save();
            return setMenu;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.SetMenuModel.find().exec();
        });
    }
    getById(setMenuId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.SetMenuModel.findById(setMenuId).exec();
        });
    }
    getByName(info) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.SetMenuModel.findOne(info).exec();
        });
    }
    deleteById(setMenuId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield models_1.SetMenuModel.deleteOne({ _id: setMenuId }).exec();
            return res.deletedCount === 1;
        });
    }
    updateById(setMenuId, props) {
        return __awaiter(this, void 0, void 0, function* () {
            const setMenu = yield this.getById(setMenuId);
            if (!setMenu) {
                return null;
            }
            if (props.name !== undefined) {
                setMenu.name = props.name;
            }
            if (props.product !== undefined) {
                setMenu.product = props.product;
            }
            if (props.price !== undefined) {
                setMenu.price = props.price;
            }
            const res = yield setMenu.save();
            return res;
        });
    }
}
exports.SetMenuService = SetMenuService;
//# sourceMappingURL=setMenu.service.js.map