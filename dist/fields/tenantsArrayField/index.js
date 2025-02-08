import { defaults } from "../../defaults";
export const tenantsArrayField = ({ arrayFieldAccess, rowFields, tenantFieldAccess, tenantsArrayFieldName = defaults.tenantsArrayFieldName, tenantsArrayTenantFieldName = defaults.tenantsArrayFieldName, tenantsCollectionSlug = defaults.tenantCollectionSlug })=>({
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9maWVsZHMvdGVuYW50c0FycmF5RmllbGQvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBBcnJheUZpZWxkLCBSZWxhdGlvbnNoaXBGaWVsZCB9IGZyb20gJ3BheWxvYWQnXG5cbmltcG9ydCB7IGRlZmF1bHRzIH0gZnJvbSAnLi4vLi4vZGVmYXVsdHMnXG5cbnR5cGUgQXJncyA9IHtcbiAgYXJyYXlGaWVsZEFjY2Vzcz86IEFycmF5RmllbGRbJ2FjY2VzcyddXG4gIHJvd0ZpZWxkcz86IEFycmF5RmllbGRbJ2ZpZWxkcyddXG4gIHRlbmFudEZpZWxkQWNjZXNzPzogUmVsYXRpb25zaGlwRmllbGRbJ2FjY2VzcyddXG4gIHRlbmFudHNBcnJheUZpZWxkTmFtZTogQXJyYXlGaWVsZFsnbmFtZSddXG4gIHRlbmFudHNBcnJheVRlbmFudEZpZWxkTmFtZTogUmVsYXRpb25zaGlwRmllbGRbJ25hbWUnXVxuICB0ZW5hbnRzQ29sbGVjdGlvblNsdWc6IHN0cmluZ1xufVxuZXhwb3J0IGNvbnN0IHRlbmFudHNBcnJheUZpZWxkID0gKHtcbiAgYXJyYXlGaWVsZEFjY2VzcyxcbiAgcm93RmllbGRzLFxuICB0ZW5hbnRGaWVsZEFjY2VzcyxcbiAgdGVuYW50c0FycmF5RmllbGROYW1lID0gZGVmYXVsdHMudGVuYW50c0FycmF5RmllbGROYW1lLFxuICB0ZW5hbnRzQXJyYXlUZW5hbnRGaWVsZE5hbWUgPSBkZWZhdWx0cy50ZW5hbnRzQXJyYXlGaWVsZE5hbWUsXG4gIHRlbmFudHNDb2xsZWN0aW9uU2x1ZyA9IGRlZmF1bHRzLnRlbmFudENvbGxlY3Rpb25TbHVnLFxufTogQXJncyk6IEFycmF5RmllbGQgPT4gKHtcbiAgbmFtZTogdGVuYW50c0FycmF5RmllbGROYW1lLFxuICB0eXBlOiAnYXJyYXknLFxuICBhY2Nlc3M6IGFycmF5RmllbGRBY2Nlc3MsXG4gIGZpZWxkczogW1xuICAgIHtcbiAgICAgIG5hbWU6IHRlbmFudHNBcnJheVRlbmFudEZpZWxkTmFtZSxcbiAgICAgIHR5cGU6ICdyZWxhdGlvbnNoaXAnLFxuICAgICAgYWNjZXNzOiB0ZW5hbnRGaWVsZEFjY2VzcyxcbiAgICAgIGluZGV4OiB0cnVlLFxuICAgICAgcmVsYXRpb25UbzogdGVuYW50c0NvbGxlY3Rpb25TbHVnLFxuICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICBzYXZlVG9KV1Q6IHRydWUsXG4gICAgfSxcbiAgICAuLi4ocm93RmllbGRzIHx8IFtdKSxcbiAgXSxcbiAgc2F2ZVRvSldUOiB0cnVlLFxufSlcbiJdLCJuYW1lcyI6WyJkZWZhdWx0cyIsInRlbmFudHNBcnJheUZpZWxkIiwiYXJyYXlGaWVsZEFjY2VzcyIsInJvd0ZpZWxkcyIsInRlbmFudEZpZWxkQWNjZXNzIiwidGVuYW50c0FycmF5RmllbGROYW1lIiwidGVuYW50c0FycmF5VGVuYW50RmllbGROYW1lIiwidGVuYW50c0NvbGxlY3Rpb25TbHVnIiwidGVuYW50Q29sbGVjdGlvblNsdWciLCJuYW1lIiwidHlwZSIsImFjY2VzcyIsImZpZWxkcyIsImluZGV4IiwicmVsYXRpb25UbyIsInJlcXVpcmVkIiwic2F2ZVRvSldUIl0sIm1hcHBpbmdzIjoiQUFFQSxTQUFTQSxRQUFRLFFBQVEsaUJBQWdCO0FBVXpDLE9BQU8sTUFBTUMsb0JBQW9CLENBQUMsRUFDaENDLGdCQUFnQixFQUNoQkMsU0FBUyxFQUNUQyxpQkFBaUIsRUFDakJDLHdCQUF3QkwsU0FBU0sscUJBQXFCLEVBQ3REQyw4QkFBOEJOLFNBQVNLLHFCQUFxQixFQUM1REUsd0JBQXdCUCxTQUFTUSxvQkFBb0IsRUFDaEQsR0FBa0IsQ0FBQTtRQUN2QkMsTUFBTUo7UUFDTkssTUFBTTtRQUNOQyxRQUFRVDtRQUNSVSxRQUFRO1lBQ047Z0JBQ0VILE1BQU1IO2dCQUNOSSxNQUFNO2dCQUNOQyxRQUFRUDtnQkFDUlMsT0FBTztnQkFDUEMsWUFBWVA7Z0JBQ1pRLFVBQVU7Z0JBQ1ZDLFdBQVc7WUFDYjtlQUNJYixhQUFhLEVBQUU7U0FDcEI7UUFDRGEsV0FBVztJQUNiLENBQUEsRUFBRSJ9