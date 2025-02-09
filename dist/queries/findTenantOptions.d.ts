import { UserWithTenantsField } from "@/types";
import type { PaginatedDocs, Payload } from "payload";
type Args = {
    limit: number;
    payload: Payload;
    tenantsCollectionSlug: string;
    useAsTitle: string;
    user?: UserWithTenantsField;
};
export declare const findTenantOptions: ({ limit, payload, tenantsCollectionSlug, useAsTitle, user, }: Args) => Promise<PaginatedDocs>;
export {};
