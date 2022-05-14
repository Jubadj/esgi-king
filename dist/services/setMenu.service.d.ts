import { SetMenuDocument, SetMenuProps } from "../models";
export declare class SetMenuService {
    private static instance?;
    static getInstance(): SetMenuService;
    private constructor();
    createSetMenu(props: SetMenuProps): Promise<SetMenuDocument>;
    getAll(): Promise<SetMenuDocument[]>;
    getById(setMenuId: string): Promise<SetMenuDocument | null>;
    getByName(info: Pick<SetMenuProps, 'name'>): Promise<SetMenuDocument | null>;
    deleteById(setMenuId: string): Promise<boolean>;
    updateById(setMenuId: string, props: SetMenuProps): Promise<SetMenuDocument | null>;
}
