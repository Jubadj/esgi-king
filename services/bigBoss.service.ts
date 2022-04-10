import {BigBossDocument, BigBossModel, BigBossProps} from "../models";


export class BigBossService {

    private static instance?: BigBossService;

    public static getInstance(): BigBossService {
        if(BigBossService.instance === undefined) {
            BigBossService.instance = new BigBossService();
        }
        return BigBossService.instance;
    }

    private constructor() { }

    public async createBigBoss(props: BigBossProps): Promise<BigBossDocument> {
        const model = new BigBossModel(props);
        const bigBoss = await model.save();
        return bigBoss;
    }

    async getById(bigBossId: string): Promise<BigBossDocument | null> {
        return BigBossModel.findById(bigBossId).exec();
    }

    async deleteById(bigBossId: string): Promise<boolean> {
        const res = await BigBossModel.deleteOne({_id: bigBossId}).exec();
        return res.deletedCount === 1;
    }

    // async updateById(bigBossId: string, props: BigBossProps): Promise<BigBossDocument | null> {
    //     const bigBoss = await this.getById(bigBossId);
    //     if(!bigBoss) {
    //         return null;
    //     }
    //     if(props.name !== undefined) {
    //         bigBoss.name = props.name;
    //     }
    //     if(props.price !== undefined) {
    //         bigBoss.price = props.price;
    //     }
    //     if(props.origin !== undefined) {
    //         bigBoss.origin = props.origin;
    //     }
    //     if(props.intensity !== undefined) {
    //         bigBoss.intensity = props.intensity;
    //     }
    //     const res = await bigBoss.save();
    //     return res;
    // }


}