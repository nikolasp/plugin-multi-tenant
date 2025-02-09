import type { Tenant, UserWithTenantsField } from '../types'

import { extractID } from './extractID'

/**
 * Returns array of all tenant IDs assigned to a user
 *
 * @param user - User object with tenants field
 */
export const getUserTenantIDs = <IDType extends number | string>(
  user: null | UserWithTenantsField,
): IDType[] => {
  if (!user) {
    return []
  }

  return (
    user?.skole?.reduce<IDType[]>((acc, tenant) => {
      if (tenant) {
        acc.push(extractID<IDType>(tenant as Tenant<IDType>))
      }

      return acc
    }, []) || []
  )
}
