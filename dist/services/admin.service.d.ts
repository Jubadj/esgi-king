import { AdminDocument, AdminProps } from "../models";
export declare class AdminService {
    private static instance?;
    static getInstance(): AdminService;
    private constructor();
    createAdmin(props: AdminProps): Promise<AdminDocument>;
    getAll(): Promise<AdminDocument[]>;
    getById(adminId: string): Promise<AdminDocument | null>;
    deleteById(adminId: string): Promise<boolean>;
    updateById(adminId: string, props: AdminProps): Promise<AdminDocument | null>;
}
