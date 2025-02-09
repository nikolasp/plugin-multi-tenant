import type { Payload, ViewTypes } from 'payload';
import { UserWithTenantsField } from '@/types';
type Args = {
    docID?: number | string;
    headers: Headers;
    payload: Payload;
    slug: string;
    tenantFieldName: string;
    tenantsCollectionSlug: string;
    useAsTitle: string;
    user?: UserWithTenantsField;
    view: ViewTypes;
};
export declare function getGlobalViewRedirect({ slug, docID, headers, payload, tenantFieldName, tenantsCollectionSlug, useAsTitle, user, view, }: Args): Promise<string | void>;
export {};
