import type { CollectionConfig } from 'payload';
import type { MultiTenantPluginConfig } from '../types';
type Args<ConfigType> = {
    collection: CollectionConfig;
    fieldName: string;
    userHasAccessToAllTenants: Required<MultiTenantPluginConfig<ConfigType>>['userHasAccessToAllTenants'];
};
/**
 * Adds tenant access constraint to collection
 * - constrains access a users assigned tenants
 */
export declare const addCollectionAccess: <ConfigType>({ collection, fieldName, userHasAccessToAllTenants, }: Args<ConfigType>) => void;
export {};
