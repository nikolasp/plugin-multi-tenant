'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { RelationshipField, useField } from "@payloadcms/ui";
import React from "react";
import { SELECT_ALL } from "../../constants";
import { useTenantSelection } from "../../providers/TenantSelectionProvider/index.client";
import "./index.scss";
const baseClass = 'tenantField';
export const TenantField = (args)=>{
    const { debug, path, unique } = args;
    const { setValue, value } = useField({
        path
    });
    const { options, selectedTenantID, setPreventRefreshOnChange, setTenant } = useTenantSelection();
    const hasSetValueRef = React.useRef(false);
    React.useEffect(()=>{
        if (!hasSetValueRef.current) {
            // set value on load
            if (value && value !== selectedTenantID) {
                setTenant({
                    id: value,
                    refresh: unique
                });
            } else {
                // in the document view, the tenant field should always have a value
                const defaultValue = !selectedTenantID || selectedTenantID === SELECT_ALL ? options[0]?.value : selectedTenantID;
                setTenant({
                    id: defaultValue,
                    refresh: unique
                });
            }
            hasSetValueRef.current = true;
        } else if ((!value || value !== selectedTenantID) && selectedTenantID !== SELECT_ALL) {
            // Update the field on the document value when the tenant is changed
            setValue(selectedTenantID);
        }
    }, [
        value,
        selectedTenantID,
        setTenant,
        setValue,
        options,
        unique
    ]);
    React.useEffect(()=>{
        if (!unique) {
            setPreventRefreshOnChange(true);
        }
        return ()=>{
            setPreventRefreshOnChange(false);
        };
    }, [
        unique,
        setPreventRefreshOnChange
    ]);
    if (debug) {
        return /*#__PURE__*/ _jsxs("div", {
            className: baseClass,
            children: [
                /*#__PURE__*/ _jsx("div", {
                    className: `${baseClass}__wrapper`,
                    children: /*#__PURE__*/ _jsx(RelationshipField, {
                        ...args
                    })
                }),
                /*#__PURE__*/ _jsx("div", {
                    className: `${baseClass}__hr`
                })
            ]
        });
    }
    return null;
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1RlbmFudEZpZWxkL2luZGV4LmNsaWVudC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBjbGllbnQnXG5cbmltcG9ydCB0eXBlIHsgUmVsYXRpb25zaGlwRmllbGRDbGllbnRQcm9wcyB9IGZyb20gJ3BheWxvYWQnXG5cbmltcG9ydCB7IFJlbGF0aW9uc2hpcEZpZWxkLCB1c2VGaWVsZCB9IGZyb20gJ0BwYXlsb2FkY21zL3VpJ1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0J1xuXG5pbXBvcnQgeyBTRUxFQ1RfQUxMIH0gZnJvbSAnLi4vLi4vY29uc3RhbnRzJ1xuaW1wb3J0IHsgdXNlVGVuYW50U2VsZWN0aW9uIH0gZnJvbSAnLi4vLi4vcHJvdmlkZXJzL1RlbmFudFNlbGVjdGlvblByb3ZpZGVyL2luZGV4LmNsaWVudCdcbmltcG9ydCAnLi9pbmRleC5zY3NzJ1xuXG5jb25zdCBiYXNlQ2xhc3MgPSAndGVuYW50RmllbGQnXG5cbnR5cGUgUHJvcHMgPSB7XG4gIGRlYnVnPzogYm9vbGVhblxuICB1bmlxdWU/OiBib29sZWFuXG59ICYgUmVsYXRpb25zaGlwRmllbGRDbGllbnRQcm9wc1xuXG5leHBvcnQgY29uc3QgVGVuYW50RmllbGQgPSAoYXJnczogUHJvcHMpID0+IHtcbiAgY29uc3QgeyBkZWJ1ZywgcGF0aCwgdW5pcXVlIH0gPSBhcmdzXG4gIGNvbnN0IHsgc2V0VmFsdWUsIHZhbHVlIH0gPSB1c2VGaWVsZDxudW1iZXIgfCBzdHJpbmc+KHsgcGF0aCB9KVxuICBjb25zdCB7IG9wdGlvbnMsIHNlbGVjdGVkVGVuYW50SUQsIHNldFByZXZlbnRSZWZyZXNoT25DaGFuZ2UsIHNldFRlbmFudCB9ID0gdXNlVGVuYW50U2VsZWN0aW9uKClcblxuICBjb25zdCBoYXNTZXRWYWx1ZVJlZiA9IFJlYWN0LnVzZVJlZihmYWxzZSlcblxuICBSZWFjdC51c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghaGFzU2V0VmFsdWVSZWYuY3VycmVudCkge1xuICAgICAgLy8gc2V0IHZhbHVlIG9uIGxvYWRcbiAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZSAhPT0gc2VsZWN0ZWRUZW5hbnRJRCkge1xuICAgICAgICBzZXRUZW5hbnQoeyBpZDogdmFsdWUsIHJlZnJlc2g6IHVuaXF1ZSB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaW4gdGhlIGRvY3VtZW50IHZpZXcsIHRoZSB0ZW5hbnQgZmllbGQgc2hvdWxkIGFsd2F5cyBoYXZlIGEgdmFsdWVcbiAgICAgICAgY29uc3QgZGVmYXVsdFZhbHVlID1cbiAgICAgICAgICAhc2VsZWN0ZWRUZW5hbnRJRCB8fCBzZWxlY3RlZFRlbmFudElEID09PSBTRUxFQ1RfQUxMXG4gICAgICAgICAgICA/IG9wdGlvbnNbMF0/LnZhbHVlXG4gICAgICAgICAgICA6IHNlbGVjdGVkVGVuYW50SURcbiAgICAgICAgc2V0VGVuYW50KHsgaWQ6IGRlZmF1bHRWYWx1ZSwgcmVmcmVzaDogdW5pcXVlIH0pXG4gICAgICB9XG4gICAgICBoYXNTZXRWYWx1ZVJlZi5jdXJyZW50ID0gdHJ1ZVxuICAgIH0gZWxzZSBpZiAoKCF2YWx1ZSB8fCB2YWx1ZSAhPT0gc2VsZWN0ZWRUZW5hbnRJRCkgJiYgc2VsZWN0ZWRUZW5hbnRJRCAhPT0gU0VMRUNUX0FMTCkge1xuICAgICAgLy8gVXBkYXRlIHRoZSBmaWVsZCBvbiB0aGUgZG9jdW1lbnQgdmFsdWUgd2hlbiB0aGUgdGVuYW50IGlzIGNoYW5nZWRcbiAgICAgIHNldFZhbHVlKHNlbGVjdGVkVGVuYW50SUQpXG4gICAgfVxuICB9LCBbdmFsdWUsIHNlbGVjdGVkVGVuYW50SUQsIHNldFRlbmFudCwgc2V0VmFsdWUsIG9wdGlvbnMsIHVuaXF1ZV0pXG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIXVuaXF1ZSkge1xuICAgICAgc2V0UHJldmVudFJlZnJlc2hPbkNoYW5nZSh0cnVlKVxuICAgIH1cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgc2V0UHJldmVudFJlZnJlc2hPbkNoYW5nZShmYWxzZSlcbiAgICB9XG4gIH0sIFt1bmlxdWUsIHNldFByZXZlbnRSZWZyZXNoT25DaGFuZ2VdKVxuXG4gIGlmIChkZWJ1Zykge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17YmFzZUNsYXNzfT5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9e2Ake2Jhc2VDbGFzc31fX3dyYXBwZXJgfT5cbiAgICAgICAgICA8UmVsYXRpb25zaGlwRmllbGQgey4uLmFyZ3N9IC8+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17YCR7YmFzZUNsYXNzfV9faHJgfSAvPlxuICAgICAgPC9kaXY+XG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIG51bGxcbn1cbiJdLCJuYW1lcyI6WyJSZWxhdGlvbnNoaXBGaWVsZCIsInVzZUZpZWxkIiwiUmVhY3QiLCJTRUxFQ1RfQUxMIiwidXNlVGVuYW50U2VsZWN0aW9uIiwiYmFzZUNsYXNzIiwiVGVuYW50RmllbGQiLCJhcmdzIiwiZGVidWciLCJwYXRoIiwidW5pcXVlIiwic2V0VmFsdWUiLCJ2YWx1ZSIsIm9wdGlvbnMiLCJzZWxlY3RlZFRlbmFudElEIiwic2V0UHJldmVudFJlZnJlc2hPbkNoYW5nZSIsInNldFRlbmFudCIsImhhc1NldFZhbHVlUmVmIiwidXNlUmVmIiwidXNlRWZmZWN0IiwiY3VycmVudCIsImlkIiwicmVmcmVzaCIsImRlZmF1bHRWYWx1ZSIsImRpdiIsImNsYXNzTmFtZSJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBSUEsU0FBU0EsaUJBQWlCLEVBQUVDLFFBQVEsUUFBUSxpQkFBZ0I7QUFDNUQsT0FBT0MsV0FBVyxRQUFPO0FBRXpCLFNBQVNDLFVBQVUsUUFBUSxrQkFBaUI7QUFDNUMsU0FBU0Msa0JBQWtCLFFBQVEsdURBQXNEO0FBQ3pGLE9BQU8sZUFBYztBQUVyQixNQUFNQyxZQUFZO0FBT2xCLE9BQU8sTUFBTUMsY0FBYyxDQUFDQztJQUMxQixNQUFNLEVBQUVDLEtBQUssRUFBRUMsSUFBSSxFQUFFQyxNQUFNLEVBQUUsR0FBR0g7SUFDaEMsTUFBTSxFQUFFSSxRQUFRLEVBQUVDLEtBQUssRUFBRSxHQUFHWCxTQUEwQjtRQUFFUTtJQUFLO0lBQzdELE1BQU0sRUFBRUksT0FBTyxFQUFFQyxnQkFBZ0IsRUFBRUMseUJBQXlCLEVBQUVDLFNBQVMsRUFBRSxHQUFHWjtJQUU1RSxNQUFNYSxpQkFBaUJmLE1BQU1nQixNQUFNLENBQUM7SUFFcENoQixNQUFNaUIsU0FBUyxDQUFDO1FBQ2QsSUFBSSxDQUFDRixlQUFlRyxPQUFPLEVBQUU7WUFDM0Isb0JBQW9CO1lBQ3BCLElBQUlSLFNBQVNBLFVBQVVFLGtCQUFrQjtnQkFDdkNFLFVBQVU7b0JBQUVLLElBQUlUO29CQUFPVSxTQUFTWjtnQkFBTztZQUN6QyxPQUFPO2dCQUNMLG9FQUFvRTtnQkFDcEUsTUFBTWEsZUFDSixDQUFDVCxvQkFBb0JBLHFCQUFxQlgsYUFDdENVLE9BQU8sQ0FBQyxFQUFFLEVBQUVELFFBQ1pFO2dCQUNORSxVQUFVO29CQUFFSyxJQUFJRTtvQkFBY0QsU0FBU1o7Z0JBQU87WUFDaEQ7WUFDQU8sZUFBZUcsT0FBTyxHQUFHO1FBQzNCLE9BQU8sSUFBSSxBQUFDLENBQUEsQ0FBQ1IsU0FBU0EsVUFBVUUsZ0JBQWUsS0FBTUEscUJBQXFCWCxZQUFZO1lBQ3BGLG9FQUFvRTtZQUNwRVEsU0FBU0c7UUFDWDtJQUNGLEdBQUc7UUFBQ0Y7UUFBT0U7UUFBa0JFO1FBQVdMO1FBQVVFO1FBQVNIO0tBQU87SUFFbEVSLE1BQU1pQixTQUFTLENBQUM7UUFDZCxJQUFJLENBQUNULFFBQVE7WUFDWEssMEJBQTBCO1FBQzVCO1FBQ0EsT0FBTztZQUNMQSwwQkFBMEI7UUFDNUI7SUFDRixHQUFHO1FBQUNMO1FBQVFLO0tBQTBCO0lBRXRDLElBQUlQLE9BQU87UUFDVCxxQkFDRSxNQUFDZ0I7WUFBSUMsV0FBV3BCOzs4QkFDZCxLQUFDbUI7b0JBQUlDLFdBQVcsR0FBR3BCLFVBQVUsU0FBUyxDQUFDOzhCQUNyQyxjQUFBLEtBQUNMO3dCQUFtQixHQUFHTyxJQUFJOzs7OEJBRTdCLEtBQUNpQjtvQkFBSUMsV0FBVyxHQUFHcEIsVUFBVSxJQUFJLENBQUM7Ozs7SUFHeEM7SUFFQSxPQUFPO0FBQ1QsRUFBQyJ9