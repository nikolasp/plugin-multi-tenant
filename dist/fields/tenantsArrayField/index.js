import { defaults } from "../../defaults";
export const tenantsArrayField = ({ arrayFieldAccess, rowFields, tenantFieldAccess, tenantsArrayFieldName = defaults.tenantsArrayFieldName, tenantsArrayTenantFieldName = defaults.tenantsArrayTenantFieldName, tenantsCollectionSlug = defaults.tenantCollectionSlug })=>({
        name: tenantsArrayFieldName,
        type: 'array',
        access: arrayFieldAccess,
        fields: [
            {
                name: tenantsArrayTenantFieldName,
                type: 'relationship',
                access: tenantFieldAccess,
                index: true,
                relationTo: tenantsCollectionSlug,
                required: true,
                saveToJWT: true
            },
            ...rowFields || []
        ],
        saveToJWT: true
    });

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9maWVsZHMvdGVuYW50c0FycmF5RmllbGQvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBcnJheUZpZWxkLCBSZWxhdGlvbnNoaXBGaWVsZCB9IGZyb20gJ3BheWxvYWQnXG5cbmltcG9ydCB7IGRlZmF1bHRzIH0gZnJvbSAnLi4vLi4vZGVmYXVsdHMnXG5cbnR5cGUgQXJncyA9IHtcbiAgLyoqXG4gICAqIEFjY2VzcyBjb25maWd1cmF0aW9uIGZvciB0aGUgYXJyYXkgZmllbGRcbiAgICovXG4gIGFycmF5RmllbGRBY2Nlc3M/OiBBcnJheUZpZWxkWydhY2Nlc3MnXVxuICAvKipcbiAgICogQWRkaXRpb25hbCBmaWVsZHMgdG8gaW5jbHVkZSBvbiB0aGUgdGVuYW50IGFycmF5IHJvd3NcbiAgICovXG4gIHJvd0ZpZWxkcz86IEFycmF5RmllbGRbJ2ZpZWxkcyddXG4gIC8qKlxuICAgKiBBY2Nlc3MgY29uZmlndXJhdGlvbiBmb3IgdGhlIHRlbmFudCBmaWVsZFxuICAgKi9cbiAgdGVuYW50RmllbGRBY2Nlc3M/OiBSZWxhdGlvbnNoaXBGaWVsZFsnYWNjZXNzJ11cbiAgLyoqXG4gICAqIFRoZSBuYW1lIG9mIHRoZSBhcnJheSBmaWVsZCB0aGF0IGhvbGRzIHRoZSB0ZW5hbnRzXG4gICAqXG4gICAqIEBkZWZhdWx0ICd0ZW5hbnRzJ1xuICAgKi9cbiAgdGVuYW50c0FycmF5RmllbGROYW1lPzogQXJyYXlGaWVsZFsnbmFtZSddXG4gIC8qKlxuICAgKiBUaGUgbmFtZSBvZiB0aGUgZmllbGQgdGhhdCB3aWxsIGJlIHVzZWQgdG8gc3RvcmUgdGhlIHRlbmFudCByZWxhdGlvbnNoaXAgaW4gdGhlIGFycmF5XG4gICAqXG4gICAqIEBkZWZhdWx0ICd0ZW5hbnQnXG4gICAqL1xuICB0ZW5hbnRzQXJyYXlUZW5hbnRGaWVsZE5hbWU/OiBSZWxhdGlvbnNoaXBGaWVsZFsnbmFtZSddXG4gIC8qKlxuICAgKiBUaGUgc2x1ZyBmb3IgdGhlIHRlbmFudCBjb2xsZWN0aW9uXG4gICAqXG4gICAqIEBkZWZhdWx0ICd0ZW5hbnRzJ1xuICAgKi9cbiAgdGVuYW50c0NvbGxlY3Rpb25TbHVnPzogc3RyaW5nXG59XG5leHBvcnQgY29uc3QgdGVuYW50c0FycmF5RmllbGQgPSAoe1xuICBhcnJheUZpZWxkQWNjZXNzLFxuICByb3dGaWVsZHMsXG4gIHRlbmFudEZpZWxkQWNjZXNzLFxuICB0ZW5hbnRzQXJyYXlGaWVsZE5hbWUgPSBkZWZhdWx0cy50ZW5hbnRzQXJyYXlGaWVsZE5hbWUsXG4gIHRlbmFudHNBcnJheVRlbmFudEZpZWxkTmFtZSA9IGRlZmF1bHRzLnRlbmFudHNBcnJheVRlbmFudEZpZWxkTmFtZSxcbiAgdGVuYW50c0NvbGxlY3Rpb25TbHVnID0gZGVmYXVsdHMudGVuYW50Q29sbGVjdGlvblNsdWcsXG59OiBBcmdzKTogQXJyYXlGaWVsZCA9PiAoe1xuICBuYW1lOiB0ZW5hbnRzQXJyYXlGaWVsZE5hbWUsXG4gIHR5cGU6ICdhcnJheScsXG4gIGFjY2VzczogYXJyYXlGaWVsZEFjY2VzcyxcbiAgZmllbGRzOiBbXG4gICAge1xuICAgICAgbmFtZTogdGVuYW50c0FycmF5VGVuYW50RmllbGROYW1lLFxuICAgICAgdHlwZTogJ3JlbGF0aW9uc2hpcCcsXG4gICAgICBhY2Nlc3M6IHRlbmFudEZpZWxkQWNjZXNzLFxuICAgICAgaW5kZXg6IHRydWUsXG4gICAgICByZWxhdGlvblRvOiB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgICByZXF1aXJlZDogdHJ1ZSxcbiAgICAgIHNhdmVUb0pXVDogdHJ1ZSxcbiAgICB9LFxuICAgIC4uLihyb3dGaWVsZHMgfHwgW10pLFxuICBdLFxuICBzYXZlVG9KV1Q6IHRydWUsXG59KVxuIl0sIm5hbWVzIjpbImRlZmF1bHRzIiwidGVuYW50c0FycmF5RmllbGQiLCJhcnJheUZpZWxkQWNjZXNzIiwicm93RmllbGRzIiwidGVuYW50RmllbGRBY2Nlc3MiLCJ0ZW5hbnRzQXJyYXlGaWVsZE5hbWUiLCJ0ZW5hbnRzQXJyYXlUZW5hbnRGaWVsZE5hbWUiLCJ0ZW5hbnRzQ29sbGVjdGlvblNsdWciLCJ0ZW5hbnRDb2xsZWN0aW9uU2x1ZyIsIm5hbWUiLCJ0eXBlIiwiYWNjZXNzIiwiZmllbGRzIiwiaW5kZXgiLCJyZWxhdGlvblRvIiwicmVxdWlyZWQiLCJzYXZlVG9KV1QiXSwibWFwcGluZ3MiOiJBQUVBLFNBQVNBLFFBQVEsUUFBUSxpQkFBZ0I7QUFrQ3pDLE9BQU8sTUFBTUMsb0JBQW9CLENBQUMsRUFDaENDLGdCQUFnQixFQUNoQkMsU0FBUyxFQUNUQyxpQkFBaUIsRUFDakJDLHdCQUF3QkwsU0FBU0sscUJBQXFCLEVBQ3REQyw4QkFBOEJOLFNBQVNNLDJCQUEyQixFQUNsRUMsd0JBQXdCUCxTQUFTUSxvQkFBb0IsRUFDaEQsR0FBa0IsQ0FBQTtRQUN2QkMsTUFBTUo7UUFDTkssTUFBTTtRQUNOQyxRQUFRVDtRQUNSVSxRQUFRO1lBQ047Z0JBQ0VILE1BQU1IO2dCQUNOSSxNQUFNO2dCQUNOQyxRQUFRUDtnQkFDUlMsT0FBTztnQkFDUEMsWUFBWVA7Z0JBQ1pRLFVBQVU7Z0JBQ1ZDLFdBQVc7WUFDYjtlQUNJYixhQUFhLEVBQUU7U0FDcEI7UUFDRGEsV0FBVztJQUNiLENBQUEsRUFBRSJ9