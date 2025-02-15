import type { Config, Field, SanitizedConfig } from "payload";
type AddFilterOptionsToFieldsArgs = {
    config: (Config | SanitizedConfig) & {
        blocks?: {
            slug: string;
            fields: Field[];
            [key: string]: unknown;
        }[];
    };
    fields: Field[];
    tenantEnabledCollectionSlugs: string[];
    tenantEnabledGlobalSlugs: string[];
    tenantFieldName: string;
    tenantsCollectionSlug: string;
};
export declare function addFilterOptionsToFields({ config, fields, tenantEnabledCollectionSlugs, tenantEnabledGlobalSlugs, tenantFieldName, tenantsCollectionSlug, }: AddFilterOptionsToFieldsArgs): void;
export {};
