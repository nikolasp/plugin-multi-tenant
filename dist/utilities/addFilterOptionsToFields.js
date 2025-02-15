import { getCollectionIDType } from "./getCollectionIDType";
import { getTenantFromCookie } from "./getTenantFromCookie";
export function addFilterOptionsToFields({ config, fields, tenantEnabledCollectionSlugs, tenantEnabledGlobalSlugs, tenantFieldName, tenantsCollectionSlug }) {
    fields.forEach((field)=>{
        if (field.type === "relationship") {
            /**
       * Adjusts relationship fields to filter by tenant
       * and ensures relationTo cannot be a tenant global collection
       */ if (typeof field.relationTo === "string") {
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
        if (field.type === "row" || field.type === "array" || field.type === "collapsible" || field.type === "group") {
            addFilterOptionsToFields({
                config,
                fields: field.fields,
                tenantEnabledCollectionSlugs,
                tenantEnabledGlobalSlugs,
                tenantFieldName,
                tenantsCollectionSlug
            });
        }
        if (field.type === "blocks") {
            (field.blockReferences ?? field.blocks).forEach((_block)=>{
                const block = typeof _block === "string" ? config?.blocks?.find((b)=>b.slug === _block) : _block;
                if (block?.fields) {
                    addFilterOptionsToFields({
                        config,
                        fields: block.fields,
                        tenantEnabledCollectionSlugs,
                        tenantEnabledGlobalSlugs,
                        tenantFieldName,
                        tenantsCollectionSlug
                    });
                }
            });
        }
        if (field.type === "tabs") {
            field.tabs.forEach((tab)=>{
                addFilterOptionsToFields({
                    config,
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
        const originalFilterResult = typeof originalFilter === "function" ? await originalFilter(args) : originalFilter ?? true;
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
const filterOptionsByTenant = ({ req, tenantFieldName = "tenant", tenantsCollectionSlug })=>{
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsaXRpZXMvYWRkRmlsdGVyT3B0aW9uc1RvRmllbGRzLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHtcbiAgQmxvY2tzRmllbGQsXG4gIENvbmZpZyxcbiAgRmllbGQsXG4gIEZpbHRlck9wdGlvbnNQcm9wcyxcbiAgUmVsYXRpb25zaGlwRmllbGQsXG4gIFNhbml0aXplZENvbmZpZyxcbn0gZnJvbSBcInBheWxvYWRcIjtcblxuaW1wb3J0IHsgZ2V0Q29sbGVjdGlvbklEVHlwZSB9IGZyb20gXCIuL2dldENvbGxlY3Rpb25JRFR5cGVcIjtcbmltcG9ydCB7IGdldFRlbmFudEZyb21Db29raWUgfSBmcm9tIFwiLi9nZXRUZW5hbnRGcm9tQ29va2llXCI7XG5cbnR5cGUgQWRkRmlsdGVyT3B0aW9uc1RvRmllbGRzQXJncyA9IHtcbiAgY29uZmlnOiAoQ29uZmlnIHwgU2FuaXRpemVkQ29uZmlnKSAmIHtcbiAgICBibG9ja3M/OiB7IHNsdWc6IHN0cmluZzsgZmllbGRzOiBGaWVsZFtdOyBba2V5OiBzdHJpbmddOiB1bmtub3duIH1bXTtcbiAgfTtcbiAgZmllbGRzOiBGaWVsZFtdO1xuICB0ZW5hbnRFbmFibGVkQ29sbGVjdGlvblNsdWdzOiBzdHJpbmdbXTtcbiAgdGVuYW50RW5hYmxlZEdsb2JhbFNsdWdzOiBzdHJpbmdbXTtcbiAgdGVuYW50RmllbGROYW1lOiBzdHJpbmc7XG4gIHRlbmFudHNDb2xsZWN0aW9uU2x1Zzogc3RyaW5nO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEZpbHRlck9wdGlvbnNUb0ZpZWxkcyh7XG4gIGNvbmZpZyxcbiAgZmllbGRzLFxuICB0ZW5hbnRFbmFibGVkQ29sbGVjdGlvblNsdWdzLFxuICB0ZW5hbnRFbmFibGVkR2xvYmFsU2x1Z3MsXG4gIHRlbmFudEZpZWxkTmFtZSxcbiAgdGVuYW50c0NvbGxlY3Rpb25TbHVnLFxufTogQWRkRmlsdGVyT3B0aW9uc1RvRmllbGRzQXJncykge1xuICBmaWVsZHMuZm9yRWFjaCgoZmllbGQpID0+IHtcbiAgICBpZiAoZmllbGQudHlwZSA9PT0gXCJyZWxhdGlvbnNoaXBcIikge1xuICAgICAgLyoqXG4gICAgICAgKiBBZGp1c3RzIHJlbGF0aW9uc2hpcCBmaWVsZHMgdG8gZmlsdGVyIGJ5IHRlbmFudFxuICAgICAgICogYW5kIGVuc3VyZXMgcmVsYXRpb25UbyBjYW5ub3QgYmUgYSB0ZW5hbnQgZ2xvYmFsIGNvbGxlY3Rpb25cbiAgICAgICAqL1xuICAgICAgaWYgKHR5cGVvZiBmaWVsZC5yZWxhdGlvblRvID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGlmICh0ZW5hbnRFbmFibGVkR2xvYmFsU2x1Z3MuaW5jbHVkZXMoZmllbGQucmVsYXRpb25UbykpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICBgVGhlIGNvbGxlY3Rpb24gJHtmaWVsZC5yZWxhdGlvblRvfSBpcyBhIGdsb2JhbCBjb2xsZWN0aW9uIGFuZCBjYW5ub3QgYmUgcmVsYXRlZCB0byBhIHRlbmFudCBlbmFibGVkIGNvbGxlY3Rpb24uYFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRlbmFudEVuYWJsZWRDb2xsZWN0aW9uU2x1Z3MuaW5jbHVkZXMoZmllbGQucmVsYXRpb25UbykpIHtcbiAgICAgICAgICBhZGRGaWx0ZXIoe1xuICAgICAgICAgICAgZmllbGQsXG4gICAgICAgICAgICB0ZW5hbnRFbmFibGVkQ29sbGVjdGlvblNsdWdzLFxuICAgICAgICAgICAgdGVuYW50RmllbGROYW1lLFxuICAgICAgICAgICAgdGVuYW50c0NvbGxlY3Rpb25TbHVnLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmaWVsZC5yZWxhdGlvblRvLm1hcCgocmVsYXRpb25UbykgPT4ge1xuICAgICAgICAgIGlmICh0ZW5hbnRFbmFibGVkR2xvYmFsU2x1Z3MuaW5jbHVkZXMocmVsYXRpb25UbykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgYFRoZSBjb2xsZWN0aW9uICR7cmVsYXRpb25Ub30gaXMgYSBnbG9iYWwgY29sbGVjdGlvbiBhbmQgY2Fubm90IGJlIHJlbGF0ZWQgdG8gYSB0ZW5hbnQgZW5hYmxlZCBjb2xsZWN0aW9uLmBcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0ZW5hbnRFbmFibGVkQ29sbGVjdGlvblNsdWdzLmluY2x1ZGVzKHJlbGF0aW9uVG8pKSB7XG4gICAgICAgICAgICBhZGRGaWx0ZXIoe1xuICAgICAgICAgICAgICBmaWVsZCxcbiAgICAgICAgICAgICAgdGVuYW50RW5hYmxlZENvbGxlY3Rpb25TbHVncyxcbiAgICAgICAgICAgICAgdGVuYW50RmllbGROYW1lLFxuICAgICAgICAgICAgICB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChcbiAgICAgIGZpZWxkLnR5cGUgPT09IFwicm93XCIgfHxcbiAgICAgIGZpZWxkLnR5cGUgPT09IFwiYXJyYXlcIiB8fFxuICAgICAgZmllbGQudHlwZSA9PT0gXCJjb2xsYXBzaWJsZVwiIHx8XG4gICAgICBmaWVsZC50eXBlID09PSBcImdyb3VwXCJcbiAgICApIHtcbiAgICAgIGFkZEZpbHRlck9wdGlvbnNUb0ZpZWxkcyh7XG4gICAgICAgIGNvbmZpZyxcbiAgICAgICAgZmllbGRzOiBmaWVsZC5maWVsZHMsXG4gICAgICAgIHRlbmFudEVuYWJsZWRDb2xsZWN0aW9uU2x1Z3MsXG4gICAgICAgIHRlbmFudEVuYWJsZWRHbG9iYWxTbHVncyxcbiAgICAgICAgdGVuYW50RmllbGROYW1lLFxuICAgICAgICB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoZmllbGQudHlwZSA9PT0gXCJibG9ja3NcIikge1xuICAgICAgKFxuICAgICAgICAoZmllbGQgYXMgQmxvY2tzRmllbGQgJiB7IGJsb2NrUmVmZXJlbmNlczogc3RyaW5nW10gfSlcbiAgICAgICAgICAuYmxvY2tSZWZlcmVuY2VzID8/IGZpZWxkLmJsb2Nrc1xuICAgICAgKS5mb3JFYWNoKChfYmxvY2spID0+IHtcbiAgICAgICAgY29uc3QgYmxvY2sgPVxuICAgICAgICAgIHR5cGVvZiBfYmxvY2sgPT09IFwic3RyaW5nXCJcbiAgICAgICAgICAgID8gLy8gVE9ETzogaXRlcmF0ZSBvdmVyIGJsb2NrcyBtYXBwZWQgdG8gYmxvY2sgc2x1ZyBpbiB2NCwgb3IgcGFzcyB0aHJvdWdoIHBheWxvYWQuYmxvY2tzXG4gICAgICAgICAgICAgIGNvbmZpZz8uYmxvY2tzPy5maW5kKChiKSA9PiBiLnNsdWcgPT09IF9ibG9jaylcbiAgICAgICAgICAgIDogX2Jsb2NrO1xuXG4gICAgICAgIGlmIChibG9jaz8uZmllbGRzKSB7XG4gICAgICAgICAgYWRkRmlsdGVyT3B0aW9uc1RvRmllbGRzKHtcbiAgICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICAgIGZpZWxkczogYmxvY2suZmllbGRzLFxuICAgICAgICAgICAgdGVuYW50RW5hYmxlZENvbGxlY3Rpb25TbHVncyxcbiAgICAgICAgICAgIHRlbmFudEVuYWJsZWRHbG9iYWxTbHVncyxcbiAgICAgICAgICAgIHRlbmFudEZpZWxkTmFtZSxcbiAgICAgICAgICAgIHRlbmFudHNDb2xsZWN0aW9uU2x1ZyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGZpZWxkLnR5cGUgPT09IFwidGFic1wiKSB7XG4gICAgICBmaWVsZC50YWJzLmZvckVhY2goKHRhYikgPT4ge1xuICAgICAgICBhZGRGaWx0ZXJPcHRpb25zVG9GaWVsZHMoe1xuICAgICAgICAgIGNvbmZpZyxcbiAgICAgICAgICBmaWVsZHM6IHRhYi5maWVsZHMsXG4gICAgICAgICAgdGVuYW50RW5hYmxlZENvbGxlY3Rpb25TbHVncyxcbiAgICAgICAgICB0ZW5hbnRFbmFibGVkR2xvYmFsU2x1Z3MsXG4gICAgICAgICAgdGVuYW50RmllbGROYW1lLFxuICAgICAgICAgIHRlbmFudHNDb2xsZWN0aW9uU2x1ZyxcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xufVxuXG50eXBlIEFkZEZpbHRlckFyZ3MgPSB7XG4gIGZpZWxkOiBSZWxhdGlvbnNoaXBGaWVsZDtcbiAgdGVuYW50RW5hYmxlZENvbGxlY3Rpb25TbHVnczogc3RyaW5nW107XG4gIHRlbmFudEZpZWxkTmFtZTogc3RyaW5nO1xuICB0ZW5hbnRzQ29sbGVjdGlvblNsdWc6IHN0cmluZztcbn07XG5mdW5jdGlvbiBhZGRGaWx0ZXIoe1xuICBmaWVsZCxcbiAgdGVuYW50RW5hYmxlZENvbGxlY3Rpb25TbHVncyxcbiAgdGVuYW50RmllbGROYW1lLFxuICB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG59OiBBZGRGaWx0ZXJBcmdzKSB7XG4gIC8vIFVzZXIgc3BlY2lmaWVkIGZpbHRlclxuICBjb25zdCBvcmlnaW5hbEZpbHRlciA9IGZpZWxkLmZpbHRlck9wdGlvbnM7XG4gIGZpZWxkLmZpbHRlck9wdGlvbnMgPSBhc3luYyAoYXJncykgPT4ge1xuICAgIGNvbnN0IG9yaWdpbmFsRmlsdGVyUmVzdWx0ID1cbiAgICAgIHR5cGVvZiBvcmlnaW5hbEZpbHRlciA9PT0gXCJmdW5jdGlvblwiXG4gICAgICAgID8gYXdhaXQgb3JpZ2luYWxGaWx0ZXIoYXJncylcbiAgICAgICAgOiAob3JpZ2luYWxGaWx0ZXIgPz8gdHJ1ZSk7XG5cbiAgICAvLyBJZiB0aGUgcmVsYXRpb25UbyBpcyBub3QgYSB0ZW5hbnQgZW5hYmxlZCBjb2xsZWN0aW9uLCByZXR1cm4gZWFybHlcbiAgICBpZiAoXG4gICAgICBhcmdzLnJlbGF0aW9uVG8gJiZcbiAgICAgICF0ZW5hbnRFbmFibGVkQ29sbGVjdGlvblNsdWdzLmluY2x1ZGVzKGFyZ3MucmVsYXRpb25UbylcbiAgICApIHtcbiAgICAgIHJldHVybiBvcmlnaW5hbEZpbHRlclJlc3VsdDtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgb3JpZ2luYWwgZmlsdHIgcmV0dXJucyBmYWxzZSwgcmV0dXJuIGVhcmx5XG4gICAgaWYgKG9yaWdpbmFsRmlsdGVyUmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIEN1c3RvbSB0ZW5hbnQgZmlsdGVyXG4gICAgY29uc3QgdGVuYW50RmlsdGVyUmVzdWx0cyA9IGZpbHRlck9wdGlvbnNCeVRlbmFudCh7XG4gICAgICAuLi5hcmdzLFxuICAgICAgdGVuYW50RmllbGROYW1lLFxuICAgICAgdGVuYW50c0NvbGxlY3Rpb25TbHVnLFxuICAgIH0pO1xuXG4gICAgLy8gSWYgdGhlIHRlbmFudCBmaWx0ZXIgcmV0dXJucyB0cnVlLCBqdXN0IHVzZSB0aGUgb3JpZ2luYWwgZmlsdGVyXG4gICAgaWYgKHRlbmFudEZpbHRlclJlc3VsdHMgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBvcmlnaW5hbEZpbHRlclJlc3VsdDtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgb3JpZ2luYWwgZmlsdGVyIHJldHVybnMgdHJ1ZSwganVzdCB1c2UgdGhlIHRlbmFudCBmaWx0ZXJcbiAgICBpZiAob3JpZ2luYWxGaWx0ZXJSZXN1bHQgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiB0ZW5hbnRGaWx0ZXJSZXN1bHRzO1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBhbmQ6IFtvcmlnaW5hbEZpbHRlclJlc3VsdCwgdGVuYW50RmlsdGVyUmVzdWx0c10sXG4gICAgfTtcbiAgfTtcbn1cblxudHlwZSBBcmdzID0ge1xuICB0ZW5hbnRGaWVsZE5hbWU/OiBzdHJpbmc7XG4gIHRlbmFudHNDb2xsZWN0aW9uU2x1Zzogc3RyaW5nO1xufSAmIEZpbHRlck9wdGlvbnNQcm9wcztcbmNvbnN0IGZpbHRlck9wdGlvbnNCeVRlbmFudCA9ICh7XG4gIHJlcSxcbiAgdGVuYW50RmllbGROYW1lID0gXCJ0ZW5hbnRcIixcbiAgdGVuYW50c0NvbGxlY3Rpb25TbHVnLFxufTogQXJncykgPT4ge1xuICBjb25zdCBpZFR5cGUgPSBnZXRDb2xsZWN0aW9uSURUeXBlKHtcbiAgICBjb2xsZWN0aW9uU2x1ZzogdGVuYW50c0NvbGxlY3Rpb25TbHVnLFxuICAgIHBheWxvYWQ6IHJlcS5wYXlsb2FkLFxuICB9KTtcbiAgY29uc3Qgc2VsZWN0ZWRUZW5hbnQgPSBnZXRUZW5hbnRGcm9tQ29va2llKHJlcS5oZWFkZXJzLCBpZFR5cGUpO1xuICBpZiAoIXNlbGVjdGVkVGVuYW50KSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG9yOiBbXG4gICAgICAvLyBpZSBhIHJlbGF0ZWQgY29sbGVjdGlvbiB0aGF0IGRvZXNuJ3QgaGF2ZSBhIHRlbmFudCBmaWVsZFxuICAgICAge1xuICAgICAgICBbdGVuYW50RmllbGROYW1lXToge1xuICAgICAgICAgIGV4aXN0czogZmFsc2UsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgLy8gcmVsYXRlZCBjb2xsZWN0aW9ucyB0aGF0IGhhdmUgYSB0ZW5hbnQgZmllbGRcbiAgICAgIHtcbiAgICAgICAgW3RlbmFudEZpZWxkTmFtZV06IHtcbiAgICAgICAgICBlcXVhbHM6IHNlbGVjdGVkVGVuYW50LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9O1xufTtcbiJdLCJuYW1lcyI6WyJnZXRDb2xsZWN0aW9uSURUeXBlIiwiZ2V0VGVuYW50RnJvbUNvb2tpZSIsImFkZEZpbHRlck9wdGlvbnNUb0ZpZWxkcyIsImNvbmZpZyIsImZpZWxkcyIsInRlbmFudEVuYWJsZWRDb2xsZWN0aW9uU2x1Z3MiLCJ0ZW5hbnRFbmFibGVkR2xvYmFsU2x1Z3MiLCJ0ZW5hbnRGaWVsZE5hbWUiLCJ0ZW5hbnRzQ29sbGVjdGlvblNsdWciLCJmb3JFYWNoIiwiZmllbGQiLCJ0eXBlIiwicmVsYXRpb25UbyIsImluY2x1ZGVzIiwiRXJyb3IiLCJhZGRGaWx0ZXIiLCJtYXAiLCJibG9ja1JlZmVyZW5jZXMiLCJibG9ja3MiLCJfYmxvY2siLCJibG9jayIsImZpbmQiLCJiIiwic2x1ZyIsInRhYnMiLCJ0YWIiLCJvcmlnaW5hbEZpbHRlciIsImZpbHRlck9wdGlvbnMiLCJhcmdzIiwib3JpZ2luYWxGaWx0ZXJSZXN1bHQiLCJ0ZW5hbnRGaWx0ZXJSZXN1bHRzIiwiZmlsdGVyT3B0aW9uc0J5VGVuYW50IiwiYW5kIiwicmVxIiwiaWRUeXBlIiwiY29sbGVjdGlvblNsdWciLCJwYXlsb2FkIiwic2VsZWN0ZWRUZW5hbnQiLCJoZWFkZXJzIiwib3IiLCJleGlzdHMiLCJlcXVhbHMiXSwibWFwcGluZ3MiOiJBQVNBLFNBQVNBLG1CQUFtQixRQUFRLHdCQUF3QjtBQUM1RCxTQUFTQyxtQkFBbUIsUUFBUSx3QkFBd0I7QUFhNUQsT0FBTyxTQUFTQyx5QkFBeUIsRUFDdkNDLE1BQU0sRUFDTkMsTUFBTSxFQUNOQyw0QkFBNEIsRUFDNUJDLHdCQUF3QixFQUN4QkMsZUFBZSxFQUNmQyxxQkFBcUIsRUFDUTtJQUM3QkosT0FBT0ssT0FBTyxDQUFDLENBQUNDO1FBQ2QsSUFBSUEsTUFBTUMsSUFBSSxLQUFLLGdCQUFnQjtZQUNqQzs7O09BR0MsR0FDRCxJQUFJLE9BQU9ELE1BQU1FLFVBQVUsS0FBSyxVQUFVO2dCQUN4QyxJQUFJTix5QkFBeUJPLFFBQVEsQ0FBQ0gsTUFBTUUsVUFBVSxHQUFHO29CQUN2RCxNQUFNLElBQUlFLE1BQ1IsQ0FBQyxlQUFlLEVBQUVKLE1BQU1FLFVBQVUsQ0FBQyw2RUFBNkUsQ0FBQztnQkFFckg7Z0JBQ0EsSUFBSVAsNkJBQTZCUSxRQUFRLENBQUNILE1BQU1FLFVBQVUsR0FBRztvQkFDM0RHLFVBQVU7d0JBQ1JMO3dCQUNBTDt3QkFDQUU7d0JBQ0FDO29CQUNGO2dCQUNGO1lBQ0YsT0FBTztnQkFDTEUsTUFBTUUsVUFBVSxDQUFDSSxHQUFHLENBQUMsQ0FBQ0o7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