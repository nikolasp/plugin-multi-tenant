import { jsx as _jsx } from "react/jsx-runtime";
import { cookies as getCookies } from "next/headers";
import { SELECT_ALL } from "../../constants";
import { findTenantOptions } from "../../queries/findTenantOptions";
import { TenantSelectionProviderClient } from "./index.client";
import React from "react";
export const TenantSelectionProvider = async ({ children, payload, tenantsCollectionSlug, useAsTitle, user })=>{
    let tenantOptions = [];
    try {
        const { docs } = await findTenantOptions({
            limit: 0,
            payload,
            tenantsCollectionSlug,
            useAsTitle,
            user
        });
        tenantOptions = docs.map((doc)=>({
                label: String(doc[useAsTitle]),
                value: doc.id
            }));
    } catch (_) {
    // user likely does not have access
    }
    const cookies = await getCookies();
    let tenantCookie = cookies.get('payload-tenant')?.value;
    let initialValue = undefined;
    if (tenantOptions.length > 1 && tenantCookie === SELECT_ALL) {
        initialValue = SELECT_ALL;
    } else {
        const matchingOption = tenantOptions.find((option)=>String(option.value) === tenantCookie);
        if (matchingOption) {
            initialValue = matchingOption.value;
        } else {
            tenantCookie = undefined;
            initialValue = tenantOptions.length > 1 ? SELECT_ALL : tenantOptions[0]?.value;
        }
    }
    return /*#__PURE__*/ _jsx(TenantSelectionProviderClient, {
        initialValue: initialValue,
        tenantCookie: tenantCookie,
        tenantOptions: tenantOptions,
        children: children
    });
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvVGVuYW50U2VsZWN0aW9uUHJvdmlkZXIvaW5kZXgudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgT3B0aW9uT2JqZWN0LCBQYXlsb2FkLCBVc2VyIH0gZnJvbSAncGF5bG9hZCdcblxuaW1wb3J0IHsgY29va2llcyBhcyBnZXRDb29raWVzIH0gZnJvbSAnbmV4dC9oZWFkZXJzJ1xuXG5pbXBvcnQgeyBTRUxFQ1RfQUxMIH0gZnJvbSAnLi4vLi4vY29uc3RhbnRzJ1xuaW1wb3J0IHsgZmluZFRlbmFudE9wdGlvbnMgfSBmcm9tICcuLi8uLi9xdWVyaWVzL2ZpbmRUZW5hbnRPcHRpb25zJ1xuaW1wb3J0IHsgVGVuYW50U2VsZWN0aW9uUHJvdmlkZXJDbGllbnQgfSBmcm9tICcuL2luZGV4LmNsaWVudCdcbmltcG9ydCB7IFVzZXJXaXRoVGVuYW50c0ZpZWxkIH0gZnJvbSAnQC90eXBlcydcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcblxudHlwZSBBcmdzID0ge1xuICBjaGlsZHJlbjogUmVhY3QuUmVhY3ROb2RlXG4gIHBheWxvYWQ6IFBheWxvYWRcbiAgdGVuYW50c0NvbGxlY3Rpb25TbHVnOiBzdHJpbmdcbiAgdXNlQXNUaXRsZTogc3RyaW5nXG4gIHVzZXI6IFVzZXJXaXRoVGVuYW50c0ZpZWxkXG59XG5cbmV4cG9ydCBjb25zdCBUZW5hbnRTZWxlY3Rpb25Qcm92aWRlcjogUmVhY3QuRkM8QXJncz4gPSBhc3luYyAoe1xuICBjaGlsZHJlbixcbiAgcGF5bG9hZCxcbiAgdGVuYW50c0NvbGxlY3Rpb25TbHVnLFxuICB1c2VBc1RpdGxlLFxuICB1c2VyLFxufSkgPT4ge1xuICBsZXQgdGVuYW50T3B0aW9uczogT3B0aW9uT2JqZWN0W10gPSBbXVxuXG4gIHRyeSB7XG4gICAgY29uc3QgeyBkb2NzIH0gPSBhd2FpdCBmaW5kVGVuYW50T3B0aW9ucyh7XG4gICAgICBsaW1pdDogMCxcbiAgICAgIHBheWxvYWQsXG4gICAgICB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgICB1c2VBc1RpdGxlLFxuICAgICAgdXNlcixcbiAgICB9KVxuICAgIHRlbmFudE9wdGlvbnMgPSBkb2NzLm1hcCgoZG9jKSA9PiAoe1xuICAgICAgbGFiZWw6IFN0cmluZyhkb2NbdXNlQXNUaXRsZV0pLFxuICAgICAgdmFsdWU6IGRvYy5pZCxcbiAgICB9KSlcbiAgfSBjYXRjaCAoXykge1xuICAgIC8vIHVzZXIgbGlrZWx5IGRvZXMgbm90IGhhdmUgYWNjZXNzXG4gIH1cblxuICBjb25zdCBjb29raWVzID0gYXdhaXQgZ2V0Q29va2llcygpXG4gIGxldCB0ZW5hbnRDb29raWUgPSBjb29raWVzLmdldCgncGF5bG9hZC10ZW5hbnQnKT8udmFsdWVcbiAgbGV0IGluaXRpYWxWYWx1ZSA9IHVuZGVmaW5lZFxuXG4gIGlmICh0ZW5hbnRPcHRpb25zLmxlbmd0aCA+IDEgJiYgdGVuYW50Q29va2llID09PSBTRUxFQ1RfQUxMKSB7XG4gICAgaW5pdGlhbFZhbHVlID0gU0VMRUNUX0FMTFxuICB9IGVsc2Uge1xuICAgIGNvbnN0IG1hdGNoaW5nT3B0aW9uID0gdGVuYW50T3B0aW9ucy5maW5kKChvcHRpb24pID0+IFN0cmluZyhvcHRpb24udmFsdWUpID09PSB0ZW5hbnRDb29raWUpXG4gICAgaWYgKG1hdGNoaW5nT3B0aW9uKSB7XG4gICAgICBpbml0aWFsVmFsdWUgPSBtYXRjaGluZ09wdGlvbi52YWx1ZVxuICAgIH0gZWxzZSB7XG4gICAgICB0ZW5hbnRDb29raWUgPSB1bmRlZmluZWRcbiAgICAgIGluaXRpYWxWYWx1ZSA9IHRlbmFudE9wdGlvbnMubGVuZ3RoID4gMSA/IFNFTEVDVF9BTEwgOiB0ZW5hbnRPcHRpb25zWzBdPy52YWx1ZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPFRlbmFudFNlbGVjdGlvblByb3ZpZGVyQ2xpZW50XG4gICAgICBpbml0aWFsVmFsdWU9e2luaXRpYWxWYWx1ZX1cbiAgICAgIHRlbmFudENvb2tpZT17dGVuYW50Q29va2llfVxuICAgICAgdGVuYW50T3B0aW9ucz17dGVuYW50T3B0aW9uc31cbiAgICA+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9UZW5hbnRTZWxlY3Rpb25Qcm92aWRlckNsaWVudD5cbiAgKVxufVxuIl0sIm5hbWVzIjpbImNvb2tpZXMiLCJnZXRDb29raWVzIiwiU0VMRUNUX0FMTCIsImZpbmRUZW5hbnRPcHRpb25zIiwiVGVuYW50U2VsZWN0aW9uUHJvdmlkZXJDbGllbnQiLCJSZWFjdCIsIlRlbmFudFNlbGVjdGlvblByb3ZpZGVyIiwiY2hpbGRyZW4iLCJwYXlsb2FkIiwidGVuYW50c0NvbGxlY3Rpb25TbHVnIiwidXNlQXNUaXRsZSIsInVzZXIiLCJ0ZW5hbnRPcHRpb25zIiwiZG9jcyIsImxpbWl0IiwibWFwIiwiZG9jIiwibGFiZWwiLCJTdHJpbmciLCJ2YWx1ZSIsImlkIiwiXyIsInRlbmFudENvb2tpZSIsImdldCIsImluaXRpYWxWYWx1ZSIsInVuZGVmaW5lZCIsImxlbmd0aCIsIm1hdGNoaW5nT3B0aW9uIiwiZmluZCIsIm9wdGlvbiJdLCJtYXBwaW5ncyI6IjtBQUVBLFNBQVNBLFdBQVdDLFVBQVUsUUFBUSxlQUFjO0FBRXBELFNBQVNDLFVBQVUsUUFBUSxrQkFBaUI7QUFDNUMsU0FBU0MsaUJBQWlCLFFBQVEsa0NBQWlDO0FBQ25FLFNBQVNDLDZCQUE2QixRQUFRLGlCQUFnQjtBQUU5RCxPQUFPQyxXQUFXLFFBQU87QUFVekIsT0FBTyxNQUFNQywwQkFBMEMsT0FBTyxFQUM1REMsUUFBUSxFQUNSQyxPQUFPLEVBQ1BDLHFCQUFxQixFQUNyQkMsVUFBVSxFQUNWQyxJQUFJLEVBQ0w7SUFDQyxJQUFJQyxnQkFBZ0MsRUFBRTtJQUV0QyxJQUFJO1FBQ0YsTUFBTSxFQUFFQyxJQUFJLEVBQUUsR0FBRyxNQUFNVixrQkFBa0I7WUFDdkNXLE9BQU87WUFDUE47WUFDQUM7WUFDQUM7WUFDQUM7UUFDRjtRQUNBQyxnQkFBZ0JDLEtBQUtFLEdBQUcsQ0FBQyxDQUFDQyxNQUFTLENBQUE7Z0JBQ2pDQyxPQUFPQyxPQUFPRixHQUFHLENBQUNOLFdBQVc7Z0JBQzdCUyxPQUFPSCxJQUFJSSxFQUFFO1lBQ2YsQ0FBQTtJQUNGLEVBQUUsT0FBT0MsR0FBRztJQUNWLG1DQUFtQztJQUNyQztJQUVBLE1BQU1yQixVQUFVLE1BQU1DO0lBQ3RCLElBQUlxQixlQUFldEIsUUFBUXVCLEdBQUcsQ0FBQyxtQkFBbUJKO0lBQ2xELElBQUlLLGVBQWVDO0lBRW5CLElBQUliLGNBQWNjLE1BQU0sR0FBRyxLQUFLSixpQkFBaUJwQixZQUFZO1FBQzNEc0IsZUFBZXRCO0lBQ2pCLE9BQU87UUFDTCxNQUFNeUIsaUJBQWlCZixjQUFjZ0IsSUFBSSxDQUFDLENBQUNDLFNBQVdYLE9BQU9XLE9BQU9WLEtBQUssTUFBTUc7UUFDL0UsSUFBSUssZ0JBQWdCO1lBQ2xCSCxlQUFlRyxlQUFlUixLQUFLO1FBQ3JDLE9BQU87WUFDTEcsZUFBZUc7WUFDZkQsZUFBZVosY0FBY2MsTUFBTSxHQUFHLElBQUl4QixhQUFhVSxhQUFhLENBQUMsRUFBRSxFQUFFTztRQUMzRTtJQUNGO0lBRUEscUJBQ0UsS0FBQ2Y7UUFDQ29CLGNBQWNBO1FBQ2RGLGNBQWNBO1FBQ2RWLGVBQWVBO2tCQUVkTDs7QUFHUCxFQUFDIn0=