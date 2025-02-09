'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { SelectInput, useAuth } from "@payloadcms/ui";
import "./index.scss";
import React from "react";
import { SELECT_ALL } from "../../constants";
import { useTenantSelection } from "../../providers/TenantSelectionProvider/index.client";
export const TenantSelector = ({ viewType })=>{
    const { options, selectedTenantID, setTenant } = useTenantSelection();
    const { user } = useAuth();
    const handleChange = React.useCallback((option)=>{
        if (option && 'value' in option) {
            setTenant({
                id: option.value,
                refresh: true
            });
        } else {
            setTenant({
                id: undefined,
                refresh: true
            });
        }
    }, [
        setTenant
    ]);
    if (user?.role.includes('skolaAdmin') || options.length <= 1) {
        return null;
    }
    return /*#__PURE__*/ _jsx("div", {
        className: "tenant-selector",
        children: /*#__PURE__*/ _jsx(SelectInput, {
            isClearable: viewType === 'list',
            label: "Школа",
            name: "setTenant",
            onChange: handleChange,
            options: options,
            path: "setTenant",
            value: selectedTenantID ? selectedTenantID === SELECT_ALL ? undefined : selectedTenantID : undefined
        })
    });
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1RlbmFudFNlbGVjdG9yL2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgUmVhY3RTZWxlY3RPcHRpb24gfSBmcm9tICdAcGF5bG9hZGNtcy91aSdcbmltcG9ydCB0eXBlIHsgVmlld1R5cGVzIH0gZnJvbSAncGF5bG9hZCdcblxuaW1wb3J0IHsgU2VsZWN0SW5wdXQsIHVzZUF1dGggfSBmcm9tICdAcGF5bG9hZGNtcy91aSdcblxuaW1wb3J0ICcuL2luZGV4LnNjc3MnXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcblxuaW1wb3J0IHsgU0VMRUNUX0FMTCB9IGZyb20gJy4uLy4uL2NvbnN0YW50cydcbmltcG9ydCB7IHVzZVRlbmFudFNlbGVjdGlvbiB9IGZyb20gJy4uLy4uL3Byb3ZpZGVycy9UZW5hbnRTZWxlY3Rpb25Qcm92aWRlci9pbmRleC5jbGllbnQnXG5pbXBvcnQgeyBVc2VyV2l0aFRlbmFudHNGaWVsZCB9IGZyb20gJ0AvdHlwZXMnXG5cbmV4cG9ydCBjb25zdCBUZW5hbnRTZWxlY3RvciA9ICh7IHZpZXdUeXBlIH06IHsgdmlld1R5cGU/OiBWaWV3VHlwZXMgfSkgPT4ge1xuICBjb25zdCB7IG9wdGlvbnMsIHNlbGVjdGVkVGVuYW50SUQsIHNldFRlbmFudCB9ID0gdXNlVGVuYW50U2VsZWN0aW9uKClcbiAgY29uc3QgeyB1c2VyIH0gPSB1c2VBdXRoPFVzZXJXaXRoVGVuYW50c0ZpZWxkPigpXG5cbiAgY29uc3QgaGFuZGxlQ2hhbmdlID0gUmVhY3QudXNlQ2FsbGJhY2soXG4gICAgKG9wdGlvbjogUmVhY3RTZWxlY3RPcHRpb24gfCBSZWFjdFNlbGVjdE9wdGlvbltdKSA9PiB7XG4gICAgICBpZiAob3B0aW9uICYmICd2YWx1ZScgaW4gb3B0aW9uKSB7XG4gICAgICAgIHNldFRlbmFudCh7IGlkOiBvcHRpb24udmFsdWUgYXMgc3RyaW5nLCByZWZyZXNoOiB0cnVlIH0pXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRUZW5hbnQoeyBpZDogdW5kZWZpbmVkLCByZWZyZXNoOiB0cnVlIH0pXG4gICAgICB9XG4gICAgfSxcbiAgICBbc2V0VGVuYW50XSxcbiAgKVxuXG4gIGlmICh1c2VyPy5yb2xlLmluY2x1ZGVzKCdza29sYUFkbWluJykgfHwgb3B0aW9ucy5sZW5ndGggPD0gMSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwidGVuYW50LXNlbGVjdG9yXCI+XG4gICAgICA8U2VsZWN0SW5wdXRcbiAgICAgICAgaXNDbGVhcmFibGU9e3ZpZXdUeXBlID09PSAnbGlzdCd9XG4gICAgICAgIGxhYmVsPVwi0KjQutC+0LvQsFwiXG4gICAgICAgIG5hbWU9XCJzZXRUZW5hbnRcIlxuICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICBvcHRpb25zPXtvcHRpb25zfVxuICAgICAgICBwYXRoPVwic2V0VGVuYW50XCJcbiAgICAgICAgdmFsdWU9e1xuICAgICAgICAgIHNlbGVjdGVkVGVuYW50SURcbiAgICAgICAgICAgID8gc2VsZWN0ZWRUZW5hbnRJRCA9PT0gU0VMRUNUX0FMTFxuICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICA6IChzZWxlY3RlZFRlbmFudElEIGFzIHN0cmluZylcbiAgICAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgICAgIH1cbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gIClcbn1cbiJdLCJuYW1lcyI6WyJTZWxlY3RJbnB1dCIsInVzZUF1dGgiLCJSZWFjdCIsIlNFTEVDVF9BTEwiLCJ1c2VUZW5hbnRTZWxlY3Rpb24iLCJUZW5hbnRTZWxlY3RvciIsInZpZXdUeXBlIiwib3B0aW9ucyIsInNlbGVjdGVkVGVuYW50SUQiLCJzZXRUZW5hbnQiLCJ1c2VyIiwiaGFuZGxlQ2hhbmdlIiwidXNlQ2FsbGJhY2siLCJvcHRpb24iLCJpZCIsInZhbHVlIiwicmVmcmVzaCIsInVuZGVmaW5lZCIsInJvbGUiLCJpbmNsdWRlcyIsImxlbmd0aCIsImRpdiIsImNsYXNzTmFtZSIsImlzQ2xlYXJhYmxlIiwibGFiZWwiLCJuYW1lIiwib25DaGFuZ2UiLCJwYXRoIl0sIm1hcHBpbmdzIjoiQUFBQTs7QUFJQSxTQUFTQSxXQUFXLEVBQUVDLE9BQU8sUUFBUSxpQkFBZ0I7QUFFckQsT0FBTyxlQUFjO0FBRXJCLE9BQU9DLFdBQVcsUUFBTztBQUV6QixTQUFTQyxVQUFVLFFBQVEsa0JBQWlCO0FBQzVDLFNBQVNDLGtCQUFrQixRQUFRLHVEQUFzRDtBQUd6RixPQUFPLE1BQU1DLGlCQUFpQixDQUFDLEVBQUVDLFFBQVEsRUFBNEI7SUFDbkUsTUFBTSxFQUFFQyxPQUFPLEVBQUVDLGdCQUFnQixFQUFFQyxTQUFTLEVBQUUsR0FBR0w7SUFDakQsTUFBTSxFQUFFTSxJQUFJLEVBQUUsR0FBR1Q7SUFFakIsTUFBTVUsZUFBZVQsTUFBTVUsV0FBVyxDQUNwQyxDQUFDQztRQUNDLElBQUlBLFVBQVUsV0FBV0EsUUFBUTtZQUMvQkosVUFBVTtnQkFBRUssSUFBSUQsT0FBT0UsS0FBSztnQkFBWUMsU0FBUztZQUFLO1FBQ3hELE9BQU87WUFDTFAsVUFBVTtnQkFBRUssSUFBSUc7Z0JBQVdELFNBQVM7WUFBSztRQUMzQztJQUNGLEdBQ0E7UUFBQ1A7S0FBVTtJQUdiLElBQUlDLE1BQU1RLEtBQUtDLFNBQVMsaUJBQWlCWixRQUFRYSxNQUFNLElBQUksR0FBRztRQUM1RCxPQUFPO0lBQ1Q7SUFFQSxxQkFDRSxLQUFDQztRQUFJQyxXQUFVO2tCQUNiLGNBQUEsS0FBQ3RCO1lBQ0N1QixhQUFhakIsYUFBYTtZQUMxQmtCLE9BQU07WUFDTkMsTUFBSztZQUNMQyxVQUFVZjtZQUNWSixTQUFTQTtZQUNUb0IsTUFBSztZQUNMWixPQUNFUCxtQkFDSUEscUJBQXFCTCxhQUNuQmMsWUFDQ1QsbUJBQ0hTOzs7QUFLZCxFQUFDIn0=