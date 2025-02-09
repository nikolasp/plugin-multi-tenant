import { getUserTenantIDs } from "../utilities/getUserTenantIDs";
export const findTenantOptions = async ({ limit, payload, tenantsCollectionSlug, useAsTitle, user })=>{
    const additionalConditions = user?.role.includes("superAdmin") ? {} : {
        where: {
            id: {
                in: user && getUserTenantIDs(user) || []
            }
        }
    };
    return payload.find({
        collection: tenantsCollectionSlug,
        depth: 0,
        limit,
        overrideAccess: false,
        select: {
            [useAsTitle]: true
        },
        sort: useAsTitle,
        user,
        ...additionalConditions
    });
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9xdWVyaWVzL2ZpbmRUZW5hbnRPcHRpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFVzZXJXaXRoVGVuYW50c0ZpZWxkIH0gZnJvbSBcIkAvdHlwZXNcIjtcbmltcG9ydCB7IGdldFVzZXJUZW5hbnRJRHMgfSBmcm9tIFwiLi8uLi91dGlsaXRpZXMvZ2V0VXNlclRlbmFudElEc1wiO1xuaW1wb3J0IHR5cGUgeyBQYWdpbmF0ZWREb2NzLCBQYXlsb2FkIH0gZnJvbSBcInBheWxvYWRcIjtcblxudHlwZSBBcmdzID0ge1xuICBsaW1pdDogbnVtYmVyO1xuICBwYXlsb2FkOiBQYXlsb2FkO1xuICB0ZW5hbnRzQ29sbGVjdGlvblNsdWc6IHN0cmluZztcbiAgdXNlQXNUaXRsZTogc3RyaW5nO1xuICB1c2VyPzogVXNlcldpdGhUZW5hbnRzRmllbGQ7XG59O1xuZXhwb3J0IGNvbnN0IGZpbmRUZW5hbnRPcHRpb25zID0gYXN5bmMgKHtcbiAgbGltaXQsXG4gIHBheWxvYWQsXG4gIHRlbmFudHNDb2xsZWN0aW9uU2x1ZyxcbiAgdXNlQXNUaXRsZSxcbiAgdXNlcixcbn06IEFyZ3MpOiBQcm9taXNlPFBhZ2luYXRlZERvY3M+ID0+IHtcbiAgY29uc3QgYWRkaXRpb25hbENvbmRpdGlvbnMgPSB1c2VyPy5yb2xlLmluY2x1ZGVzKFwic3VwZXJBZG1pblwiKVxuICAgID8ge31cbiAgICA6IHtcbiAgICAgICAgd2hlcmU6IHtcbiAgICAgICAgICBpZDoge1xuICAgICAgICAgICAgaW46ICh1c2VyICYmIGdldFVzZXJUZW5hbnRJRHModXNlcikpIHx8IFtdLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9O1xuICByZXR1cm4gcGF5bG9hZC5maW5kKHtcbiAgICBjb2xsZWN0aW9uOiB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgZGVwdGg6IDAsXG4gICAgbGltaXQsXG4gICAgb3ZlcnJpZGVBY2Nlc3M6IGZhbHNlLFxuICAgIHNlbGVjdDoge1xuICAgICAgW3VzZUFzVGl0bGVdOiB0cnVlLFxuICAgIH0sXG4gICAgc29ydDogdXNlQXNUaXRsZSxcbiAgICB1c2VyLFxuICAgIC4uLmFkZGl0aW9uYWxDb25kaXRpb25zLFxuICB9KTtcbn07XG4iXSwibmFtZXMiOlsiZ2V0VXNlclRlbmFudElEcyIsImZpbmRUZW5hbnRPcHRpb25zIiwibGltaXQiLCJwYXlsb2FkIiwidGVuYW50c0NvbGxlY3Rpb25TbHVnIiwidXNlQXNUaXRsZSIsInVzZXIiLCJhZGRpdGlvbmFsQ29uZGl0aW9ucyIsInJvbGUiLCJpbmNsdWRlcyIsIndoZXJlIiwiaWQiLCJpbiIsImZpbmQiLCJjb2xsZWN0aW9uIiwiZGVwdGgiLCJvdmVycmlkZUFjY2VzcyIsInNlbGVjdCIsInNvcnQiXSwibWFwcGluZ3MiOiJBQUNBLFNBQVNBLGdCQUFnQixRQUFRLGdDQUFrQztBQVVuRSxPQUFPLE1BQU1DLG9CQUFvQixPQUFPLEVBQ3RDQyxLQUFLLEVBQ0xDLE9BQU8sRUFDUEMscUJBQXFCLEVBQ3JCQyxVQUFVLEVBQ1ZDLElBQUksRUFDQztJQUNMLE1BQU1DLHVCQUF1QkQsTUFBTUUsS0FBS0MsU0FBUyxnQkFDN0MsQ0FBQyxJQUNEO1FBQ0VDLE9BQU87WUFDTEMsSUFBSTtnQkFDRkMsSUFBSSxBQUFDTixRQUFRTixpQkFBaUJNLFNBQVUsRUFBRTtZQUM1QztRQUNGO0lBQ0Y7SUFDSixPQUFPSCxRQUFRVSxJQUFJLENBQUM7UUFDbEJDLFlBQVlWO1FBQ1pXLE9BQU87UUFDUGI7UUFDQWMsZ0JBQWdCO1FBQ2hCQyxRQUFRO1lBQ04sQ0FBQ1osV0FBVyxFQUFFO1FBQ2hCO1FBQ0FhLE1BQU1iO1FBQ05DO1FBQ0EsR0FBR0Msb0JBQW9CO0lBQ3pCO0FBQ0YsRUFBRSJ9