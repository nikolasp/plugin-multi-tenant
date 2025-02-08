import type { BaseListFilter } from 'payload';
type Args = {
    baseListFilter?: BaseListFilter;
    tenantFieldName: string;
    tenantsCollectionSlug: string;
};
/**
 * Combines a base list filter with a tenant list filter
 *
 * Combines where constraints inside of an AND operator
 */
export declare const withTenantListFilter: ({ baseListFilter, tenantFieldName, tenantsCollectionSlug }: Args) => BaseListFilter;
export {};
