'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import { SelectInput } from "@payloadcms/ui";
import "./index.scss";
import React from "react";
import { SELECT_ALL } from "../../constants.js";
import { useTenantSelection } from "../../providers/TenantSelectionProvider/index.client.js";
export const TenantSelector = ({ viewType })=>{
    const { options, selectedTenantID, setTenant } = useTenantSelection();
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
    if (options.length <= 1) {
        return null;
    }
    return /*#__PURE__*/ _jsx("div", {
        className: "tenant-selector",
        children: /*#__PURE__*/ _jsx(SelectInput, {
            isClearable: viewType === 'list',
            label: "Tenant",
            name: "setTenant",
            onChange: handleChange,
            options: options,
            path: "setTenant",
            value: selectedTenantID ? selectedTenantID === SELECT_ALL ? undefined : selectedTenantID : undefined
        })
    });
};

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL1RlbmFudFNlbGVjdG9yL2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGNsaWVudCdcbmltcG9ydCB0eXBlIHsgUmVhY3RTZWxlY3RPcHRpb24gfSBmcm9tICdAcGF5bG9hZGNtcy91aSdcbmltcG9ydCB0eXBlIHsgVmlld1R5cGVzIH0gZnJvbSAncGF5bG9hZCdcblxuaW1wb3J0IHsgU2VsZWN0SW5wdXQgfSBmcm9tICdAcGF5bG9hZGNtcy91aSdcblxuaW1wb3J0ICcuL2luZGV4LnNjc3MnXG5cbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCdcblxuaW1wb3J0IHsgU0VMRUNUX0FMTCB9IGZyb20gJy4uLy4uL2NvbnN0YW50cy5qcydcbmltcG9ydCB7IHVzZVRlbmFudFNlbGVjdGlvbiB9IGZyb20gJy4uLy4uL3Byb3ZpZGVycy9UZW5hbnRTZWxlY3Rpb25Qcm92aWRlci9pbmRleC5jbGllbnQuanMnXG5cbmV4cG9ydCBjb25zdCBUZW5hbnRTZWxlY3RvciA9ICh7IHZpZXdUeXBlIH06IHsgdmlld1R5cGU/OiBWaWV3VHlwZXMgfSkgPT4ge1xuICBjb25zdCB7IG9wdGlvbnMsIHNlbGVjdGVkVGVuYW50SUQsIHNldFRlbmFudCB9ID0gdXNlVGVuYW50U2VsZWN0aW9uKClcblxuICBjb25zdCBoYW5kbGVDaGFuZ2UgPSBSZWFjdC51c2VDYWxsYmFjayhcbiAgICAob3B0aW9uOiBSZWFjdFNlbGVjdE9wdGlvbiB8IFJlYWN0U2VsZWN0T3B0aW9uW10pID0+IHtcbiAgICAgIGlmIChvcHRpb24gJiYgJ3ZhbHVlJyBpbiBvcHRpb24pIHtcbiAgICAgICAgc2V0VGVuYW50KHsgaWQ6IG9wdGlvbi52YWx1ZSBhcyBzdHJpbmcsIHJlZnJlc2g6IHRydWUgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFRlbmFudCh7IGlkOiB1bmRlZmluZWQsIHJlZnJlc2g6IHRydWUgfSlcbiAgICAgIH1cbiAgICB9LFxuICAgIFtzZXRUZW5hbnRdLFxuICApXG5cbiAgaWYgKG9wdGlvbnMubGVuZ3RoIDw9IDEpIHtcbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInRlbmFudC1zZWxlY3RvclwiPlxuICAgICAgPFNlbGVjdElucHV0XG4gICAgICAgIGlzQ2xlYXJhYmxlPXt2aWV3VHlwZSA9PT0gJ2xpc3QnfVxuICAgICAgICBsYWJlbD1cIlRlbmFudFwiXG4gICAgICAgIG5hbWU9XCJzZXRUZW5hbnRcIlxuICAgICAgICBvbkNoYW5nZT17aGFuZGxlQ2hhbmdlfVxuICAgICAgICBvcHRpb25zPXtvcHRpb25zfVxuICAgICAgICBwYXRoPVwic2V0VGVuYW50XCJcbiAgICAgICAgdmFsdWU9e1xuICAgICAgICAgIHNlbGVjdGVkVGVuYW50SURcbiAgICAgICAgICAgID8gc2VsZWN0ZWRUZW5hbnRJRCA9PT0gU0VMRUNUX0FMTFxuICAgICAgICAgICAgICA/IHVuZGVmaW5lZFxuICAgICAgICAgICAgICA6IChzZWxlY3RlZFRlbmFudElEIGFzIHN0cmluZylcbiAgICAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgICAgIH1cbiAgICAgIC8+XG4gICAgPC9kaXY+XG4gIClcbn1cbiJdLCJuYW1lcyI6WyJTZWxlY3RJbnB1dCIsIlJlYWN0IiwiU0VMRUNUX0FMTCIsInVzZVRlbmFudFNlbGVjdGlvbiIsIlRlbmFudFNlbGVjdG9yIiwidmlld1R5cGUiLCJvcHRpb25zIiwic2VsZWN0ZWRUZW5hbnRJRCIsInNldFRlbmFudCIsImhhbmRsZUNoYW5nZSIsInVzZUNhbGxiYWNrIiwib3B0aW9uIiwiaWQiLCJ2YWx1ZSIsInJlZnJlc2giLCJ1bmRlZmluZWQiLCJsZW5ndGgiLCJkaXYiLCJjbGFzc05hbWUiLCJpc0NsZWFyYWJsZSIsImxhYmVsIiwibmFtZSIsIm9uQ2hhbmdlIiwicGF0aCJdLCJtYXBwaW5ncyI6IkFBQUE7O0FBSUEsU0FBU0EsV0FBVyxRQUFRLGlCQUFnQjtBQUU1QyxPQUFPLGVBQWM7QUFFckIsT0FBT0MsV0FBVyxRQUFPO0FBRXpCLFNBQVNDLFVBQVUsUUFBUSxxQkFBb0I7QUFDL0MsU0FBU0Msa0JBQWtCLFFBQVEsMERBQXlEO0FBRTVGLE9BQU8sTUFBTUMsaUJBQWlCLENBQUMsRUFBRUMsUUFBUSxFQUE0QjtJQUNuRSxNQUFNLEVBQUVDLE9BQU8sRUFBRUMsZ0JBQWdCLEVBQUVDLFNBQVMsRUFBRSxHQUFHTDtJQUVqRCxNQUFNTSxlQUFlUixNQUFNUyxXQUFXLENBQ3BDLENBQUNDO1FBQ0MsSUFBSUEsVUFBVSxXQUFXQSxRQUFRO1lBQy9CSCxVQUFVO2dCQUFFSSxJQUFJRCxPQUFPRSxLQUFLO2dCQUFZQyxTQUFTO1lBQUs7UUFDeEQsT0FBTztZQUNMTixVQUFVO2dCQUFFSSxJQUFJRztnQkFBV0QsU0FBUztZQUFLO1FBQzNDO0lBQ0YsR0FDQTtRQUFDTjtLQUFVO0lBR2IsSUFBSUYsUUFBUVUsTUFBTSxJQUFJLEdBQUc7UUFDdkIsT0FBTztJQUNUO0lBRUEscUJBQ0UsS0FBQ0M7UUFBSUMsV0FBVTtrQkFDYixjQUFBLEtBQUNsQjtZQUNDbUIsYUFBYWQsYUFBYTtZQUMxQmUsT0FBTTtZQUNOQyxNQUFLO1lBQ0xDLFVBQVViO1lBQ1ZILFNBQVNBO1lBQ1RpQixNQUFLO1lBQ0xWLE9BQ0VOLG1CQUNJQSxxQkFBcUJMLGFBQ25CYSxZQUNDUixtQkFDSFE7OztBQUtkLEVBQUMifQ==