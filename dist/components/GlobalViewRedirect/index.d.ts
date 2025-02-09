import type { CollectionSlug, ServerProps, ViewTypes } from 'payload';
import { UserWithTenantsField } from '@/types';
type Args = ServerProps & {
    collectionSlug: CollectionSlug;
    docID?: number | string;
    globalSlugs: string[];
    tenantFieldName: string;
    tenantsCollectionSlug: string;
    useAsTitle: string;
    viewType: ViewTypes;
    user: UserWithTenantsField;
};
export declare const GlobalViewRedirect: (args: Args) => Promise<void>;
export {};
