import { getTenantListFilter } from "./getTenantListFilter";
/**
 * Combines a base list filter with a tenant list filter
 *
 * Combines where constraints inside of an AND operator
 */ export const withTenantListFilter = ({ baseListFilter, tenantFieldName, tenantsCollectionSlug })=>async (args)=>{
        const filterConstraints = [];
        if (typeof baseListFilter === 'function') {
            const baseListFilterResult = await baseListFilter(args);
            if (baseListFilterResult) {
                filterConstraints.push(baseListFilterResult);
            }
        }
        const tenantListFilter = getTenantListFilter({
            req: args.req,
            tenantFieldName,
            tenantsCollectionSlug
        });
        if (tenantListFilter) {
            filterConstraints.push(tenantListFilter);
        }
        if (filterConstraints.length) {
            const combinedWhere = {
                and: []
            };
            filterConstraints.forEach((constraint)=>{
                if (combinedWhere.and && constraint && typeof constraint === 'object') {
                    combinedWhere.and.push(constraint);
                }
            });
            return combinedWhere;
        }
        // Access control will take it from here
        return null;
    };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsaXRpZXMvd2l0aFRlbmFudExpc3RGaWx0ZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBCYXNlTGlzdEZpbHRlciwgV2hlcmUgfSBmcm9tICdwYXlsb2FkJ1xuXG5pbXBvcnQgeyBnZXRUZW5hbnRMaXN0RmlsdGVyIH0gZnJvbSAnLi9nZXRUZW5hbnRMaXN0RmlsdGVyJ1xuXG50eXBlIEFyZ3MgPSB7XG4gIGJhc2VMaXN0RmlsdGVyPzogQmFzZUxpc3RGaWx0ZXJcbiAgdGVuYW50RmllbGROYW1lOiBzdHJpbmdcbiAgdGVuYW50c0NvbGxlY3Rpb25TbHVnOiBzdHJpbmdcbn1cbi8qKlxuICogQ29tYmluZXMgYSBiYXNlIGxpc3QgZmlsdGVyIHdpdGggYSB0ZW5hbnQgbGlzdCBmaWx0ZXJcbiAqXG4gKiBDb21iaW5lcyB3aGVyZSBjb25zdHJhaW50cyBpbnNpZGUgb2YgYW4gQU5EIG9wZXJhdG9yXG4gKi9cbmV4cG9ydCBjb25zdCB3aXRoVGVuYW50TGlzdEZpbHRlciA9XG4gICh7IGJhc2VMaXN0RmlsdGVyLCB0ZW5hbnRGaWVsZE5hbWUsIHRlbmFudHNDb2xsZWN0aW9uU2x1ZyB9OiBBcmdzKTogQmFzZUxpc3RGaWx0ZXIgPT5cbiAgYXN5bmMgKGFyZ3MpID0+IHtcbiAgICBjb25zdCBmaWx0ZXJDb25zdHJhaW50cyA9IFtdXG5cbiAgICBpZiAodHlwZW9mIGJhc2VMaXN0RmlsdGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBiYXNlTGlzdEZpbHRlclJlc3VsdCA9IGF3YWl0IGJhc2VMaXN0RmlsdGVyKGFyZ3MpXG5cbiAgICAgIGlmIChiYXNlTGlzdEZpbHRlclJlc3VsdCkge1xuICAgICAgICBmaWx0ZXJDb25zdHJhaW50cy5wdXNoKGJhc2VMaXN0RmlsdGVyUmVzdWx0KVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHRlbmFudExpc3RGaWx0ZXIgPSBnZXRUZW5hbnRMaXN0RmlsdGVyKHtcbiAgICAgIHJlcTogYXJncy5yZXEsXG4gICAgICB0ZW5hbnRGaWVsZE5hbWUsXG4gICAgICB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgfSlcblxuICAgIGlmICh0ZW5hbnRMaXN0RmlsdGVyKSB7XG4gICAgICBmaWx0ZXJDb25zdHJhaW50cy5wdXNoKHRlbmFudExpc3RGaWx0ZXIpXG4gICAgfVxuXG4gICAgaWYgKGZpbHRlckNvbnN0cmFpbnRzLmxlbmd0aCkge1xuICAgICAgY29uc3QgY29tYmluZWRXaGVyZTogV2hlcmUgPSB7IGFuZDogW10gfVxuICAgICAgZmlsdGVyQ29uc3RyYWludHMuZm9yRWFjaCgoY29uc3RyYWludCkgPT4ge1xuICAgICAgICBpZiAoY29tYmluZWRXaGVyZS5hbmQgJiYgY29uc3RyYWludCAmJiB0eXBlb2YgY29uc3RyYWludCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICBjb21iaW5lZFdoZXJlLmFuZC5wdXNoKGNvbnN0cmFpbnQpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZXR1cm4gY29tYmluZWRXaGVyZVxuICAgIH1cblxuICAgIC8vIEFjY2VzcyBjb250cm9sIHdpbGwgdGFrZSBpdCBmcm9tIGhlcmVcbiAgICByZXR1cm4gbnVsbFxuICB9XG4iXSwibmFtZXMiOlsiZ2V0VGVuYW50TGlzdEZpbHRlciIsIndpdGhUZW5hbnRMaXN0RmlsdGVyIiwiYmFzZUxpc3RGaWx0ZXIiLCJ0ZW5hbnRGaWVsZE5hbWUiLCJ0ZW5hbnRzQ29sbGVjdGlvblNsdWciLCJhcmdzIiwiZmlsdGVyQ29uc3RyYWludHMiLCJiYXNlTGlzdEZpbHRlclJlc3VsdCIsInB1c2giLCJ0ZW5hbnRMaXN0RmlsdGVyIiwicmVxIiwibGVuZ3RoIiwiY29tYmluZWRXaGVyZSIsImFuZCIsImZvckVhY2giLCJjb25zdHJhaW50Il0sIm1hcHBpbmdzIjoiQUFFQSxTQUFTQSxtQkFBbUIsUUFBUSx3QkFBdUI7QUFPM0Q7Ozs7Q0FJQyxHQUNELE9BQU8sTUFBTUMsdUJBQ1gsQ0FBQyxFQUFFQyxjQUFjLEVBQUVDLGVBQWUsRUFBRUMscUJBQXFCLEVBQVEsR0FDakUsT0FBT0M7UUFDTCxNQUFNQyxvQkFBb0IsRUFBRTtRQUU1QixJQUFJLE9BQU9KLG1CQUFtQixZQUFZO1lBQ3hDLE1BQU1LLHVCQUF1QixNQUFNTCxlQUFlRztZQUVsRCxJQUFJRSxzQkFBc0I7Z0JBQ3hCRCxrQkFBa0JFLElBQUksQ0FBQ0Q7WUFDekI7UUFDRjtRQUVBLE1BQU1FLG1CQUFtQlQsb0JBQW9CO1lBQzNDVSxLQUFLTCxLQUFLSyxHQUFHO1lBQ2JQO1lBQ0FDO1FBQ0Y7UUFFQSxJQUFJSyxrQkFBa0I7WUFDcEJILGtCQUFrQkUsSUFBSSxDQUFDQztRQUN6QjtRQUVBLElBQUlILGtCQUFrQkssTUFBTSxFQUFFO1lBQzVCLE1BQU1DLGdCQUF1QjtnQkFBRUMsS0FBSyxFQUFFO1lBQUM7WUFDdkNQLGtCQUFrQlEsT0FBTyxDQUFDLENBQUNDO2dCQUN6QixJQUFJSCxjQUFjQyxHQUFHLElBQUlFLGNBQWMsT0FBT0EsZUFBZSxVQUFVO29CQUNyRUgsY0FBY0MsR0FBRyxDQUFDTCxJQUFJLENBQUNPO2dCQUN6QjtZQUNGO1lBQ0EsT0FBT0g7UUFDVDtRQUVBLHdDQUF3QztRQUN4QyxPQUFPO0lBQ1QsRUFBQyJ9