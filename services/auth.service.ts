import {UserDocument, UserModel, UserProps} from "../models";
import {SecurityUtils} from "../utils";
import {SessionDocument, SessionModel} from "../models";

export class AuthService {

    private static instance?: AuthService;

    public static getInstance(): AuthService {
        if(AuthService.instance === undefined) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    private constructor() { }

    public async subscribeUser(user: Partial<UserProps>): Promise<UserDocument> {
        if(!user.password) {
            throw new Error('Missing password');
        }
        const model = new UserModel({
            login: user.login,
            password: SecurityUtils.sha512(user.password),
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
        });
        return model.save();
    }

    // Pick selectionne des champs dans le type
    public async logIn(info: Pick<UserProps, 'login' | 'password'>, platform: string): Promise<SessionDocument | null> {
        const user = await UserModel.findOne({
            login: info.login,
            password: SecurityUtils.sha512(info.password)
        }).exec();
        if(user === null) {
            throw new Error('User not found');
        }
        // 604_800 -> 1 week in seconds
        const currentDate = new Date();
        const expirationDate = new Date(currentDate.getTime() + 604_800_000);
        const session = await SessionModel.create({
            platform,
            expiration: expirationDate,
            user: user._id
        });
        user.sessions.push(session._id); // permet de memoriser la session dans le user
        await user.save();
        return session;
    }

    public async getById(userId: string): Promise<UserDocument | null> {
        return UserModel.findById(userId).exec();
    }

    /*
    * To get a user with his token
    * */
    public async getUserFrom(token: string): Promise<UserProps | null> {
        const session = await SessionModel.findOne({
           _id: token,
           expiration: {
               $gte: new Date()
           }
        }).populate("user").exec();
        return session ? session.user as UserProps : null;
    }

    public async getUserFromToken(token: string): Promise<UserDocument | null> {
        const session = await SessionModel.findOne({
           _id: token,
           expiration: {
               $gte: new Date()
           }
        }).populate("user").exec();
        return session ? session.user as UserDocument : null;
    }

    async deleteUserById(userId: string): Promise<boolean> {
        const res = await UserModel.deleteOne({_id: userId}).exec();
        return res.deletedCount === 1;
    }
}
