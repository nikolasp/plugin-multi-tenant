import { APIError } from "payload";
import { defaults } from "../../defaults";
import { getCollectionIDType } from "../../utilities/getCollectionIDType";
import { getTenantFromCookie } from "../../utilities/getTenantFromCookie";
export const tenantField = ({ name = defaults.tenantFieldName, access = undefined, debug, tenantsCollectionSlug = defaults.tenantCollectionSlug, unique })=>({
        name,
        type: 'relationship',
        access,
        admin: {
            allowCreate: false,
            allowEdit: false,
            components: {
                Field: {
                    clientProps: {
                        debug,
                        unique
                    },
                    path: '@payloadcms/plugin-multi-tenant/client#TenantField'
                }
            },
            disableListColumn: true,
            disableListFilter: true
        },
        hasMany: false,
        hooks: {
            beforeChange: [
                ({ req, value })=>{
                    const idType = getCollectionIDType({
                        collectionSlug: tenantsCollectionSlug,
                        payload: req.payload
                    });
                    if (!value) {
                        const tenantFromCookie = getTenantFromCookie(req.headers, idType);
                        if (tenantFromCookie) {
                            return tenantFromCookie;
                        }
                        throw new APIError('You must select a tenant', 400, null, true);
                    }
                    return idType === 'number' ? parseFloat(value) : value;
                }
            ]
        },
        index: true,
        label: 'Assigned Tenant',
        relationTo: tenantsCollectionSlug,
        unique
    });

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9maWVsZHMvdGVuYW50RmllbGQvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdHlwZSBSZWxhdGlvbnNoaXBGaWVsZCB9IGZyb20gJ3BheWxvYWQnXG5pbXBvcnQgeyBBUElFcnJvciB9IGZyb20gJ3BheWxvYWQnXG5cbmltcG9ydCB7IGRlZmF1bHRzIH0gZnJvbSAnLi4vLi4vZGVmYXVsdHMnXG5pbXBvcnQgeyBnZXRDb2xsZWN0aW9uSURUeXBlIH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL2dldENvbGxlY3Rpb25JRFR5cGUnXG5pbXBvcnQgeyBnZXRUZW5hbnRGcm9tQ29va2llIH0gZnJvbSAnLi4vLi4vdXRpbGl0aWVzL2dldFRlbmFudEZyb21Db29raWUnXG5cbnR5cGUgQXJncyA9IHtcbiAgYWNjZXNzPzogUmVsYXRpb25zaGlwRmllbGRbJ2FjY2VzcyddXG4gIGRlYnVnPzogYm9vbGVhblxuICBuYW1lOiBzdHJpbmdcbiAgdGVuYW50c0NvbGxlY3Rpb25TbHVnOiBzdHJpbmdcbiAgdW5pcXVlOiBib29sZWFuXG59XG5leHBvcnQgY29uc3QgdGVuYW50RmllbGQgPSAoe1xuICBuYW1lID0gZGVmYXVsdHMudGVuYW50RmllbGROYW1lLFxuICBhY2Nlc3MgPSB1bmRlZmluZWQsXG4gIGRlYnVnLFxuICB0ZW5hbnRzQ29sbGVjdGlvblNsdWcgPSBkZWZhdWx0cy50ZW5hbnRDb2xsZWN0aW9uU2x1ZyxcbiAgdW5pcXVlLFxufTogQXJncyk6IFJlbGF0aW9uc2hpcEZpZWxkID0+ICh7XG4gIG5hbWUsXG4gIHR5cGU6ICdyZWxhdGlvbnNoaXAnLFxuICBhY2Nlc3MsXG4gIGFkbWluOiB7XG4gICAgYWxsb3dDcmVhdGU6IGZhbHNlLFxuICAgIGFsbG93RWRpdDogZmFsc2UsXG4gICAgY29tcG9uZW50czoge1xuICAgICAgRmllbGQ6IHtcbiAgICAgICAgY2xpZW50UHJvcHM6IHtcbiAgICAgICAgICBkZWJ1ZyxcbiAgICAgICAgICB1bmlxdWUsXG4gICAgICAgIH0sXG4gICAgICAgIHBhdGg6ICdAcGF5bG9hZGNtcy9wbHVnaW4tbXVsdGktdGVuYW50L2NsaWVudCNUZW5hbnRGaWVsZCcsXG4gICAgICB9LFxuICAgIH0sXG4gICAgZGlzYWJsZUxpc3RDb2x1bW46IHRydWUsXG4gICAgZGlzYWJsZUxpc3RGaWx0ZXI6IHRydWUsXG4gIH0sXG4gIGhhc01hbnk6IGZhbHNlLFxuICBob29rczoge1xuICAgIGJlZm9yZUNoYW5nZTogW1xuICAgICAgKHsgcmVxLCB2YWx1ZSB9KSA9PiB7XG4gICAgICAgIGNvbnN0IGlkVHlwZSA9IGdldENvbGxlY3Rpb25JRFR5cGUoe1xuICAgICAgICAgIGNvbGxlY3Rpb25TbHVnOiB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgICAgICAgcGF5bG9hZDogcmVxLnBheWxvYWQsXG4gICAgICAgIH0pXG4gICAgICAgIGlmICghdmFsdWUpIHtcbiAgICAgICAgICBjb25zdCB0ZW5hbnRGcm9tQ29va2llID0gZ2V0VGVuYW50RnJvbUNvb2tpZShyZXEuaGVhZGVycywgaWRUeXBlKVxuICAgICAgICAgIGlmICh0ZW5hbnRGcm9tQ29va2llKSB7XG4gICAgICAgICAgICByZXR1cm4gdGVuYW50RnJvbUNvb2tpZVxuICAgICAgICAgIH1cbiAgICAgICAgICB0aHJvdyBuZXcgQVBJRXJyb3IoJ1lvdSBtdXN0IHNlbGVjdCBhIHRlbmFudCcsIDQwMCwgbnVsbCwgdHJ1ZSlcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpZFR5cGUgPT09ICdudW1iZXInID8gcGFyc2VGbG9hdCh2YWx1ZSkgOiB2YWx1ZVxuICAgICAgfSxcbiAgICBdLFxuICB9LFxuICBpbmRleDogdHJ1ZSxcbiAgbGFiZWw6ICdBc3NpZ25lZCBUZW5hbnQnLFxuICByZWxhdGlvblRvOiB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gIHVuaXF1ZSxcbn0pXG4iXSwibmFtZXMiOlsiQVBJRXJyb3IiLCJkZWZhdWx0cyIsImdldENvbGxlY3Rpb25JRFR5cGUiLCJnZXRUZW5hbnRGcm9tQ29va2llIiwidGVuYW50RmllbGQiLCJuYW1lIiwidGVuYW50RmllbGROYW1lIiwiYWNjZXNzIiwidW5kZWZpbmVkIiwiZGVidWciLCJ0ZW5hbnRzQ29sbGVjdGlvblNsdWciLCJ0ZW5hbnRDb2xsZWN0aW9uU2x1ZyIsInVuaXF1ZSIsInR5cGUiLCJhZG1pbiIsImFsbG93Q3JlYXRlIiwiYWxsb3dFZGl0IiwiY29tcG9uZW50cyIsIkZpZWxkIiwiY2xpZW50UHJvcHMiLCJwYXRoIiwiZGlzYWJsZUxpc3RDb2x1bW4iLCJkaXNhYmxlTGlzdEZpbHRlciIsImhhc01hbnkiLCJob29rcyIsImJlZm9yZUNoYW5nZSIsInJlcSIsInZhbHVlIiwiaWRUeXBlIiwiY29sbGVjdGlvblNsdWciLCJwYXlsb2FkIiwidGVuYW50RnJvbUNvb2tpZSIsImhlYWRlcnMiLCJwYXJzZUZsb2F0IiwiaW5kZXgiLCJsYWJlbCIsInJlbGF0aW9uVG8iXSwibWFwcGluZ3MiOiJBQUNBLFNBQVNBLFFBQVEsUUFBUSxVQUFTO0FBRWxDLFNBQVNDLFFBQVEsUUFBUSxpQkFBZ0I7QUFDekMsU0FBU0MsbUJBQW1CLFFBQVEsc0NBQXFDO0FBQ3pFLFNBQVNDLG1CQUFtQixRQUFRLHNDQUFxQztBQVN6RSxPQUFPLE1BQU1DLGNBQWMsQ0FBQyxFQUMxQkMsT0FBT0osU0FBU0ssZUFBZSxFQUMvQkMsU0FBU0MsU0FBUyxFQUNsQkMsS0FBSyxFQUNMQyx3QkFBd0JULFNBQVNVLG9CQUFvQixFQUNyREMsTUFBTSxFQUNELEdBQXlCLENBQUE7UUFDOUJQO1FBQ0FRLE1BQU07UUFDTk47UUFDQU8sT0FBTztZQUNMQyxhQUFhO1lBQ2JDLFdBQVc7WUFDWEMsWUFBWTtnQkFDVkMsT0FBTztvQkFDTEMsYUFBYTt3QkFDWFY7d0JBQ0FHO29CQUNGO29CQUNBUSxNQUFNO2dCQUNSO1lBQ0Y7WUFDQUMsbUJBQW1CO1lBQ25CQyxtQkFBbUI7UUFDckI7UUFDQUMsU0FBUztRQUNUQyxPQUFPO1lBQ0xDLGNBQWM7Z0JBQ1osQ0FBQyxFQUFFQyxHQUFHLEVBQUVDLEtBQUssRUFBRTtvQkFDYixNQUFNQyxTQUFTMUIsb0JBQW9CO3dCQUNqQzJCLGdCQUFnQm5CO3dCQUNoQm9CLFNBQVNKLElBQUlJLE9BQU87b0JBQ3RCO29CQUNBLElBQUksQ0FBQ0gsT0FBTzt3QkFDVixNQUFNSSxtQkFBbUI1QixvQkFBb0J1QixJQUFJTSxPQUFPLEVBQUVKO3dCQUMxRCxJQUFJRyxrQkFBa0I7NEJBQ3BCLE9BQU9BO3dCQUNUO3dCQUNBLE1BQU0sSUFBSS9CLFNBQVMsNEJBQTRCLEtBQUssTUFBTTtvQkFDNUQ7b0JBRUEsT0FBTzRCLFdBQVcsV0FBV0ssV0FBV04sU0FBU0E7Z0JBQ25EO2FBQ0Q7UUFDSDtRQUNBTyxPQUFPO1FBQ1BDLE9BQU87UUFDUEMsWUFBWTFCO1FBQ1pFO0lBQ0YsQ0FBQSxFQUFFIn0=