import type { OptionObject } from 'payload';
import React from 'react';
type ContextType = {
    options: OptionObject[];
    selectedTenantID: number | string | undefined;
    setPreventRefreshOnChange: React.Dispatch<React.SetStateAction<boolean>>;
    setTenant: (args: {
        id: number | string | undefined;
        refresh?: boolean;
    }) => void;
};
export declare const TenantSelectionProviderClient: ({ children, initialValue, tenantCookie, tenantOptions, }: {
    children: React.ReactNode;
    initialValue?: number | string;
    tenantCookie?: string;
    tenantOptions: OptionObject[];
}) => React.JSX.Element;
export declare const useTenantSelection: () => ContextType;
export {};
