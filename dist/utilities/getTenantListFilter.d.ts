import type { PayloadRequest, Where } from 'payload';
type Args = {
    req: PayloadRequest;
    tenantFieldName: string;
    tenantsCollectionSlug: string;
};
export declare const getTenantListFilter: ({ req, tenantFieldName, tenantsCollectionSlug, }: Args) => null | Where;
export {};
