'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { useAuth } from "@payloadcms/ui";
import { useRouter } from "next/navigation";
import React, { createContext } from "react";
import { SELECT_ALL } from "../../constants";
const Context = /*#__PURE__*/ createContext({
    options: [],
    selectedTenantID: undefined,
    setPreventRefreshOnChange: ()=>null,
    setTenant: ()=>null
});
export const TenantSelectionProviderClient = ({ children, initialValue, tenantCookie, tenantOptions })=>{
    const [selectedTenantID, setSelectedTenantID] = React.useState(initialValue);
    const [preventRefreshOnChange, setPreventRefreshOnChange] = React.useState(false);
    const { user } = useAuth();
    const userID = React.useMemo(()=>user?.id, [
        user?.id
    ]);
    const selectedTenantLabel = React.useMemo(()=>tenantOptions.find((option)=>option.value === selectedTenantID)?.label, [
        selectedTenantID,
        tenantOptions
    ]);
    const router = useRouter();
    const setCookie = React.useCallback((value)=>{
        const expires = '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
        document.cookie = 'payload-tenant=' + (value || '') + expires + '; path=/';
    }, []);
    const deleteCookie = React.useCallback(()=>{
        document.cookie = 'payload-tenant=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    }, []);
    const setTenant = React.useCallback(({ id, refresh })=>{
        if (id === undefined) {
            if (tenantOptions.length > 1) {
                setSelectedTenantID(SELECT_ALL);
                setCookie(SELECT_ALL);
            } else {
                setSelectedTenantID(tenantOptions[0]?.value);
                setCookie(String(tenantOptions[0]?.value));
            }
        } else {
            setSelectedTenantID(id);
            setCookie(String(id));
        }
        if (!preventRefreshOnChange && refresh) {
            router.refresh();
        }
    }, [
        setSelectedTenantID,
        setCookie,
        router,
        preventRefreshOnChange,
        tenantOptions
    ]);
    React.useEffect(()=>{
        if (selectedTenantID && selectedTenantID !== SELECT_ALL && !tenantOptions.find((option)=>option.value === selectedTenantID)) {
            if (tenantOptions?.[0]?.value) {
                setTenant({
                    id: tenantOptions[0].value,
                    refresh: true
                });
            } else {
                setTenant({
                    id: undefined,
                    refresh: true
                });
            }
        }
    }, [
        tenantCookie,
        setTenant,
        selectedTenantID,
        tenantOptions,
        initialValue,
        setCookie
    ]);
    React.useEffect(()=>{
        if (userID && !tenantCookie) {
            // User is logged in, but does not have a tenant cookie, set it
            setSelectedTenantID(initialValue);
            setCookie(String(initialValue));
        }
    }, [
        userID,
        tenantCookie,
        initialValue,
        setCookie,
        router
    ]);
    React.useEffect(()=>{
        if (!userID && tenantCookie) {
            // User is not logged in, but has a tenant cookie, delete it
            deleteCookie();
            setSelectedTenantID(undefined);
        } else if (userID) {
            // User changed, refresh
            router.refresh();
        }
    }, [
        userID,
        tenantCookie,
        deleteCookie,
        router
    ]);
    return /*#__PURE__*/ _jsx("span", {
        "data-selected-tenant-id": selectedTenantID,
        "data-selected-tenant-title": selectedTenantLabel,
        children: /*#__PURE__*/ _jsx(Context.Provider, {
            value: {
                options: tenantOptions,
                selectedTenantID,
                setPreventRefreshOnChange,
                setTenant
            },
            children: children
        })
    });
};
export const useTenantSelection = ()=>React.useContext(Context);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9wcm92aWRlcnMvVGVuYW50U2VsZWN0aW9uUHJvdmlkZXIvaW5kZXguY2xpZW50LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcblxuaW1wb3J0IHR5cGUgeyBPcHRpb25PYmplY3QgfSBmcm9tICdwYXlsb2FkJ1xuXG5pbXBvcnQgeyB1c2VBdXRoIH0gZnJvbSAnQHBheWxvYWRjbXMvdWknXG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L25hdmlnYXRpb24nXG5pbXBvcnQgUmVhY3QsIHsgY3JlYXRlQ29udGV4dCB9IGZyb20gJ3JlYWN0J1xuXG5pbXBvcnQgeyBTRUxFQ1RfQUxMIH0gZnJvbSAnLi4vLi4vY29uc3RhbnRzJ1xuXG50eXBlIENvbnRleHRUeXBlID0ge1xuICBvcHRpb25zOiBPcHRpb25PYmplY3RbXVxuICBzZWxlY3RlZFRlbmFudElEOiBudW1iZXIgfCBzdHJpbmcgfCB1bmRlZmluZWRcbiAgc2V0UHJldmVudFJlZnJlc2hPbkNoYW5nZTogUmVhY3QuRGlzcGF0Y2g8UmVhY3QuU2V0U3RhdGVBY3Rpb248Ym9vbGVhbj4+XG4gIHNldFRlbmFudDogKGFyZ3M6IHsgaWQ6IG51bWJlciB8IHN0cmluZyB8IHVuZGVmaW5lZDsgcmVmcmVzaD86IGJvb2xlYW4gfSkgPT4gdm9pZFxufVxuXG5jb25zdCBDb250ZXh0ID0gY3JlYXRlQ29udGV4dDxDb250ZXh0VHlwZT4oe1xuICBvcHRpb25zOiBbXSxcbiAgc2VsZWN0ZWRUZW5hbnRJRDogdW5kZWZpbmVkLFxuICBzZXRQcmV2ZW50UmVmcmVzaE9uQ2hhbmdlOiAoKSA9PiBudWxsLFxuICBzZXRUZW5hbnQ6ICgpID0+IG51bGwsXG59KVxuXG5leHBvcnQgY29uc3QgVGVuYW50U2VsZWN0aW9uUHJvdmlkZXJDbGllbnQgPSAoe1xuICBjaGlsZHJlbixcbiAgaW5pdGlhbFZhbHVlLFxuICB0ZW5hbnRDb29raWUsXG4gIHRlbmFudE9wdGlvbnMsXG59OiB7XG4gIGNoaWxkcmVuOiBSZWFjdC5SZWFjdE5vZGVcbiAgaW5pdGlhbFZhbHVlPzogbnVtYmVyIHwgc3RyaW5nXG4gIHRlbmFudENvb2tpZT86IHN0cmluZ1xuICB0ZW5hbnRPcHRpb25zOiBPcHRpb25PYmplY3RbXVxufSkgPT4ge1xuICBjb25zdCBbc2VsZWN0ZWRUZW5hbnRJRCwgc2V0U2VsZWN0ZWRUZW5hbnRJRF0gPSBSZWFjdC51c2VTdGF0ZTxudW1iZXIgfCBzdHJpbmcgfCB1bmRlZmluZWQ+KFxuICAgIGluaXRpYWxWYWx1ZSxcbiAgKVxuICBjb25zdCBbcHJldmVudFJlZnJlc2hPbkNoYW5nZSwgc2V0UHJldmVudFJlZnJlc2hPbkNoYW5nZV0gPSBSZWFjdC51c2VTdGF0ZShmYWxzZSlcbiAgY29uc3QgeyB1c2VyIH0gPSB1c2VBdXRoKClcbiAgY29uc3QgdXNlcklEID0gUmVhY3QudXNlTWVtbygoKSA9PiB1c2VyPy5pZCwgW3VzZXI/LmlkXSlcbiAgY29uc3Qgc2VsZWN0ZWRUZW5hbnRMYWJlbCA9IFJlYWN0LnVzZU1lbW8oXG4gICAgKCkgPT4gdGVuYW50T3B0aW9ucy5maW5kKChvcHRpb24pID0+IG9wdGlvbi52YWx1ZSA9PT0gc2VsZWN0ZWRUZW5hbnRJRCk/LmxhYmVsLFxuICAgIFtzZWxlY3RlZFRlbmFudElELCB0ZW5hbnRPcHRpb25zXSxcbiAgKVxuXG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpXG5cbiAgY29uc3Qgc2V0Q29va2llID0gUmVhY3QudXNlQ2FsbGJhY2soKHZhbHVlPzogc3RyaW5nKSA9PiB7XG4gICAgY29uc3QgZXhwaXJlcyA9ICc7IGV4cGlyZXM9RnJpLCAzMSBEZWMgOTk5OSAyMzo1OTo1OSBHTVQnXG4gICAgZG9jdW1lbnQuY29va2llID0gJ3BheWxvYWQtdGVuYW50PScgKyAodmFsdWUgfHwgJycpICsgZXhwaXJlcyArICc7IHBhdGg9LydcbiAgfSwgW10pXG5cbiAgY29uc3QgZGVsZXRlQ29va2llID0gUmVhY3QudXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIGRvY3VtZW50LmNvb2tpZSA9ICdwYXlsb2FkLXRlbmFudD07IGV4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMCBHTVQ7IHBhdGg9LydcbiAgfSwgW10pXG5cbiAgY29uc3Qgc2V0VGVuYW50ID0gUmVhY3QudXNlQ2FsbGJhY2s8Q29udGV4dFR5cGVbJ3NldFRlbmFudCddPihcbiAgICAoeyBpZCwgcmVmcmVzaCB9KSA9PiB7XG4gICAgICBpZiAoaWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodGVuYW50T3B0aW9ucy5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgc2V0U2VsZWN0ZWRUZW5hbnRJRChTRUxFQ1RfQUxMKVxuICAgICAgICAgIHNldENvb2tpZShTRUxFQ1RfQUxMKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldFNlbGVjdGVkVGVuYW50SUQodGVuYW50T3B0aW9uc1swXT8udmFsdWUpXG4gICAgICAgICAgc2V0Q29va2llKFN0cmluZyh0ZW5hbnRPcHRpb25zWzBdPy52YWx1ZSkpXG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFNlbGVjdGVkVGVuYW50SUQoaWQpXG4gICAgICAgIHNldENvb2tpZShTdHJpbmcoaWQpKVxuICAgICAgfVxuICAgICAgaWYgKCFwcmV2ZW50UmVmcmVzaE9uQ2hhbmdlICYmIHJlZnJlc2gpIHtcbiAgICAgICAgcm91dGVyLnJlZnJlc2goKVxuICAgICAgfVxuICAgIH0sXG4gICAgW3NldFNlbGVjdGVkVGVuYW50SUQsIHNldENvb2tpZSwgcm91dGVyLCBwcmV2ZW50UmVmcmVzaE9uQ2hhbmdlLCB0ZW5hbnRPcHRpb25zXSxcbiAgKVxuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKFxuICAgICAgc2VsZWN0ZWRUZW5hbnRJRCAmJlxuICAgICAgc2VsZWN0ZWRUZW5hbnRJRCAhPT0gU0VMRUNUX0FMTCAmJlxuICAgICAgIXRlbmFudE9wdGlvbnMuZmluZCgob3B0aW9uKSA9PiBvcHRpb24udmFsdWUgPT09IHNlbGVjdGVkVGVuYW50SUQpXG4gICAgKSB7XG4gICAgICBpZiAodGVuYW50T3B0aW9ucz8uWzBdPy52YWx1ZSkge1xuICAgICAgICBzZXRUZW5hbnQoeyBpZDogdGVuYW50T3B0aW9uc1swXS52YWx1ZSwgcmVmcmVzaDogdHJ1ZSB9KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0VGVuYW50KHsgaWQ6IHVuZGVmaW5lZCwgcmVmcmVzaDogdHJ1ZSB9KVxuICAgICAgfVxuICAgIH1cbiAgfSwgW3RlbmFudENvb2tpZSwgc2V0VGVuYW50LCBzZWxlY3RlZFRlbmFudElELCB0ZW5hbnRPcHRpb25zLCBpbml0aWFsVmFsdWUsIHNldENvb2tpZV0pXG5cbiAgUmVhY3QudXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAodXNlcklEICYmICF0ZW5hbnRDb29raWUpIHtcbiAgICAgIC8vIFVzZXIgaXMgbG9nZ2VkIGluLCBidXQgZG9lcyBub3QgaGF2ZSBhIHRlbmFudCBjb29raWUsIHNldCBpdFxuICAgICAgc2V0U2VsZWN0ZWRUZW5hbnRJRChpbml0aWFsVmFsdWUpXG4gICAgICBzZXRDb29raWUoU3RyaW5nKGluaXRpYWxWYWx1ZSkpXG4gICAgfVxuICB9LCBbdXNlcklELCB0ZW5hbnRDb29raWUsIGluaXRpYWxWYWx1ZSwgc2V0Q29va2llLCByb3V0ZXJdKVxuXG4gIFJlYWN0LnVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCF1c2VySUQgJiYgdGVuYW50Q29va2llKSB7XG4gICAgICAvLyBVc2VyIGlzIG5vdCBsb2dnZWQgaW4sIGJ1dCBoYXMgYSB0ZW5hbnQgY29va2llLCBkZWxldGUgaXRcbiAgICAgIGRlbGV0ZUNvb2tpZSgpXG4gICAgICBzZXRTZWxlY3RlZFRlbmFudElEKHVuZGVmaW5lZClcbiAgICB9IGVsc2UgaWYgKHVzZXJJRCkge1xuICAgICAgLy8gVXNlciBjaGFuZ2VkLCByZWZyZXNoXG4gICAgICByb3V0ZXIucmVmcmVzaCgpXG4gICAgfVxuICB9LCBbdXNlcklELCB0ZW5hbnRDb29raWUsIGRlbGV0ZUNvb2tpZSwgcm91dGVyXSlcblxuICByZXR1cm4gKFxuICAgIDxzcGFuXG4gICAgICBkYXRhLXNlbGVjdGVkLXRlbmFudC1pZD17c2VsZWN0ZWRUZW5hbnRJRH1cbiAgICAgIGRhdGEtc2VsZWN0ZWQtdGVuYW50LXRpdGxlPXtzZWxlY3RlZFRlbmFudExhYmVsfVxuICAgID5cbiAgICAgIDxDb250ZXh0LlByb3ZpZGVyXG4gICAgICAgIHZhbHVlPXt7XG4gICAgICAgICAgb3B0aW9uczogdGVuYW50T3B0aW9ucyxcbiAgICAgICAgICBzZWxlY3RlZFRlbmFudElELFxuICAgICAgICAgIHNldFByZXZlbnRSZWZyZXNoT25DaGFuZ2UsXG4gICAgICAgICAgc2V0VGVuYW50LFxuICAgICAgICB9fVxuICAgICAgPlxuICAgICAgICB7Y2hpbGRyZW59XG4gICAgICA8L0NvbnRleHQuUHJvdmlkZXI+XG4gICAgPC9zcGFuPlxuICApXG59XG5cbmV4cG9ydCBjb25zdCB1c2VUZW5hbnRTZWxlY3Rpb24gPSAoKSA9PiBSZWFjdC51c2VDb250ZXh0KENvbnRleHQpXG4iXSwibmFtZXMiOlsidXNlQXV0aCIsInVzZVJvdXRlciIsIlJlYWN0IiwiY3JlYXRlQ29udGV4dCIsIlNFTEVDVF9BTEwiLCJDb250ZXh0Iiwib3B0aW9ucyIsInNlbGVjdGVkVGVuYW50SUQiLCJ1bmRlZmluZWQiLCJzZXRQcmV2ZW50UmVmcmVzaE9uQ2hhbmdlIiwic2V0VGVuYW50IiwiVGVuYW50U2VsZWN0aW9uUHJvdmlkZXJDbGllbnQiLCJjaGlsZHJlbiIsImluaXRpYWxWYWx1ZSIsInRlbmFudENvb2tpZSIsInRlbmFudE9wdGlvbnMiLCJzZXRTZWxlY3RlZFRlbmFudElEIiwidXNlU3RhdGUiLCJwcmV2ZW50UmVmcmVzaE9uQ2hhbmdlIiwidXNlciIsInVzZXJJRCIsInVzZU1lbW8iLCJpZCIsInNlbGVjdGVkVGVuYW50TGFiZWwiLCJmaW5kIiwib3B0aW9uIiwidmFsdWUiLCJsYWJlbCIsInJvdXRlciIsInNldENvb2tpZSIsInVzZUNhbGxiYWNrIiwiZXhwaXJlcyIsImRvY3VtZW50IiwiY29va2llIiwiZGVsZXRlQ29va2llIiwicmVmcmVzaCIsImxlbmd0aCIsIlN0cmluZyIsInVzZUVmZmVjdCIsInNwYW4iLCJkYXRhLXNlbGVjdGVkLXRlbmFudC1pZCIsImRhdGEtc2VsZWN0ZWQtdGVuYW50LXRpdGxlIiwiUHJvdmlkZXIiLCJ1c2VUZW5hbnRTZWxlY3Rpb24iLCJ1c2VDb250ZXh0Il0sIm1hcHBpbmdzIjoiQUFBQTs7QUFJQSxTQUFTQSxPQUFPLFFBQVEsaUJBQWdCO0FBQ3hDLFNBQVNDLFNBQVMsUUFBUSxrQkFBaUI7QUFDM0MsT0FBT0MsU0FBU0MsYUFBYSxRQUFRLFFBQU87QUFFNUMsU0FBU0MsVUFBVSxRQUFRLGtCQUFpQjtBQVM1QyxNQUFNQyx3QkFBVUYsY0FBMkI7SUFDekNHLFNBQVMsRUFBRTtJQUNYQyxrQkFBa0JDO0lBQ2xCQywyQkFBMkIsSUFBTTtJQUNqQ0MsV0FBVyxJQUFNO0FBQ25CO0FBRUEsT0FBTyxNQUFNQyxnQ0FBZ0MsQ0FBQyxFQUM1Q0MsUUFBUSxFQUNSQyxZQUFZLEVBQ1pDLFlBQVksRUFDWkMsYUFBYSxFQU1kO0lBQ0MsTUFBTSxDQUFDUixrQkFBa0JTLG9CQUFvQixHQUFHZCxNQUFNZSxRQUFRLENBQzVESjtJQUVGLE1BQU0sQ0FBQ0ssd0JBQXdCVCwwQkFBMEIsR0FBR1AsTUFBTWUsUUFBUSxDQUFDO0lBQzNFLE1BQU0sRUFBRUUsSUFBSSxFQUFFLEdBQUduQjtJQUNqQixNQUFNb0IsU0FBU2xCLE1BQU1tQixPQUFPLENBQUMsSUFBTUYsTUFBTUcsSUFBSTtRQUFDSCxNQUFNRztLQUFHO0lBQ3ZELE1BQU1DLHNCQUFzQnJCLE1BQU1tQixPQUFPLENBQ3ZDLElBQU1OLGNBQWNTLElBQUksQ0FBQyxDQUFDQyxTQUFXQSxPQUFPQyxLQUFLLEtBQUtuQixtQkFBbUJvQixPQUN6RTtRQUFDcEI7UUFBa0JRO0tBQWM7SUFHbkMsTUFB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