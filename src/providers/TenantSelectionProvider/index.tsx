import type { OptionObject, Payload, User } from 'payload'

import { cookies as getCookies } from 'next/headers'

import { SELECT_ALL } from '../../constants'
import { findTenantOptions } from '../../queries/findTenantOptions'
import { TenantSelectionProviderClient } from './index.client'
import { UserWithTenantsField } from '@/types'
import React from 'react'

type Args = {
  children: React.ReactNode
  payload: Payload
  tenantsCollectionSlug: string
  useAsTitle: string
  user: UserWithTenantsField
}

export const TenantSelectionProvider: React.FC<Args> = async ({
  children,
  payload,
  tenantsCollectionSlug,
  useAsTitle,
  user,
}) => {
  let tenantOptions: OptionObject[] = []

  try {
    const { docs } = await findTenantOptions({
      limit: 0,
      payload,
      tenantsCollectionSlug,
      useAsTitle,
      user,
    })
    tenantOptions = docs.map((doc) => ({
      label: String(doc[useAsTitle]),
      value: doc.id,
    }))
  } catch (_) {
    // user likely does not have access
  }

  const cookies = await getCookies()
  let tenantCookie = cookies.get('payload-tenant')?.value
  let initialValue = undefined

  if (tenantOptions.length > 1 && tenantCookie === SELECT_ALL) {
    initialValue = SELECT_ALL
  } else {
    const matchingOption = tenantOptions.find((option) => String(option.value) === tenantCookie)
    if (matchingOption) {
      initialValue = matchingOption.value
    } else {
      tenantCookie = undefined
      initialValue = tenantOptions.length > 1 ? SELECT_ALL : tenantOptions[0]?.value
    }
  }

  return (
    <TenantSelectionProviderClient
      initialValue={initialValue}
      tenantCookie={tenantCookie}
      tenantOptions={tenantOptions}
    >
      {children}
    </TenantSelectionProviderClient>
  )
}
