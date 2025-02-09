import { generateCookie, mergeHeaders } from "payload";
import { getCollectionIDType } from "../utilities/getCollectionIDType";
import { getTenantFromCookie } from "../utilities/getTenantFromCookie";
/**
 * Add cleanup logic when tenant is deleted
 * - delete documents related to tenant
 * - remove tenant from users
 */ export const addTenantCleanup = ({ collection, enabledSlugs, tenantFieldName, tenantsCollectionSlug, usersSlug, usersTenantsArrayFieldName, usersTenantsArrayTenantFieldName })=>{
    if (!collection.hooks) {
        collection.hooks = {};
    }
    if (!collection.hooks?.afterDelete) {
        collection.hooks.afterDelete = [];
    }
    collection.hooks.afterDelete.push(afterTenantDelete({
        enabledSlugs,
        tenantFieldName,
        tenantsCollectionSlug,
        usersSlug,
        usersTenantsArrayFieldName,
        usersTenantsArrayTenantFieldName
    }));
};
export const afterTenantDelete = ({ enabledSlugs, tenantFieldName, tenantsCollectionSlug, usersSlug, usersTenantsArrayFieldName, usersTenantsArrayTenantFieldName })=>async ({ id, req })=>{
        const idType = getCollectionIDType({
            collectionSlug: tenantsCollectionSlug,
            payload: req.payload
        });
        const currentTenantCookieID = getTenantFromCookie(req.headers, idType);
        if (currentTenantCookieID === id) {
            const newHeaders = new Headers({
                'Set-Cookie': generateCookie({
                    name: 'payload-tenant',
                    expires: new Date(Date.now() - 1000),
                    path: '/',
                    returnCookieAsObject: false,
                    value: ''
                })
            });
            req.responseHeaders = req.responseHeaders ? mergeHeaders(req.responseHeaders, newHeaders) : newHeaders;
        }
        const cleanupPromises = [];
        enabledSlugs.forEach((slug)=>{
            cleanupPromises.push(req.payload.delete({
                collection: slug,
                where: {
                    [tenantFieldName]: {
                        equals: id
                    }
                }
            }));
        });
        try {
            const usersWithTenant = await req.payload.find({
                collection: usersSlug,
                depth: 0,
                limit: 0,
                where: {
                    [`${usersTenantsArrayFieldName}.${usersTenantsArrayTenantFieldName}`]: {
                        equals: id
                    }
                }
            });
            usersWithTenant?.docs?.forEach((user)=>{
                cleanupPromises.push(req.payload.update({
                    id: user.id,
                    collection: usersSlug,
                    data: {
                        skole: (user.skole || []).filter((tenantID)=>tenantID !== id)
                    }
                }));
            });
        } catch (e) {
            console.error('Error deleting tenants from users:', e);
        }
        await Promise.all(cleanupPromises);
    };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ob29rcy9hZnRlclRlbmFudERlbGV0ZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7XG4gIENvbGxlY3Rpb25BZnRlckRlbGV0ZUhvb2ssXG4gIENvbGxlY3Rpb25Db25maWcsXG4gIEpzb25PYmplY3QsXG4gIFBhZ2luYXRlZERvY3MsXG59IGZyb20gJ3BheWxvYWQnXG5cbmltcG9ydCB7IGdlbmVyYXRlQ29va2llLCBtZXJnZUhlYWRlcnMgfSBmcm9tICdwYXlsb2FkJ1xuXG5pbXBvcnQgdHlwZSB7IFVzZXJXaXRoVGVuYW50c0ZpZWxkIH0gZnJvbSAnLi4vdHlwZXMnXG5cbmltcG9ydCB7IGdldENvbGxlY3Rpb25JRFR5cGUgfSBmcm9tICcuLi91dGlsaXRpZXMvZ2V0Q29sbGVjdGlvbklEVHlwZSdcbmltcG9ydCB7IGdldFRlbmFudEZyb21Db29raWUgfSBmcm9tICcuLi91dGlsaXRpZXMvZ2V0VGVuYW50RnJvbUNvb2tpZSdcblxudHlwZSBBcmdzID0ge1xuICBjb2xsZWN0aW9uOiBDb2xsZWN0aW9uQ29uZmlnXG4gIGVuYWJsZWRTbHVnczogc3RyaW5nW11cbiAgdGVuYW50RmllbGROYW1lOiBzdHJpbmdcbiAgdGVuYW50c0NvbGxlY3Rpb25TbHVnOiBzdHJpbmdcbiAgdXNlcnNTbHVnOiBzdHJpbmdcbiAgdXNlcnNUZW5hbnRzQXJyYXlGaWVsZE5hbWU6IHN0cmluZ1xuICB1c2Vyc1RlbmFudHNBcnJheVRlbmFudEZpZWxkTmFtZTogc3RyaW5nXG59XG4vKipcbiAqIEFkZCBjbGVhbnVwIGxvZ2ljIHdoZW4gdGVuYW50IGlzIGRlbGV0ZWRcbiAqIC0gZGVsZXRlIGRvY3VtZW50cyByZWxhdGVkIHRvIHRlbmFudFxuICogLSByZW1vdmUgdGVuYW50IGZyb20gdXNlcnNcbiAqL1xuZXhwb3J0IGNvbnN0IGFkZFRlbmFudENsZWFudXAgPSAoe1xuICBjb2xsZWN0aW9uLFxuICBlbmFibGVkU2x1Z3MsXG4gIHRlbmFudEZpZWxkTmFtZSxcbiAgdGVuYW50c0NvbGxlY3Rpb25TbHVnLFxuICB1c2Vyc1NsdWcsXG4gIHVzZXJzVGVuYW50c0FycmF5RmllbGROYW1lLFxuICB1c2Vyc1RlbmFudHNBcnJheVRlbmFudEZpZWxkTmFtZSxcbn06IEFyZ3MpID0+IHtcbiAgaWYgKCFjb2xsZWN0aW9uLmhvb2tzKSB7XG4gICAgY29sbGVjdGlvbi5ob29rcyA9IHt9XG4gIH1cbiAgaWYgKCFjb2xsZWN0aW9uLmhvb2tzPy5hZnRlckRlbGV0ZSkge1xuICAgIGNvbGxlY3Rpb24uaG9va3MuYWZ0ZXJEZWxldGUgPSBbXVxuICB9XG4gIGNvbGxlY3Rpb24uaG9va3MuYWZ0ZXJEZWxldGUucHVzaChcbiAgICBhZnRlclRlbmFudERlbGV0ZSh7XG4gICAgICBlbmFibGVkU2x1Z3MsXG4gICAgICB0ZW5hbnRGaWVsZE5hbWUsXG4gICAgICB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgICB1c2Vyc1NsdWcsXG4gICAgICB1c2Vyc1RlbmFudHNBcnJheUZpZWxkTmFtZSxcbiAgICAgIHVzZXJzVGVuYW50c0FycmF5VGVuYW50RmllbGROYW1lLFxuICAgIH0pLFxuICApXG59XG5cbmV4cG9ydCBjb25zdCBhZnRlclRlbmFudERlbGV0ZSA9XG4gICh7XG4gICAgZW5hYmxlZFNsdWdzLFxuICAgIHRlbmFudEZpZWxkTmFtZSxcbiAgICB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgdXNlcnNTbHVnLFxuICAgIHVzZXJzVGVuYW50c0FycmF5RmllbGROYW1lLFxuICAgIHVzZXJzVGVuYW50c0FycmF5VGVuYW50RmllbGROYW1lLFxuICB9OiBPbWl0PEFyZ3MsICdjb2xsZWN0aW9uJz4pOiBDb2xsZWN0aW9uQWZ0ZXJEZWxldGVIb29rID0+XG4gIGFzeW5jICh7IGlkLCByZXEgfSkgPT4ge1xuICAgIGNvbnN0IGlkVHlwZSA9IGdldENvbGxlY3Rpb25JRFR5cGUoe1xuICAgICAgY29sbGVjdGlvblNsdWc6IHRlbmFudHNDb2xsZWN0aW9uU2x1ZyxcbiAgICAgIHBheWxvYWQ6IHJlcS5wYXlsb2FkLFxuICAgIH0pXG4gICAgY29uc3QgY3VycmVudFRlbmFudENvb2tpZUlEID0gZ2V0VGVuYW50RnJvbUNvb2tpZShyZXEuaGVhZGVycywgaWRUeXBlKVxuICAgIGlmIChjdXJyZW50VGVuYW50Q29va2llSUQgPT09IGlkKSB7XG4gICAgICBjb25zdCBuZXdIZWFkZXJzID0gbmV3IEhlYWRlcnMoe1xuICAgICAgICAnU2V0LUNvb2tpZSc6IGdlbmVyYXRlQ29va2llPHN0cmluZz4oe1xuICAgICAgICAgIG5hbWU6ICdwYXlsb2FkLXRlbmFudCcsXG4gICAgICAgICAgZXhwaXJlczogbmV3IERhdGUoRGF0ZS5ub3coKSAtIDEwMDApLFxuICAgICAgICAgIHBhdGg6ICcvJyxcbiAgICAgICAgICByZXR1cm5Db29raWVBc09iamVjdDogZmFsc2UsXG4gICAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICB9KSxcbiAgICAgIH0pXG5cbiAgICAgIHJlcS5yZXNwb25zZUhlYWRlcnMgPSByZXEucmVzcG9uc2VIZWFkZXJzXG4gICAgICAgID8gbWVyZ2VIZWFkZXJzKHJlcS5yZXNwb25zZUhlYWRlcnMsIG5ld0hlYWRlcnMpXG4gICAgICAgIDogbmV3SGVhZGVyc1xuICAgIH1cbiAgICBjb25zdCBjbGVhbnVwUHJvbWlzZXM6IFByb21pc2U8SnNvbk9iamVjdD5bXSA9IFtdXG4gICAgZW5hYmxlZFNsdWdzLmZvckVhY2goKHNsdWcpID0+IHtcbiAgICAgIGNsZWFudXBQcm9taXNlcy5wdXNoKFxuICAgICAgICByZXEucGF5bG9hZC5kZWxldGUoe1xuICAgICAgICAgIGNvbGxlY3Rpb246IHNsdWcsXG4gICAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICAgIFt0ZW5hbnRGaWVsZE5hbWVdOiB7XG4gICAgICAgICAgICAgIGVxdWFsczogaWQsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH0pXG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgdXNlcnNXaXRoVGVuYW50ID0gKGF3YWl0IHJlcS5wYXlsb2FkLmZpbmQoe1xuICAgICAgICBjb2xsZWN0aW9uOiB1c2Vyc1NsdWcsXG4gICAgICAgIGRlcHRoOiAwLFxuICAgICAgICBsaW1pdDogMCxcbiAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICBbYCR7dXNlcnNUZW5hbnRzQXJyYXlGaWVsZE5hbWV9LiR7dXNlcnNUZW5hbnRzQXJyYXlUZW5hbnRGaWVsZE5hbWV9YF06IHtcbiAgICAgICAgICAgIGVxdWFsczogaWQsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICAgIH0pKSBhcyBQYWdpbmF0ZWREb2NzPFVzZXJXaXRoVGVuYW50c0ZpZWxkPlxuXG4gICAgICB1c2Vyc1dpdGhUZW5hbnQ/LmRvY3M/LmZvckVhY2goKHVzZXIpID0+IHtcbiAgICAgICAgY2xlYW51cFByb21pc2VzLnB1c2goXG4gICAgICAgICAgcmVxLnBheWxvYWQudXBkYXRlKHtcbiAgICAgICAgICAgIGlkOiB1c2VyLmlkLFxuICAgICAgICAgICAgY29sbGVjdGlvbjogdXNlcnNTbHVnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICBza29sZTogKHVzZXIuc2tvbGUgfHwgW10pLmZpbHRlcigodGVuYW50SUQpID0+IHRlbmFudElEICE9PSBpZCksXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0pLFxuICAgICAgICApXG4gICAgICB9KVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGRlbGV0aW5nIHRlbmFudHMgZnJvbSB1c2VyczonLCBlKVxuICAgIH1cblxuICAgIGF3YWl0IFByb21pc2UuYWxsKGNsZWFudXBQcm9taXNlcylcbiAgfVxuIl0sIm5hbWVzIjpbImdlbmVyYXRlQ29va2llIiwibWVyZ2VIZWFkZXJzIiwiZ2V0Q29sbGVjdGlvbklEVHlwZSIsImdldFRlbmFudEZyb21Db29raWUiLCJhZGRUZW5hbnRDbGVhbnVwIiwiY29sbGVjdGlvbiIsImVuYWJsZWRTbHVncyIsInRlbmFudEZpZWxkTmFtZSIsInRlbmFudHNDb2xsZWN0aW9uU2x1ZyIsInVzZXJzU2x1ZyIsInVzZXJzVGVuYW50c0FycmF5RmllbGROYW1lIiwidXNlcnNUZW5hbnRzQXJyYXlUZW5hbnRGaWVsZE5hbWUiLCJob29rcyIsImFmdGVyRGVsZXRlIiwicHVzaCIsImFmdGVyVGVuYW50RGVsZXRlIiwiaWQiLCJyZXEiLCJpZFR5cGUiLCJjb2xsZWN0aW9uU2x1ZyIsInBheWxvYWQiLCJjdXJyZW50VGVuYW50Q29va2llSUQiLCJoZWFkZXJzIiwibmV3SGVhZGVycyIsIkhlYWRlcnMiLCJuYW1lIiwiZXhwaXJlcyIsIkRhdGUiLCJub3ciLCJwYXRoIiwicmV0dXJuQ29va2llQXNPYmplY3QiLCJ2YWx1ZSIsInJlc3BvbnNlSGVhZGVycyIsImNsZWFudXBQcm9taXNlcyIsImZvckVhY2giLCJzbHVnIiwiZGVsZXRlIiwid2hlcmUiLCJlcXVhbHMiLCJ1c2Vyc1dpdGhUZW5hbnQiLCJmaW5kIiwiZGVwdGgiLCJsaW1pdCIsImRvY3MiLCJ1c2VyIiwidXBkYXRlIiwiZGF0YSIsInNrb2xlIiwiZmlsdGVyIiwidGVuYW50SUQiLCJlIiwiY29uc29sZSIsImVycm9yIiwiUHJvbWlzZSIsImFsbCJdLCJtYXBwaW5ncyI6IkFBT0EsU0FBU0EsY0FBYyxFQUFFQyxZQUFZLFFBQVEsVUFBUztBQUl0RCxTQUFTQyxtQkFBbUIsUUFBUSxtQ0FBa0M7QUFDdEUsU0FBU0MsbUJBQW1CLFFBQVEsbUNBQWtDO0FBV3RFOzs7O0NBSUMsR0FDRCxPQUFPLE1BQU1DLG1CQUFtQixDQUFDLEVBQy9CQyxVQUFVLEVBQ1ZDLFlBQVksRUFDWkMsZUFBZSxFQUNmQyxxQkFBcUIsRUFDckJDLFNBQVMsRUFDVEMsMEJBQTBCLEVBQzFCQyxnQ0FBZ0MsRUFDM0I7SUFDTCxJQUFJLENBQUNOLFdBQVdPLEtBQUssRUFBRTtRQUNyQlAsV0FBV08sS0FBSyxHQUFHLENBQUM7SUFDdEI7SUFDQSxJQUFJLENBQUNQLFdBQVdPLEtBQUssRUFBRUMsYUFBYTtRQUNsQ1IsV0FBV08sS0FBSyxDQUFDQyxXQUFXLEdBQUcsRUFBRTtJQUNuQztJQUNBUixXQUFXTyxLQUFLLENBQUNDLFdBQVcsQ0FBQ0MsSUFBSSxDQUMvQkMsa0JBQWtCO1FBQ2hCVDtRQUNBQztRQUNBQztRQUNBQztRQUNBQztRQUNBQztJQUNGO0FBRUosRUFBQztBQUVELE9BQU8sTUFBTUksb0JBQ1gsQ0FBQyxFQUNDVCxZQUFZLEVBQ1pDLGVBQWUsRUFDZkMscUJBQXFCLEVBQ3JCQyxTQUFTLEVBQ1RDLDBCQUEwQixFQUMxQkMsZ0NBQWdDLEVBQ1AsR0FDM0IsT0FBTyxFQUFFSyxFQUFFLEVBQUVDLEdBQUcsRUFBRTtRQUNoQixNQUFNQyxTQUFTaEIsb0JBQW9CO1lBQ2pDaUIsZ0JBQWdCWDtZQUNoQlksU0FBU0gsSUFBSUcsT0FBTztRQUN0QjtRQUNBLE1BQU1DLHdCQUF3QmxCLG9CQUFvQmMsSUFBSUssT0FBTyxFQUFFSjtRQUMvRCxJQUFJRywwQkFBMEJMLElBQUk7WUFDaEMsTUFBTU8sYUFBYSxJQUFJQyxRQUFRO2dCQUM3QixjQUFjeEIsZUFBdUI7b0JBQ25DeUIsTUFBTTtvQkFDTkMsU0FBUyxJQUFJQyxLQUFLQSxLQUFLQyxHQUFHLEtBQUs7b0JBQy9CQyxNQUFNO29CQUNOQyxzQkFBc0I7b0JBQ3RCQyxPQUFPO2dCQUNUO1lBQ0Y7WUFFQWQsSUFBSWUsZUFBZSxHQUFHZixJQUFJZSxlQUFlLEdBQ3JDL0IsYUFBYWdCLElBQUllLGVBQWUsRUFBRVQsY0FDbENBO1FBQ047UUFDQSxNQUFNVSxrQkFBeUMsRUFBRTtRQUNqRDNCLGFBQWE0QixPQUFPLENBQUMsQ0FBQ0M7WUFDcEJGLGdCQUFnQm5CLElBQUksQ0FDbEJHLElBQUlHLE9BQU8sQ0FBQ2dCLE1BQU0sQ0FBQztnQkFDakIvQixZQUFZOEI7Z0JBQ1pFLE9BQU87b0JBQ0wsQ0FBQzlCLGdCQUFnQixFQUFFO3dCQUNqQitCLFFBQVF0QjtvQkFDVjtnQkFDRjtZQUNGO1FBRUo7UUFFQSxJQUFJO1lBQ0YsTUFBTXVCLGtCQUFtQixNQUFNdEIsSUFBSUcsT0FBTyxDQUFDb0IsSUFBSSxDQUFDO2dCQUM5Q25DLFlBQVlJO2dCQUNaZ0MsT0FBTztnQkFDUEMsT0FBTztnQkFDUEwsT0FBTztvQkFDTCxDQUFDLEdBQUczQiwyQkFBMkIsQ0FBQyxFQUFFQyxrQ0FBa0MsQ0FBQyxFQUFFO3dCQUNyRTJCLFFBQVF0QjtvQkFDVjtnQkFDRjtZQUNGO1lBRUF1QixpQkFBaUJJLE1BQU1ULFFBQVEsQ0FBQ1U7Z0JBQzlCWCxnQkFBZ0JuQixJQUFJLENBQ2xCRyxJQUFJRyxPQUFPLENBQUN5QixNQUFNLENBQUM7b0JBQ2pCN0IsSUFBSTRCLEtBQUs1QixFQUFFO29CQUNYWCxZQUFZSTtvQkFDWnFDLE1BQU07d0JBQ0pDLE9BQU8sQUFBQ0gsQ0FBQUEsS0FBS0csS0FBSyxJQUFJLEVBQUUsQUFBRCxFQUFHQyxNQUFNLENBQUMsQ0FBQ0MsV0FBYUEsYUFBYWpDO29CQUM5RDtnQkFDRjtZQUVKO1FBQ0YsRUFBRSxPQUFPa0MsR0FBRztZQUNWQyxRQUFRQyxLQUFLLENBQUMsc0NBQXNDRjtRQUN0RDtRQUVBLE1BQU1HLFFBQVFDLEdBQUcsQ0FBQ3JCO0lBQ3BCLEVBQUMifQ==