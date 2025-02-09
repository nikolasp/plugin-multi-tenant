import { extractID } from "./extractID";
/**
 * Returns array of all tenant IDs assigned to a user
 *
 * @param user - User object with tenants field
 */ export const getUserTenantIDs = (user)=>{
    if (!user) {
        return [];
    }
    return user?.skole?.reduce((acc, tenant)=>{
        if (tenant) {
            acc.push(extractID(tenant));
        }
        return acc;
    }, []) || [];
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsaXRpZXMvZ2V0VXNlclRlbmFudElEcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFRlbmFudCwgVXNlcldpdGhUZW5hbnRzRmllbGQgfSBmcm9tICcuLi90eXBlcydcblxuaW1wb3J0IHsgZXh0cmFjdElEIH0gZnJvbSAnLi9leHRyYWN0SUQnXG5cbi8qKlxuICogUmV0dXJucyBhcnJheSBvZiBhbGwgdGVuYW50IElEcyBhc3NpZ25lZCB0byBhIHVzZXJcbiAqXG4gKiBAcGFyYW0gdXNlciAtIFVzZXIgb2JqZWN0IHdpdGggdGVuYW50cyBmaWVsZFxuICovXG5leHBvcnQgY29uc3QgZ2V0VXNlclRlbmFudElEcyA9IDxJRFR5cGUgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmc+KFxuICB1c2VyOiBudWxsIHwgVXNlcldpdGhUZW5hbnRzRmllbGQsXG4pOiBJRFR5cGVbXSA9PiB7XG4gIGlmICghdXNlcikge1xuICAgIHJldHVybiBbXVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICB1c2VyPy5za29sZT8ucmVkdWNlPElEVHlwZVtdPigoYWNjLCB0ZW5hbnQpID0+IHtcbiAgICAgIGlmICh0ZW5hbnQpIHtcbiAgICAgICAgYWNjLnB1c2goZXh0cmFjdElEPElEVHlwZT4odGVuYW50IGFzIFRlbmFudDxJRFR5cGU+KSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFjY1xuICAgIH0sIFtdKSB8fCBbXVxuICApXG59XG4iXSwibmFtZXMiOlsiZXh0cmFjdElEIiwiZ2V0VXNlclRlbmFudElEcyIsInVzZXIiLCJza29sZSIsInJlZHVjZSIsImFjYyIsInRlbmFudCIsInB1c2giXSwibWFwcGluZ3MiOiJBQUVBLFNBQVNBLFNBQVMsUUFBUSxjQUFhO0FBRXZDOzs7O0NBSUMsR0FDRCxPQUFPLE1BQU1DLG1CQUFtQixDQUM5QkM7SUFFQSxJQUFJLENBQUNBLE1BQU07UUFDVCxPQUFPLEVBQUU7SUFDWDtJQUVBLE9BQ0VBLE1BQU1DLE9BQU9DLE9BQWlCLENBQUNDLEtBQUtDO1FBQ2xDLElBQUlBLFFBQVE7WUFDVkQsSUFBSUUsSUFBSSxDQUFDUCxVQUFrQk07UUFDN0I7UUFFQSxPQUFPRDtJQUNULEdBQUcsRUFBRSxLQUFLLEVBQUU7QUFFaEIsRUFBQyJ9