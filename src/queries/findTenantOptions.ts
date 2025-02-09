import { UserWithTenantsField } from "@/types";
import { getUserTenantIDs } from "./../utilities/getUserTenantIDs";
import type { PaginatedDocs, Payload } from "payload";

type Args = {
  limit: number;
  payload: Payload;
  tenantsCollectionSlug: string;
  useAsTitle: string;
  user?: UserWithTenantsField;
};
export const findTenantOptions = async ({
  limit,
  payload,
  tenantsCollectionSlug,
  useAsTitle,
  user,
}: Args): Promise<PaginatedDocs> => {
  const additionalConditions = user?.role.includes("superAdmin")
    ? {}
    : {
        where: {
          id: {
            in: (user && getUserTenantIDs(user)) || [],
          },
        },
      };
  return payload.find({
    collection: tenantsCollectionSlug,
    depth: 0,
    limit,
    overrideAccess: false,
    select: {
      [useAsTitle]: true,
    },
    sort: useAsTitle,
    user,
    ...additionalConditions,
  });
};
