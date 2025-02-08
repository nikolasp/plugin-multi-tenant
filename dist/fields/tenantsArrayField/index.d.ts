import type { ArrayField, RelationshipField } from 'payload';
type Args = {
    arrayFieldAccess?: ArrayField['access'];
    rowFields?: ArrayField['fields'];
    tenantFieldAccess?: RelationshipField['access'];
    tenantsArrayFieldName: ArrayField['name'];
    tenantsArrayTenantFieldName: RelationshipField['name'];
    tenantsCollectionSlug: string;
};
export declare const tenantsArrayField: ({ arrayFieldAccess, rowFields, tenantFieldAccess, tenantsArrayFieldName, tenantsArrayTenantFieldName, tenantsCollectionSlug, }: Args) => ArrayField;
export {};
