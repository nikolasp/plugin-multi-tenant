import type { RelationshipFieldClientProps } from 'payload';
import React from 'react';
import './index.scss';
type Props = {
    debug?: boolean;
    unique?: boolean;
} & RelationshipFieldClientProps;
export declare const TenantField: (args: Props) => React.JSX.Element | null;
export {};
