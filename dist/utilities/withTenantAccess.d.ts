import type { Access, AccessArgs, AccessResult } from 'payload';
import type { MultiTenantPluginConfig } from '../types';
type Args<ConfigType> = {
    accessFunction?: Access;
    fieldName: string;
    userHasAccessToAllTenants: Required<MultiTenantPluginConfig<ConfigType>>['userHasAccessToAllTenants'];
};
export declare const withTenantAccess: <ConfigType>({ accessFunction, fieldName, userHasAccessToAllTenants }: Args<ConfigType>) => (args: AccessArgs) => Promise<AccessResult>;
export {};
