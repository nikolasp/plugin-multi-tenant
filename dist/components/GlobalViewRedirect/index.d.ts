import type { CollectionSlug, ServerProps, ViewTypes } from 'payload';
type Args = {
    collectionSlug: CollectionSlug;
    docID?: number | string;
    globalSlugs: string[];
    tenantFieldName: string;
    tenantsCollectionSlug: string;
    useAsTitle: string;
    viewType: ViewTypes;
} & ServerProps;
export declare const GlobalViewRedirect: (args: Args) => Promise<void>;
export {};
