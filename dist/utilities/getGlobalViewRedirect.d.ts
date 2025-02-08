import type { Payload, User, ViewTypes } from 'payload';
type Args = {
    docID?: number | string;
    headers: Headers;
    payload: Payload;
    slug: string;
    tenantFieldName: string;
    tenantsCollectionSlug: string;
    useAsTitle: string;
    user?: User;
    view: ViewTypes;
};
export declare function getGlobalViewRedirect({ slug, docID, headers, payload, tenantFieldName, tenantsCollectionSlug, useAsTitle, user, view, }: Args): Promise<string | void>;
export {};
