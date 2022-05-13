import express, {Router, Request, Response} from "express";
import {AdminService, ProductService} from "../services";
import {canSeeProduct, checkUserConnected, isAdmin, isBigBoss} from "../middlewares";
import {ProductDocument, ProductModel, RestaurantModel} from "../models";
import {productEnum} from "../utils/product.enum";

export class ProductController {

    async createProduct(req: Request, res: Response) {
        const productBody = req.body;
        if(!productBody.name || !productBody.weight || !productBody.count || !productBody.price) {
            res.status(400).end(); // 400 -> bad request
            return;
        }
        try {
            const oldProduct = await ProductService.getInstance().getByName(productBody.name);
            if (oldProduct === undefined){
                const product = await ProductService.getInstance().createProduct({
                    name: productBody.name,
                    weight: productBody.weight,
                    count: productBody.count,
                    price: productBody.price
                });
                res.json(product);
            }
            if (oldProduct !== null && oldProduct?.count !==undefined && this.equalsProduct(oldProduct, productBody) ){
                oldProduct.count += 1;
                await oldProduct.save();
                res.json(oldProduct);
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



    // async createProduct(req: Request, res: Response) {
    //     const productBody = req.body;
    //     const productName = productBody.name.toString();
    //     if(! productName) {
    //         res.status(400).end(); // 400 -> bad request
    //         return;
    //     }
    //     try {
    //         // Verify if the product name exist in the product enum
    //         if(!(productName in productEnum)){
    //             res.status(400).end(); // 400 -> bad request
    //             return;
    //         }
    //         let product = await ProductService.getInstance().getByName({ name: productName });
    //         // if product exist
    //         if ( product ){
    //             product.count += 1;
    //             const result = await product.save();
    //             res.json(result);
    //             return;
    //         }
    //
    //         // else we create a new product
    //         product = await ProductService.getInstance().createProduct({
    //             name: productName,
    //             weight: productEnum[productName as keyof typeof productEnum].weight,
    //             calories: productEnum[productName as keyof typeof productEnum].calories,
    //             type: productEnum[productName as keyof typeof productEnum].type,
    //             count: productEnum[productName as keyof typeof productEnum].count + 1,
    //             price: productEnum[productName as keyof typeof productEnum].price
    //         });
    //         res.json(product);
    //     } catch(err) {
    //         res.status(400).end(); // erreur des données utilisateurs
    //         return;
    //     }
    // }

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

    // async getProductByName(req: Request, res: Response) {
    //     const productBody = req.body;
    //     const productName = productBody.name.toString();
    //     if(! productName) {
    //         res.status(400).end(); // 400 -> bad request
    //         return;
    //     }
    //     try {
    //         const product = await ProductService.getInstance().getByName({ name: productName });
    //         if(product === null) {
    //             res.status(404).end();
    //             return;
    //         }
    //         res.json(product);
    //     } catch(err) {
    //         res.status(400).end();
    //         return;
    //     }
    // }

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

    // async deleteOneProduct(req: Request, res: Response) {
    //     const productBody = req.body;
    //     const productName = productBody.name.toString();
    //     if(! productName) {
    //         res.status(400).end(); // 400 -> bad request
    //         return;
    //     }
    //     try {
    //         let product = await ProductService.getInstance().getByName({ name: productName });
    //         let success = false;
    //         if (!product){
    //             res.status(400).end();
    //         }
    //         if ( product && product.count >= 1) {
    //             product.count -= 1;
    //             const result = await product.save();
    //             res.json(result);
    //             success = true;
    //         }
    //         if(success) {
    //             res.status(204).end();
    //         } else {
    //             //res.send("This product doesn't exist!");
    //             res.status(404).end();
    //         }
    //     } catch(err) {
    //         res.status(400).end();
    //     }
    // }

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
        //router.post('/', express.json(), this.createProduct.bind(this), isBigBoss()); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.post('/', express.json(), this.createProduct.bind(this), isAdmin()); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/', this.getAllProducts.bind(this), canSeeProduct());
        router.get('/:product_id', this.getProduct.bind(this), canSeeProduct());
        router.delete('/:product_id', this.deleteProduct.bind(this), isAdmin());
        router.put('/:product_id', express.json(), this.updateProduct.bind(this), isAdmin());
        return router;
    }
}


/*
*
*
* */