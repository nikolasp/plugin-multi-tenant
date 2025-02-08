import type { PaginatedDocs, Payload, User } from 'payload';
type Args = {
    limit: number;
    payload: Payload;
    tenantsCollectionSlug: string;
    useAsTitle: string;
    user?: User;
};
export declare const findTenantOptions: ({ limit, payload, tenantsCollectionSlug, useAsTitle, user, }: Args) => Promise<PaginatedDocs>;
export {};
