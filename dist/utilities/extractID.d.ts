import type { Tenant } from '../types';
export declare const extractID: <IDType extends number | string>(objectOrID: IDType | Tenant<IDType>) => IDType;
