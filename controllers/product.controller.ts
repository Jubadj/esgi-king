import express, {Router, Request, Response} from "express";
import {ProductService} from "../services";
import {canSeeProduct, checkUserConnected, isAdmin} from "../middlewares";
import {ProductDocument} from "../models";

export class ProductController {

    async createProduct(req: Request, res: Response) {
        const productBody = req.body;
        if(!productBody.name || !productBody.weight || !productBody.price) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const oldProduct = await ProductService.getInstance().getByName(productBody.name);
            if (oldProduct === null){
                const product = await ProductService.getInstance().createProduct({
                    name: productBody.name,
                    weight: productBody.weight,
                    price: productBody.price
                });
                res.json(product);
            }
            res.status(400).end(); // erreur des données utilisateurs
            return;
        } catch(err) {
            res.status(400).end(); // erreur des données utilisateurs
            return;
        }
    }

    equalsProduct(product1: ProductDocument | null, product2: ProductDocument | null): Boolean {
        if (product1 !==null && product2 !==null ){
            return product1.name === product2.name && product1.price === product2.price && product1.weight === product2.weight;
        }
        return false;
    }

    async getAllProducts(req: Request, res: Response) {
        const products = await ProductService.getInstance().getAll();
        res.json(products);
    }

    async getProduct(req: Request, res: Response) {
        try {
            const product = await ProductService.getInstance().getById(req.params.product_id);
            if(product === null) {
                res.status(404).end();
                return;
            }
            res.json(product);
        } catch(err) {
            res.status(400).end();
            return;
        }
    }

    async deleteProduct(req: Request, res: Response) {
        try {
            const success = await ProductService.getInstance().deleteById(req.params.product_id);
            if(success) {
                res.status(204).end();
            } else {
                res.status(404).end();
            }
        } catch(err) {
            res.status(400).end();
        }
    }

    async updateProduct(req: Request, res: Response) {
        try {
            const product = await ProductService.getInstance()
                .updateById(req.params.product_id, req.body);
            if(!product) {
                res.status(404).end();
                return;
            }
            res.json(product);
        } catch (err) {
            res.status(400).end();
        }
    }

    buildRoutes(): Router {
        const router = express.Router();
        router.use(checkUserConnected());
        router.post('/',isAdmin(), express.json(), this.createProduct.bind(this));
        router.get('/', canSeeProduct(),this.getAllProducts.bind(this));
        router.get('/:product_id', canSeeProduct(), this.getProduct.bind(this));
        router.delete('/:product_id',isAdmin(), this.deleteProduct.bind(this));
        router.put('/:product_id',isAdmin(), express.json(), this.updateProduct.bind(this));
        return router;
    }
}