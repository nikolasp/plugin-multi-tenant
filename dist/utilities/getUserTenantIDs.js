import { extractID } from "./extractID.js";
/**
 * Returns array of all tenant IDs assigned to a user
 *
 * @param user - User object with tenants field
 */ export const getUserTenantIDs = (user)=>{
    if (!user) {
        return [];
    }
    return user?.tenants?.reduce((acc, { tenant })=>{
        if (tenant) {
            acc.push(extractID(tenant));
        }
        return acc;
    }, []) || [];
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsaXRpZXMvZ2V0VXNlclRlbmFudElEcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFRlbmFudCwgVXNlcldpdGhUZW5hbnRzRmllbGQgfSBmcm9tICcuLi90eXBlcy5qcydcblxuaW1wb3J0IHsgZXh0cmFjdElEIH0gZnJvbSAnLi9leHRyYWN0SUQuanMnXG5cbi8qKlxuICogUmV0dXJucyBhcnJheSBvZiBhbGwgdGVuYW50IElEcyBhc3NpZ25lZCB0byBhIHVzZXJcbiAqXG4gKiBAcGFyYW0gdXNlciAtIFVzZXIgb2JqZWN0IHdpdGggdGVuYW50cyBmaWVsZFxuICovXG5leHBvcnQgY29uc3QgZ2V0VXNlclRlbmFudElEcyA9IDxJRFR5cGUgZXh0ZW5kcyBudW1iZXIgfCBzdHJpbmc+KFxuICB1c2VyOiBudWxsIHwgVXNlcldpdGhUZW5hbnRzRmllbGQsXG4pOiBJRFR5cGVbXSA9PiB7XG4gIGlmICghdXNlcikge1xuICAgIHJldHVybiBbXVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICB1c2VyPy50ZW5hbnRzPy5yZWR1Y2U8SURUeXBlW10+KChhY2MsIHsgdGVuYW50IH0pID0+IHtcbiAgICAgIGlmICh0ZW5hbnQpIHtcbiAgICAgICAgYWNjLnB1c2goZXh0cmFjdElEPElEVHlwZT4odGVuYW50IGFzIFRlbmFudDxJRFR5cGU+KSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGFjY1xuICAgIH0sIFtdKSB8fCBbXVxuICApXG59XG4iXSwibmFtZXMiOlsiZXh0cmFjdElEIiwiZ2V0VXNlclRlbmFudElEcyIsInVzZXIiLCJ0ZW5hbnRzIiwicmVkdWNlIiwiYWNjIiwidGVuYW50IiwicHVzaCJdLCJtYXBwaW5ncyI6IkFBRUEsU0FBU0EsU0FBUyxRQUFRLGlCQUFnQjtBQUUxQzs7OztDQUlDLEdBQ0QsT0FBTyxNQUFNQyxtQkFBbUIsQ0FDOUJDO0lBRUEsSUFBSSxDQUFDQSxNQUFNO1FBQ1QsT0FBTyxFQUFFO0lBQ1g7SUFFQSxPQUNFQSxNQUFNQyxTQUFTQyxPQUFpQixDQUFDQyxLQUFLLEVBQUVDLE1BQU0sRUFBRTtRQUM5QyxJQUFJQSxRQUFRO1lBQ1ZELElBQUlFLElBQUksQ0FBQ1AsVUFBa0JNO1FBQzdCO1FBRUEsT0FBT0Q7SUFDVCxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBRWhCLEVBQUMifQ==