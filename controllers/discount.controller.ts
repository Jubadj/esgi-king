import express, {Router, Request, Response} from "express";
import {DiscountService} from "../services";
import {checkUserConnected, isAdmin, isBigBoss} from "../middlewares";

export class DiscountController {

    async createDiscount(req: Request, res: Response) {
        const discountBody = req.body;
        if(!discountBody.code || !discountBody.expirationDate ) {
            res.status(400).end().json("Please enter the code and expirationDate fields in the body!"); // 400 -> bad request
            return;
        }
        try {
            const discount = await DiscountService.getInstance().createDiscount({
                code: discountBody.code,
                expirationDate: discountBody.expirationDate,
                percent: discountBody.percent
            });
            res.json(discount);
        } catch(err) {
            res.status(400).end().json("createDiscount error!");
            return;
        }
    }

    async getAllDiscounts(req: Request, res: Response) {
        const discounts = await DiscountService.getInstance().getAll();
        res.json(discounts);
    }

    async getDiscount(req: Request, res: Response) {
        try {
            const discount = await DiscountService.getInstance().getById(req.params.discount_id);
            if(discount === null) {
                res.status(404).end().json("discount not found in DB!");
                return;
            }
            res.json(discount);
        } catch(err) {
            res.status(400).end().json("getDiscount error!");
            return;
        }
    }

    async deleteDiscount(req: Request, res: Response) {
        try {
            const success = await DiscountService.getInstance().deleteById(req.params.discount_id);
            if(success) {
                res.status(204).end().json("discount deleted succesfully!");
            } else {
                res.status(404).end().json("discount delete failed");
            }
        } catch(err) {
            res.status(400).end().json("discount delete error");
        }
    }

    async updateDiscount(req: Request, res: Response) {
        try {
            const discount = await DiscountService.getInstance()
                .updateById(req.params.discount_id, req.body);
            if(!discount) {
                res.status(404).end().json("discount not found in DB!");
                return;
            }
            res.json(discount);
        } catch (err) {
            res.status(400).end().json("discount error");
        }
    }

    buildRoutes(): Router {
        const router = express.Router();

        router.use(checkUserConnected());
        router.use(isBigBoss());
        router.post('/', express.json(), this.createDiscount.bind(this)); // permet de forcer le this lors de l'appel de la fonction sayHello
        router.get('/', this.getAllDiscounts.bind(this));
        router.get('/:discount_id', this.getDiscount.bind(this));
        router.delete('/:discount_id', this.deleteDiscount.bind(this));
        router.put('/:discount_id', express.json(), this.updateDiscount.bind(this));
        return router;
    }
}
