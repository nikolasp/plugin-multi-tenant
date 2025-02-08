export function combineWhereConstraints(constraints) {
    if (constraints.length === 0) {
        return {};
    }
    if (constraints.length === 1 && constraints[0]) {
        return constraints[0];
    }
    const andConstraint = {
        and: []
    };
    constraints.forEach((constraint)=>{
        if (andConstraint.and && constraint && typeof constraint === 'object') {
            andConstraint.and.push(constraint);
        }
    });
    return andConstraint;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsaXRpZXMvY29tYmluZVdoZXJlQ29uc3RyYWludHMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHR5cGUgeyBXaGVyZSB9IGZyb20gJ3BheWxvYWQnXG5cbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lV2hlcmVDb25zdHJhaW50cyhjb25zdHJhaW50czogQXJyYXk8V2hlcmU+KTogV2hlcmUge1xuICBpZiAoY29uc3RyYWludHMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHt9XG4gIH1cbiAgaWYgKGNvbnN0cmFpbnRzLmxlbmd0aCA9PT0gMSAmJiBjb25zdHJhaW50c1swXSkge1xuICAgIHJldHVybiBjb25zdHJhaW50c1swXVxuICB9XG4gIGNvbnN0IGFuZENvbnN0cmFpbnQ6IFdoZXJlID0ge1xuICAgIGFuZDogW10sXG4gIH1cbiAgY29uc3RyYWludHMuZm9yRWFjaCgoY29uc3RyYWludCkgPT4ge1xuICAgIGlmIChhbmRDb25zdHJhaW50LmFuZCAmJiBjb25zdHJhaW50ICYmIHR5cGVvZiBjb25zdHJhaW50ID09PSAnb2JqZWN0Jykge1xuICAgICAgYW5kQ29uc3RyYWludC5hbmQucHVzaChjb25zdHJhaW50KVxuICAgIH1cbiAgfSlcbiAgcmV0dXJuIGFuZENvbnN0cmFpbnRcbn1cbiJdLCJuYW1lcyI6WyJjb21iaW5lV2hlcmVDb25zdHJhaW50cyIsImNvbnN0cmFpbnRzIiwibGVuZ3RoIiwiYW5kQ29uc3RyYWludCIsImFuZCIsImZvckVhY2giLCJjb25zdHJhaW50IiwicHVzaCJdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxTQUFTQSx3QkFBd0JDLFdBQXlCO0lBQy9ELElBQUlBLFlBQVlDLE1BQU0sS0FBSyxHQUFHO1FBQzVCLE9BQU8sQ0FBQztJQUNWO0lBQ0EsSUFBSUQsWUFBWUMsTUFBTSxLQUFLLEtBQUtELFdBQVcsQ0FBQyxFQUFFLEVBQUU7UUFDOUMsT0FBT0EsV0FBVyxDQUFDLEVBQUU7SUFDdkI7SUFDQSxNQUFNRSxnQkFBdUI7UUFDM0JDLEtBQUssRUFBRTtJQUNUO0lBQ0FILFlBQVlJLE9BQU8sQ0FBQyxDQUFDQztRQUNuQixJQUFJSCxjQUFjQyxHQUFHLElBQUlFLGNBQWMsT0FBT0EsZUFBZSxVQUFVO1lBQ3JFSCxjQUFjQyxHQUFHLENBQUNHLElBQUksQ0FBQ0Q7UUFDekI7SUFDRjtJQUNBLE9BQU9IO0FBQ1QifQ==