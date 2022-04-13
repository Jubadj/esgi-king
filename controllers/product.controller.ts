import express, {Router, Request, Response} from "express";
import {ProductService} from "../services";
import {canSeeProduct, checkUserConnected, isAdmin, isBigBoss} from "../middlewares";

export class ProductController {

    async createProduct(req: Request, res: Response) {
        const productBody = req.body;
        if(!productBody.name || !productBody.weight || !productBody.calories || !productBody.price) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const product = await ProductService.getInstance().createProduct({
                name: productBody.name,
                weight: productBody.weight,
                calories: productBody.calories,
                type: productBody.type,
                price: productBody.price
            });
            res.json(product);
        } catch(err) {
            res.status(400).end(); // erreur des données utilisateurs
            return;
        }
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
        router.post('/', express.json(), this.createProduct.bind(this), isAdmin()); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/', this.getAllProducts.bind(this), canSeeProduct());
        router.get('/:product_id', this.getProduct.bind(this), canSeeProduct());
        router.delete('/:product_id', this.deleteProduct.bind(this), isAdmin());
        router.put('/:product_id', express.json(), this.updateProduct.bind(this), isAdmin());
        return router;
    }
}
