import type { Field } from 'payload';
type AddFilterOptionsToFieldsArgs = {
    fields: Field[];
    tenantEnabledCollectionSlugs: string[];
    tenantEnabledGlobalSlugs: string[];
    tenantFieldName: string;
    tenantsCollectionSlug: string;
};
export declare function addFilterOptionsToFields({ fields, tenantEnabledCollectionSlugs, tenantEnabledGlobalSlugs, tenantFieldName, tenantsCollectionSlug, }: AddFilterOptionsToFieldsArgs): void;
export {};
