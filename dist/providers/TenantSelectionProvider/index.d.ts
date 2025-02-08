import type { Payload } from 'payload';
import { UserWithTenantsField } from '@/types';
import React from 'react';
type Args = {
    children: React.ReactNode;
    payload: Payload;
    tenantsCollectionSlug: string;
    useAsTitle: string;
    user: UserWithTenantsField;
};
export declare const TenantSelectionProvider: React.FC<Args>;
export {};
