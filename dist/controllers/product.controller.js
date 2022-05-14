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
exports.ProductController = void 0;
const express_1 = __importDefault(require("express"));
const services_1 = require("../services");
const middlewares_1 = require("../middlewares");
const product_enum_1 = require("../utils/product.enum");
class ProductController {
    createNewProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productBody = req.body;
            if (!productBody.name || !productBody.weight || !productBody.calories || !productBody.count || !productBody.price) {
                res.status(400).end(); // 400 -> bad request
                return;
            }
            try {
                const product = yield services_1.ProductService.getInstance().createProduct({
                    name: productBody.name,
                    weight: productBody.weight,
                    calories: productBody.calories,
                    type: productBody.type,
                    count: productBody.count,
                    price: productBody.price
                });
                res.json(product);
            }
            catch (err) {
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
        });
    }
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productBody = req.body;
            const productName = productBody.name.toString();
            if (!productName) {
                res.status(400).end(); // 400 -> bad request
                return;
            }
            try {
                // Verify if the product name exist in the product enum
                if (!(productName in product_enum_1.productEnum)) {
                    res.status(400).end(); // 400 -> bad request
                    return;
                }
                let product = yield services_1.ProductService.getInstance().getByName({ name: productName });
                // if product exist
                if (product) {
                    product.count += 1;
                    const result = yield product.save();
                    res.json(result);
                    return;
                }
                // else we create a new product
                product = yield services_1.ProductService.getInstance().createProduct({
                    name: productName,
                    weight: product_enum_1.productEnum[productName].weight,
                    calories: product_enum_1.productEnum[productName].calories,
                    type: product_enum_1.productEnum[productName].type,
                    count: product_enum_1.productEnum[productName].count + 1,
                    price: product_enum_1.productEnum[productName].price
                });
                res.json(product);
            }
            catch (err) {
                res.status(400).end(); // erreur des données utilisateurs
                return;
            }
        });
    }
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const products = yield services_1.ProductService.getInstance().getAll();
            res.json(products);
        });
    }
    getProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield services_1.ProductService.getInstance().getById(req.params.product_id);
                if (product === null) {
                    res.status(404).end();
                    return;
                }
                res.json(product);
            }
            catch (err) {
                res.status(400).end();
                return;
            }
        });
    }
    getProductByNme(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productBody = req.body;
            const productName = productBody.name.toString();
            if (!productName) {
                res.status(400).end(); // 400 -> bad request
                return;
            }
            try {
                const product = yield services_1.ProductService.getInstance().getByName({ name: productName });
                if (product === null) {
                    res.status(404).end();
                    return;
                }
                res.json(product);
            }
            catch (err) {
                res.status(400).end();
                return;
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const success = yield services_1.ProductService.getInstance().deleteById(req.params.product_id);
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
    deleteOneProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productBody = req.body;
            const productName = productBody.name.toString();
            if (!productName) {
                res.status(400).end(); // 400 -> bad request
                return;
            }
            try {
                let product = yield services_1.ProductService.getInstance().getByName({ name: productName });
                let success = false;
                if (!product) {
                    res.status(400).end();
                }
                if (product && product.count >= 1) {
                    product.count -= 1;
                    const result = yield product.save();
                    res.json(result);
                    success = true;
                }
                if (success) {
                    res.status(204).end();
                }
                else {
                    //res.send("This product doesn't exist!");
                    res.status(404).end();
                }
            }
            catch (err) {
                res.status(400).end();
            }
        });
    }
    updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield services_1.ProductService.getInstance()
                    .updateById(req.params.product_id, req.body);
                if (!product) {
                    res.status(404).end();
                    return;
                }
                res.json(product);
            }
            catch (err) {
                res.status(400).end();
            }
        });
    }
    buildRoutes() {
        const router = express_1.default.Router();
        router.use((0, middlewares_1.checkUserConnected)());
        //router.post('/', express.json(), this.createProduct.bind(this), isBigBoss()); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.post('/', express_1.default.json(), this.createProduct.bind(this), (0, middlewares_1.isAdmin)()); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/', this.getAllProducts.bind(this), (0, middlewares_1.canSeeProduct)());
        router.get('/:product_id', this.getProduct.bind(this), (0, middlewares_1.canSeeProduct)());
        router.delete('/:product_id', this.deleteProduct.bind(this), (0, middlewares_1.isAdmin)());
        router.put('/:product_id', express_1.default.json(), this.updateProduct.bind(this), (0, middlewares_1.isAdmin)());
        return router;
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map