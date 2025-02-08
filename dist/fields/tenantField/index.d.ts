import { type RelationshipField } from 'payload';
type Args = {
    access?: RelationshipField['access'];
    debug?: boolean;
    name: string;
    tenantsCollectionSlug: string;
    unique: boolean;
};
export declare const tenantField: ({ name, access, debug, tenantsCollectionSlug, unique, }: Args) => RelationshipField;
export {};
