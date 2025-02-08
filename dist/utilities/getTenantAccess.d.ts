import type { Where } from 'payload';
import type { UserWithTenantsField } from '../types';
type Args = {
    fieldName: string;
    user: UserWithTenantsField;
};
export declare function getTenantAccess({ fieldName, user }: Args): Where;
export {};
