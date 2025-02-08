import { getCollectionIDType } from "./getCollectionIDType";
import { getTenantFromCookie } from "./getTenantFromCookie";
export function addFilterOptionsToFields({ fields, tenantEnabledCollectionSlugs, tenantEnabledGlobalSlugs, tenantFieldName, tenantsCollectionSlug }) {
    fields.forEach((field)=>{
        if (field.type === 'relationship') {
            /**
       * Adjusts relationship fields to filter by tenant
       * and ensures relationTo cannot be a tenant global collection
       */ if (typeof field.relationTo === 'string') {
                if (tenantEnabledGlobalSlugs.includes(field.relationTo)) {
                    throw new Error(`The collection ${field.relationTo} is a global collection and cannot be related to a tenant enabled collection.`);
                }
                if (tenantEnabledCollectionSlugs.includes(field.relationTo)) {
                    addFilter({
                        field,
                        tenantEnabledCollectionSlugs,
                        tenantFieldName,
                        tenantsCollectionSlug
                    });
                }
            } else {
                field.relationTo.map((relationTo)=>{
                    if (tenantEnabledGlobalSlugs.includes(relationTo)) {
                        throw new Error(`The collection ${relationTo} is a global collection and cannot be related to a tenant enabled collection.`);
                    }
                    if (tenantEnabledCollectionSlugs.includes(relationTo)) {
                        addFilter({
                            field,
                            tenantEnabledCollectionSlugs,
                            tenantFieldName,
                            tenantsCollectionSlug
                        });
                    }
                });
            }
        }
        if (field.type === 'row' || field.type === 'array' || field.type === 'collapsible' || field.type === 'group') {
            addFilterOptionsToFields({
                fields: field.fields,
                tenantEnabledCollectionSlugs,
                tenantEnabledGlobalSlugs,
                tenantFieldName,
                tenantsCollectionSlug
            });
        }
        if (field.type === 'blocks') {
            field.blocks.forEach((block)=>{
                addFilterOptionsToFields({
                    fields: block.fields,
                    tenantEnabledCollectionSlugs,
                    tenantEnabledGlobalSlugs,
                    tenantFieldName,
                    tenantsCollectionSlug
                });
            });
        }
        if (field.type === 'tabs') {
            field.tabs.forEach((tab)=>{
                addFilterOptionsToFields({
                    fields: tab.fields,
                    tenantEnabledCollectionSlugs,
                    tenantEnabledGlobalSlugs,
                    tenantFieldName,
                    tenantsCollectionSlug
                });
            });
        }
    });
}
function addFilter({ field, tenantEnabledCollectionSlugs, tenantFieldName, tenantsCollectionSlug }) {
    // User specified filter
    const originalFilter = field.filterOptions;
    field.filterOptions = async (args)=>{
        const originalFilterResult = typeof originalFilter === 'function' ? await originalFilter(args) : originalFilter ?? true;
        // If the relationTo is not a tenant enabled collection, return early
        if (args.relationTo && !tenantEnabledCollectionSlugs.includes(args.relationTo)) {
            return originalFilterResult;
        }
        // If the original filtr returns false, return early
        if (originalFilterResult === false) {
            return false;
        }
        // Custom tenant filter
        const tenantFilterResults = filterOptionsByTenant({
            ...args,
            tenantFieldName,
            tenantsCollectionSlug
        });
        // If the tenant filter returns true, just use the original filter
        if (tenantFilterResults === true) {
            return originalFilterResult;
        }
        // If the original filter returns true, just use the tenant filter
        if (originalFilterResult === true) {
            return tenantFilterResults;
        }
        return {
            and: [
                originalFilterResult,
                tenantFilterResults
            ]
        };
    };
}
const filterOptionsByTenant = ({ req, tenantFieldName = 'tenant', tenantsCollectionSlug })=>{
    const idType = getCollectionIDType({
        collectionSlug: tenantsCollectionSlug,
        payload: req.payload
    });
    const selectedTenant = getTenantFromCookie(req.headers, idType);
    if (!selectedTenant) {
        return true;
    }
    return {
        or: [
            // ie a related collection that doesn't have a tenant field
            {
                [tenantFieldName]: {
                    exists: false
                }
            },
            // related collections that have a tenant field
            {
                [tenantFieldName]: {
                    equals: selectedTenant
                }
            }
        ]
    };
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsaXRpZXMvYWRkRmlsdGVyT3B0aW9uc1RvRmllbGRzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgRmllbGQsIEZpbHRlck9wdGlvbnNQcm9wcywgUmVsYXRpb25zaGlwRmllbGQgfSBmcm9tICdwYXlsb2FkJ1xuXG5pbXBvcnQgeyBnZXRDb2xsZWN0aW9uSURUeXBlIH0gZnJvbSAnLi9nZXRDb2xsZWN0aW9uSURUeXBlJ1xuaW1wb3J0IHsgZ2V0VGVuYW50RnJvbUNvb2tpZSB9IGZyb20gJy4vZ2V0VGVuYW50RnJvbUNvb2tpZSdcblxudHlwZSBBZGRGaWx0ZXJPcHRpb25zVG9GaWVsZHNBcmdzID0ge1xuICBmaWVsZHM6IEZpZWxkW11cbiAgdGVuYW50RW5hYmxlZENvbGxlY3Rpb25TbHVnczogc3RyaW5nW11cbiAgdGVuYW50RW5hYmxlZEdsb2JhbFNsdWdzOiBzdHJpbmdbXVxuICB0ZW5hbnRGaWVsZE5hbWU6IHN0cmluZ1xuICB0ZW5hbnRzQ29sbGVjdGlvblNsdWc6IHN0cmluZ1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYWRkRmlsdGVyT3B0aW9uc1RvRmllbGRzKHtcbiAgZmllbGRzLFxuICB0ZW5hbnRFbmFibGVkQ29sbGVjdGlvblNsdWdzLFxuICB0ZW5hbnRFbmFibGVkR2xvYmFsU2x1Z3MsXG4gIHRlbmFudEZpZWxkTmFtZSxcbiAgdGVuYW50c0NvbGxlY3Rpb25TbHVnLFxufTogQWRkRmlsdGVyT3B0aW9uc1RvRmllbGRzQXJncykge1xuICBmaWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICBpZiAoZmllbGQudHlwZSA9PT0gJ3JlbGF0aW9uc2hpcCcpIHtcbiAgICAgIC8qKlxuICAgICAgICogQWRqdXN0cyByZWxhdGlvbnNoaXAgZmllbGRzIHRvIGZpbHRlciBieSB0ZW5hbnRcbiAgICAgICAqIGFuZCBlbnN1cmVzIHJlbGF0aW9uVG8gY2Fubm90IGJlIGEgdGVuYW50IGdsb2JhbCBjb2xsZWN0aW9uXG4gICAgICAgKi9cbiAgICAgIGlmICh0eXBlb2YgZmllbGQucmVsYXRpb25UbyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKHRlbmFudEVuYWJsZWRHbG9iYWxTbHVncy5pbmNsdWRlcyhmaWVsZC5yZWxhdGlvblRvKSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgIGBUaGUgY29sbGVjdGlvbiAke2ZpZWxkLnJlbGF0aW9uVG99IGlzIGEgZ2xvYmFsIGNvbGxlY3Rpb24gYW5kIGNhbm5vdCBiZSByZWxhdGVkIHRvIGEgdGVuYW50IGVuYWJsZWQgY29sbGVjdGlvbi5gLFxuICAgICAgICAgIClcbiAgICAgICAgfVxuICAgICAgICBpZiAodGVuYW50RW5hYmxlZENvbGxlY3Rpb25TbHVncy5pbmNsdWRlcyhmaWVsZC5yZWxhdGlvblRvKSkge1xuICAgICAgICAgIGFkZEZpbHRlcih7IGZpZWxkLCB0ZW5hbnRFbmFibGVkQ29sbGVjdGlvblNsdWdzLCB0ZW5hbnRGaWVsZE5hbWUsIHRlbmFudHNDb2xsZWN0aW9uU2x1ZyB9KVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWVsZC5yZWxhdGlvblRvLm1hcCgocmVsYXRpb25UbykgPT4ge1xuICAgICAgICAgIGlmICh0ZW5hbnRFbmFibGVkR2xvYmFsU2x1Z3MuaW5jbHVkZXMocmVsYXRpb25UbykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgYFRoZSBjb2xsZWN0aW9uICR7cmVsYXRpb25Ub30gaXMgYSBnbG9iYWwgY29sbGVjdGlvbiBhbmQgY2Fubm90IGJlIHJlbGF0ZWQgdG8gYSB0ZW5hbnQgZW5hYmxlZCBjb2xsZWN0aW9uLmAsXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0ZW5hbnRFbmFibGVkQ29sbGVjdGlvblNsdWdzLmluY2x1ZGVzKHJlbGF0aW9uVG8pKSB7XG4gICAgICAgICAgICBhZGRGaWx0ZXIoe1xuICAgICAgICAgICAgICBmaWVsZCxcbiAgICAgICAgICAgICAgdGVuYW50RW5hYmxlZENvbGxlY3Rpb25TbHVncyxcbiAgICAgICAgICAgICAgdGVuYW50RmllbGROYW1lLFxuICAgICAgICAgICAgICB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBmaWVsZC50eXBlID09PSAncm93JyB8fFxuICAgICAgZmllbGQudHlwZSA9PT0gJ2FycmF5JyB8fFxuICAgICAgZmllbGQudHlwZSA9PT0gJ2NvbGxhcHNpYmxlJyB8fFxuICAgICAgZmllbGQudHlwZSA9PT0gJ2dyb3VwJ1xuICAgICkge1xuICAgICAgYWRkRmlsdGVyT3B0aW9uc1RvRmllbGRzKHtcbiAgICAgICAgZmllbGRzOiBmaWVsZC5maWVsZHMsXG4gICAgICAgIHRlbmFudEVuYWJsZWRDb2xsZWN0aW9uU2x1Z3MsXG4gICAgICAgIHRlbmFudEVuYWJsZWRHbG9iYWxTbHVncyxcbiAgICAgICAgdGVuYW50RmllbGROYW1lLFxuICAgICAgICB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgICB9KVxuICAgIH1cblxuICAgIGlmIChmaWVsZC50eXBlID09PSAnYmxvY2tzJykge1xuICAgICAgZmllbGQuYmxvY2tzLmZvckVhY2goKGJsb2NrKSA9PiB7XG4gICAgICAgIGFkZEZpbHRlck9wdGlvbnNUb0ZpZWxkcyh7XG4gICAgICAgICAgZmllbGRzOiBibG9jay5maWVsZHMsXG4gICAgICAgICAgdGVuYW50RW5hYmxlZENvbGxlY3Rpb25TbHVncyxcbiAgICAgICAgICB0ZW5hbnRFbmFibGVkR2xvYmFsU2x1Z3MsXG4gICAgICAgICAgdGVuYW50RmllbGROYW1lLFxuICAgICAgICAgIHRlbmFudHNDb2xsZWN0aW9uU2x1ZyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgaWYgKGZpZWxkLnR5cGUgPT09ICd0YWJzJykge1xuICAgICAgZmllbGQudGFicy5mb3JFYWNoKCh0YWIpID0+IHtcbiAgICAgICAgYWRkRmlsdGVyT3B0aW9uc1RvRmllbGRzKHtcbiAgICAgICAgICBmaWVsZHM6IHRhYi5maWVsZHMsXG4gICAgICAgICAgdGVuYW50RW5hYmxlZENvbGxlY3Rpb25TbHVncyxcbiAgICAgICAgICB0ZW5hbnRFbmFibGVkR2xvYmFsU2x1Z3MsXG4gICAgICAgICAgdGVuYW50RmllbGROYW1lLFxuICAgICAgICAgIHRlbmFudHNDb2xsZWN0aW9uU2x1ZyxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfVxuICB9KVxufVxuXG50eXBlIEFkZEZpbHRlckFyZ3MgPSB7XG4gIGZpZWxkOiBSZWxhdGlvbnNoaXBGaWVsZFxuICB0ZW5hbnRFbmFibGVkQ29sbGVjdGlvblNsdWdzOiBzdHJpbmdbXVxuICB0ZW5hbnRGaWVsZE5hbWU6IHN0cmluZ1xuICB0ZW5hbnRzQ29sbGVjdGlvblNsdWc6IHN0cmluZ1xufVxuZnVuY3Rpb24gYWRkRmlsdGVyKHtcbiAgZmllbGQsXG4gIHRlbmFudEVuYWJsZWRDb2xsZWN0aW9uU2x1Z3MsXG4gIHRlbmFudEZpZWxkTmFtZSxcbiAgdGVuYW50c0NvbGxlY3Rpb25TbHVnLFxufTogQWRkRmlsdGVyQXJncykge1xuICAvLyBVc2VyIHNwZWNpZmllZCBmaWx0ZXJcbiAgY29uc3Qgb3JpZ2luYWxGaWx0ZXIgPSBmaWVsZC5maWx0ZXJPcHRpb25zXG4gIGZpZWxkLmZpbHRlck9wdGlvbnMgPSBhc3luYyAoYXJncykgPT4ge1xuICAgIGNvbnN0IG9yaWdpbmFsRmlsdGVyUmVzdWx0ID1cbiAgICAgIHR5cGVvZiBvcmlnaW5hbEZpbHRlciA9PT0gJ2Z1bmN0aW9uJyA/IGF3YWl0IG9yaWdpbmFsRmlsdGVyKGFyZ3MpIDogKG9yaWdpbmFsRmlsdGVyID8/IHRydWUpXG5cbiAgICAvLyBJZiB0aGUgcmVsYXRpb25UbyBpcyBub3QgYSB0ZW5hbnQgZW5hYmxlZCBjb2xsZWN0aW9uLCByZXR1cm4gZWFybHlcbiAgICBpZiAoYXJncy5yZWxhdGlvblRvICYmICF0ZW5hbnRFbmFibGVkQ29sbGVjdGlvblNsdWdzLmluY2x1ZGVzKGFyZ3MucmVsYXRpb25UbykpIHtcbiAgICAgIHJldHVybiBvcmlnaW5hbEZpbHRlclJlc3VsdFxuICAgIH1cblxuICAgIC8vIElmIHRoZSBvcmlnaW5hbCBmaWx0ciByZXR1cm5zIGZhbHNlLCByZXR1cm4gZWFybHlcbiAgICBpZiAob3JpZ2luYWxGaWx0ZXJSZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG5cbiAgICAvLyBDdXN0b20gdGVuYW50IGZpbHRlclxuICAgIGNvbnN0IHRlbmFudEZpbHRlclJlc3VsdHMgPSBmaWx0ZXJPcHRpb25zQnlUZW5hbnQoe1xuICAgICAgLi4uYXJncyxcbiAgICAgIHRlbmFudEZpZWxkTmFtZSxcbiAgICAgIHRlbmFudHNDb2xsZWN0aW9uU2x1ZyxcbiAgICB9KVxuXG4gICAgLy8gSWYgdGhlIHRlbmFudCBmaWx0ZXIgcmV0dXJucyB0cnVlLCBqdXN0IHVzZSB0aGUgb3JpZ2luYWwgZmlsdGVyXG4gICAgaWYgKHRlbmFudEZpbHRlclJlc3VsdHMgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBvcmlnaW5hbEZpbHRlclJlc3VsdFxuICAgIH1cblxuICAgIC8vIElmIHRoZSBvcmlnaW5hbCBmaWx0ZXIgcmV0dXJucyB0cnVlLCBqdXN0IHVzZSB0aGUgdGVuYW50IGZpbHRlclxuICAgIGlmIChvcmlnaW5hbEZpbHRlclJlc3VsdCA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIHRlbmFudEZpbHRlclJlc3VsdHNcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgYW5kOiBbb3JpZ2luYWxGaWx0ZXJSZXN1bHQsIHRlbmFudEZpbHRlclJlc3VsdHNdLFxuICAgIH1cbiAgfVxufVxuXG50eXBlIEFyZ3MgPSB7XG4gIHRlbmFudEZpZWxkTmFtZT86IHN0cmluZ1xuICB0ZW5hbnRzQ29sbGVjdGlvblNsdWc6IHN0cmluZ1xufSAmIEZpbHRlck9wdGlvbnNQcm9wc1xuY29uc3QgZmlsdGVyT3B0aW9uc0J5VGVuYW50ID0gKHtcbiAgcmVxLFxuICB0ZW5hbnRGaWVsZE5hbWUgPSAndGVuYW50JyxcbiAgdGVuYW50c0NvbGxlY3Rpb25TbHVnLFxufTogQXJncykgPT4ge1xuICBjb25zdCBpZFR5cGUgPSBnZXRDb2xsZWN0aW9uSURUeXBlKHtcbiAgICBjb2xsZWN0aW9uU2x1ZzogdGVuYW50c0NvbGxlY3Rpb25TbHVnLFxuICAgIHBheWxvYWQ6IHJlcS5wYXlsb2FkLFxuICB9KVxuICBjb25zdCBzZWxlY3RlZFRlbmFudCA9IGdldFRlbmFudEZyb21Db29raWUocmVxLmhlYWRlcnMsIGlkVHlwZSlcbiAgaWYgKCFzZWxlY3RlZFRlbmFudCkge1xuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICByZXR1cm4ge1xuICAgIG9yOiBbXG4gICAgICAvLyBpZSBhIHJlbGF0ZWQgY29sbGVjdGlvbiB0aGF0IGRvZXNuJ3QgaGF2ZSBhIHRlbmFudCBmaWVsZFxuICAgICAge1xuICAgICAgICBbdGVuYW50RmllbGROYW1lXToge1xuICAgICAgICAgIGV4aXN0czogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgLy8gcmVsYXRlZCBjb2xsZWN0aW9ucyB0aGF0IGhhdmUgYSB0ZW5hbnQgZmllbGRcbiAgICAgIHtcbiAgICAgICAgW3RlbmFudEZpZWxkTmFtZV06IHtcbiAgICAgICAgICBlcXVhbHM6IHNlbGVjdGVkVGVuYW50LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9XG59XG4iXSwibmFtZXMiOlsiZ2V0Q29sbGVjdGlvbklEVHlwZSIsImdldFRlbmFudEZyb21Db29raWUiLCJhZGRGaWx0ZXJPcHRpb25zVG9GaWVsZHMiLCJmaWVsZHMiLCJ0ZW5hbnRFbmFibGVkQ29sbGVjdGlvblNsdWdzIiwidGVuYW50RW5hYmxlZEdsb2JhbFNsdWdzIiwidGVuYW50RmllbGROYW1lIiwidGVuYW50c0NvbGxlY3Rpb25TbHVnIiwiZm9yRWFjaCIsImZpZWxkIiwidHlwZSIsInJlbGF0aW9uVG8iLCJpbmNsdWRlcyIsIkVycm9yIiwiYWRkRmlsdGVyIiwibWFwIiwiYmxvY2tzIiwiYmxvY2siLCJ0YWJzIiwidGFiIiwib3JpZ2luYWxGaWx0ZXIiLCJmaWx0ZXJPcHRpb25zIiwiYXJncyIsIm9yaWdpbmFsRmlsdGVyUmVzdWx0IiwidGVuYW50RmlsdGVyUmVzdWx0cyIsImZpbHRlck9wdGlvbnNCeVRlbmFudCIsImFuZCIsInJlcSIsImlkVHlwZSIsImNvbGxlY3Rpb25TbHVnIiwicGF5bG9hZCIsInNlbGVjdGVkVGVuYW50IiwiaGVhZGVycyIsIm9yIiwiZXhpc3RzIiwiZXF1YWxzIl0sIm1hcHBpbmdzIjoiQUFFQSxTQUFTQSxtQkFBbUIsUUFBUSx3QkFBdUI7QUFDM0QsU0FBU0MsbUJBQW1CLFFBQVEsd0JBQXVCO0FBVTNELE9BQU8sU0FBU0MseUJBQXlCLEVBQ3ZDQyxNQUFNLEVBQ05DLDRCQUE0QixFQUM1QkMsd0JBQXdCLEVBQ3hCQyxlQUFlLEVBQ2ZDLHFCQUFxQixFQUNRO0lBQzdCSixPQUFPSyxPQUFPLENBQUMsQ0FBQ0M7UUFDZCxJQUFJQSxNQUFNQyxJQUFJLEtBQUssZ0JBQWdCO1lBQ2pDOzs7T0FHQyxHQUNELElBQUksT0FBT0QsTUFBTUUsVUFBVSxLQUFLLFVBQVU7Z0JBQ3hDLElBQUlOLHlCQUF5Qk8sUUFBUSxDQUFDSCxNQUFNRSxVQUFVLEdBQUc7b0JBQ3ZELE1BQU0sSUFBSUUsTUFDUixDQUFDLGVBQWUsRUFBRUosTUFBTUUsVUFBVSxDQUFDLDZFQUE2RSxDQUFDO2dCQUVySDtnQkFDQSxJQUFJUCw2QkFBNkJRLFFBQVEsQ0FBQ0gsTUFBTUUsVUFBVSxHQUFHO29CQUMzREcsVUFBVTt3QkFBRUw7d0JBQU9MO3dCQUE4QkU7d0JBQWlCQztvQkFBc0I7Z0JBQzFGO1lBQ0YsT0FBTztnQkFDTEUsTUFBTUUsVUFBVSxDQUFDSSxHQUFHLENBQUMs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