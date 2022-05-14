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
exports.ProductService = void 0;
const models_1 = require("../models");
class ProductService {
    constructor() { }
    static getInstance() {
        if (ProductService.instance === undefined) {
            ProductService.instance = new ProductService();
        }
        return ProductService.instance;
    }
    createProduct(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const model = new models_1.ProductModel(props);
            const product = yield model.save();
            return product;
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.ProductModel.find().exec();
        });
    }
    getById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.ProductModel.findById(productId).exec();
        });
    }
    getByName(info) {
        return __awaiter(this, void 0, void 0, function* () {
            return models_1.ProductModel.findOne(info).exec();
        });
    }
    deleteById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield models_1.ProductModel.deleteOne({ _id: productId }).exec();
            return res.deletedCount === 1;
        });
    }
    updateById(productId, props) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.getById(productId);
            if (!product) {
                return null;
            }
            if (props.name !== undefined) {
                product.name = props.name;
            }
            if (props.weight !== undefined) {
                product.weight = props.weight;
            }
            if (props.calories !== undefined) {
                product.calories = props.calories;
            }
            if (props.count !== undefined) {
                product.count = props.count;
            }
            if (props.type !== undefined) {
                product.type = props.type;
            }
            const res = yield product.save();
            return res;
        });
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map