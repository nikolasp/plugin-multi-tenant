import { SELECT_ALL } from "../constants.js";
import { findTenantOptions } from "../queries/findTenantOptions.js";
import { getCollectionIDType } from "./getCollectionIDType.js";
import { getTenantFromCookie } from "./getTenantFromCookie.js";
export async function getGlobalViewRedirect({ slug, docID, headers, payload, tenantFieldName, tenantsCollectionSlug, useAsTitle, user, view }) {
    const idType = getCollectionIDType({
        collectionSlug: tenantsCollectionSlug,
        payload
    });
    let tenant = getTenantFromCookie(headers, idType);
    let redirectRoute;
    if (!tenant || tenant === SELECT_ALL) {
        const tenantsQuery = await findTenantOptions({
            limit: 1,
            payload,
            tenantsCollectionSlug,
            useAsTitle,
            user
        });
        tenant = tenantsQuery.docs[0]?.id || null;
    }
    try {
        const { docs } = await payload.find({
            collection: slug,
            depth: 0,
            limit: 1,
            overrideAccess: false,
            user,
            where: {
                [tenantFieldName]: {
                    equals: tenant
                }
            }
        });
        const tenantDocID = docs?.[0]?.id;
        if (view === 'document') {
            if (docID && !tenantDocID) {
                // viewing a document with an id but does not match the selected tenant, redirect to create route
                redirectRoute = `${payload.config.routes.admin}/collections/${slug}/create`;
            } else if (tenantDocID && docID !== tenantDocID) {
                // tenant document already exists but does not match current route doc ID, redirect to matching tenant doc
                redirectRoute = `${payload.config.routes.admin}/collections/${slug}/${tenantDocID}`;
            }
        } else if (view === 'list') {
            if (tenantDocID) {
                // tenant document exists, redirect to edit view
                redirectRoute = `${payload.config.routes.admin}/collections/${slug}/${tenantDocID}`;
            } else {
                // tenant document does not exist, redirect to create route
                redirectRoute = `${payload.config.routes.admin}/collections/${slug}/create`;
            }
        }
    } catch (e) {
        payload.logger.error(e, `${typeof e === 'object' && e && 'message' in e ? `e?.message - ` : ''}Multi Tenant Redirect Error`);
    }
    return redirectRoute;
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsaXRpZXMvZ2V0R2xvYmFsVmlld1JlZGlyZWN0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUGF5bG9hZCwgVXNlciwgVmlld1R5cGVzIH0gZnJvbSAncGF5bG9hZCdcblxuaW1wb3J0IHsgU0VMRUNUX0FMTCB9IGZyb20gJy4uL2NvbnN0YW50cy5qcydcbmltcG9ydCB7IGZpbmRUZW5hbnRPcHRpb25zIH0gZnJvbSAnLi4vcXVlcmllcy9maW5kVGVuYW50T3B0aW9ucy5qcydcbmltcG9ydCB7IGdldENvbGxlY3Rpb25JRFR5cGUgfSBmcm9tICcuL2dldENvbGxlY3Rpb25JRFR5cGUuanMnXG5pbXBvcnQgeyBnZXRUZW5hbnRGcm9tQ29va2llIH0gZnJvbSAnLi9nZXRUZW5hbnRGcm9tQ29va2llLmpzJ1xuXG50eXBlIEFyZ3MgPSB7XG4gIGRvY0lEPzogbnVtYmVyIHwgc3RyaW5nXG4gIGhlYWRlcnM6IEhlYWRlcnNcbiAgcGF5bG9hZDogUGF5bG9hZFxuICBzbHVnOiBzdHJpbmdcbiAgdGVuYW50RmllbGROYW1lOiBzdHJpbmdcbiAgdGVuYW50c0NvbGxlY3Rpb25TbHVnOiBzdHJpbmdcbiAgdXNlQXNUaXRsZTogc3RyaW5nXG4gIHVzZXI/OiBVc2VyXG4gIHZpZXc6IFZpZXdUeXBlc1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEdsb2JhbFZpZXdSZWRpcmVjdCh7XG4gIHNsdWcsXG4gIGRvY0lELFxuICBoZWFkZXJzLFxuICBwYXlsb2FkLFxuICB0ZW5hbnRGaWVsZE5hbWUsXG4gIHRlbmFudHNDb2xsZWN0aW9uU2x1ZyxcbiAgdXNlQXNUaXRsZSxcbiAgdXNlcixcbiAgdmlldyxcbn06IEFyZ3MpOiBQcm9taXNlPHN0cmluZyB8IHZvaWQ+IHtcbiAgY29uc3QgaWRUeXBlID0gZ2V0Q29sbGVjdGlvbklEVHlwZSh7XG4gICAgY29sbGVjdGlvblNsdWc6IHRlbmFudHNDb2xsZWN0aW9uU2x1ZyxcbiAgICBwYXlsb2FkLFxuICB9KVxuICBsZXQgdGVuYW50ID0gZ2V0VGVuYW50RnJvbUNvb2tpZShoZWFkZXJzLCBpZFR5cGUpXG4gIGxldCByZWRpcmVjdFJvdXRlXG5cbiAgaWYgKCF0ZW5hbnQgfHwgdGVuYW50ID09PSBTRUxFQ1RfQUxMKSB7XG4gICAgY29uc3QgdGVuYW50c1F1ZXJ5ID0gYXdhaXQgZmluZFRlbmFudE9wdGlvbnMoe1xuICAgICAgbGltaXQ6IDEsXG4gICAgICBwYXlsb2FkLFxuICAgICAgdGVuYW50c0NvbGxlY3Rpb25TbHVnLFxuICAgICAgdXNlQXNUaXRsZSxcbiAgICAgIHVzZXIsXG4gICAgfSlcblxuICAgIHRlbmFudCA9IHRlbmFudHNRdWVyeS5kb2NzWzBdPy5pZCB8fCBudWxsXG4gIH1cblxuICB0cnkge1xuICAgIGNvbnN0IHsgZG9jcyB9ID0gYXdhaXQgcGF5bG9hZC5maW5kKHtcbiAgICAgIGNvbGxlY3Rpb246IHNsdWcsXG4gICAgICBkZXB0aDogMCxcbiAgICAgIGxpbWl0OiAxLFxuICAgICAgb3ZlcnJpZGVBY2Nlc3M6IGZhbHNlLFxuICAgICAgdXNlcixcbiAgICAgIHdoZXJlOiB7XG4gICAgICAgIFt0ZW5hbnRGaWVsZE5hbWVdOiB7XG4gICAgICAgICAgZXF1YWxzOiB0ZW5hbnQsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0pXG5cbiAgICBjb25zdCB0ZW5hbnREb2NJRCA9IGRvY3M/LlswXT8uaWRcblxuICAgIGlmICh2aWV3ID09PSAnZG9jdW1lbnQnKSB7XG4gICAgICBpZiAoZG9jSUQgJiYgIXRlbmFudERvY0lEKSB7XG4gICAgICAgIC8vIHZpZXdpbmcgYSBkb2N1bWVudCB3aXRoIGFuIGlkIGJ1dCBkb2VzIG5vdCBtYXRjaCB0aGUgc2VsZWN0ZWQgdGVuYW50LCByZWRpcmVjdCB0byBjcmVhdGUgcm91dGVcbiAgICAgICAgcmVkaXJlY3RSb3V0ZSA9IGAke3BheWxvYWQuY29uZmlnLnJvdXRlcy5hZG1pbn0vY29sbGVjdGlvbnMvJHtzbHVnfS9jcmVhdGVgXG4gICAgICB9IGVsc2UgaWYgKHRlbmFudERvY0lEICYmIGRvY0lEICE9PSB0ZW5hbnREb2NJRCkge1xuICAgICAgICAvLyB0ZW5hbnQgZG9jdW1lbnQgYWxyZWFkeSBleGlzdHMgYnV0IGRvZXMgbm90IG1hdGNoIGN1cnJlbnQgcm91dGUgZG9jIElELCByZWRpcmVjdCB0byBtYXRjaGluZyB0ZW5hbnQgZG9jXG4gICAgICAgIHJlZGlyZWN0Um91dGUgPSBgJHtwYXlsb2FkLmNvbmZpZy5yb3V0ZXMuYWRtaW59L2NvbGxlY3Rpb25zLyR7c2x1Z30vJHt0ZW5hbnREb2NJRH1gXG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh2aWV3ID09PSAnbGlzdCcpIHtcbiAgICAgIGlmICh0ZW5hbnREb2NJRCkge1xuICAgICAgICAvLyB0ZW5hbnQgZG9jdW1lbnQgZXhpc3RzLCByZWRpcmVjdCB0byBlZGl0IHZpZXdcbiAgICAgICAgcmVkaXJlY3RSb3V0ZSA9IGAke3BheWxvYWQuY29uZmlnLnJvdXRlcy5hZG1pbn0vY29sbGVjdGlvbnMvJHtzbHVnfS8ke3RlbmFudERvY0lEfWBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHRlbmFudCBkb2N1bWVudCBkb2VzIG5vdCBleGlzdCwgcmVkaXJlY3QgdG8gY3JlYXRlIHJvdXRlXG4gICAgICAgIHJlZGlyZWN0Um91dGUgPSBgJHtwYXlsb2FkLmNvbmZpZy5yb3V0ZXMuYWRtaW59L2NvbGxlY3Rpb25zLyR7c2x1Z30vY3JlYXRlYFxuICAgICAgfVxuICAgIH1cbiAgfSBjYXRjaCAoZTogdW5rbm93bikge1xuICAgIHBheWxvYWQubG9nZ2VyLmVycm9yKFxuICAgICAgZSxcbiAgICAgIGAke3R5cGVvZiBlID09PSAnb2JqZWN0JyAmJiBlICYmICdtZXNzYWdlJyBpbiBlID8gYGU/Lm1lc3NhZ2UgLSBgIDogJyd9TXVsdGkgVGVuYW50IFJlZGlyZWN0IEVycm9yYCxcbiAgICApXG4gIH1cbiAgcmV0dXJuIHJlZGlyZWN0Um91dGVcbn1cbiJdLCJuYW1lcyI6WyJTRUxFQ1RfQUxMIiwiZmluZFRlbmFudE9wdGlvbnMiLCJnZXRDb2xsZWN0aW9uSURUeXBlIiwiZ2V0VGVuYW50RnJvbUNvb2tpZSIsImdldEdsb2JhbFZpZXdSZWRpcmVjdCIsInNsdWciLCJkb2NJRCIsImhlYWRlcnMiLCJwYXlsb2FkIiwidGVuYW50RmllbGROYW1lIiwidGVuYW50c0NvbGxlY3Rpb25TbHVnIiwidXNlQXNUaXRsZSIsInVzZXIiLCJ2aWV3IiwiaWRUeXBlIiwiY29sbGVjdGlvblNsdWciLCJ0ZW5hbnQiLCJyZWRpcmVjdFJvdXRlIiwidGVuYW50c1F1ZXJ5IiwibGltaXQiLCJkb2NzIiwiaWQiLCJmaW5kIiwiY29sbGVjdGlvbiIsImRlcHRoIiwib3ZlcnJpZGVBY2Nlc3MiLCJ3aGVyZSIsImVxdWFscyIsInRlbmFudERvY0lEIiwiY29uZmlnIiwicm91dGVzIiwiYWRtaW4iLCJlIiwibG9nZ2VyIiwiZXJyb3IiXSwibWFwcGluZ3MiOiJBQUVBLFNBQVNBLFVBQVUsUUFBUSxrQkFBaUI7QUFDNUMsU0FBU0MsaUJBQWlCLFFBQVEsa0NBQWlDO0FBQ25FLFNBQVNDLG1CQUFtQixRQUFRLDJCQUEwQjtBQUM5RCxTQUFTQyxtQkFBbUIsUUFBUSwyQkFBMEI7QUFhOUQsT0FBTyxlQUFlQyxzQkFBc0IsRUFDMUNDLElBQUksRUFDSkMsS0FBSyxFQUNMQyxPQUFPLEVBQ1BDLE9BQU8sRUFDUEMsZUFBZSxFQUNmQyxxQkFBcUIsRUFDckJDLFVBQVUsRUFDVkMsSUFBSSxFQUNKQyxJQUFJLEVBQ0M7SUFDTCxNQUFNQyxTQUFTWixvQkFBb0I7UUFDakNhLGdCQUFnQkw7UUFDaEJGO0lBQ0Y7SUFDQSxJQUFJUSxTQUFTYixvQkFBb0JJLFNBQVNPO0lBQzFDLElBQUlHO0lBRUosSUFBSSxDQUFDRCxVQUFVQSxXQUFXaEIsWUFBWTtRQUNwQyxNQUFNa0IsZUFBZSxNQUFNakIsa0JBQWtCO1lBQzNDa0IsT0FBTztZQUNQWDtZQUNBRTtZQUNBQztZQUNBQztRQUNGO1FBRUFJLFNBQVNFLGFBQWFFLElBQUksQ0FBQyxFQUFFLEVBQUVDLE1BQU07SUFDdkM7SUFFQSxJQUFJO1FBQ0YsTUFBTSxFQUFFRCxJQUFJLEVBQUUsR0FBRyxNQUFNWixRQUFRYyxJQUFJLENBQUM7WUFDbENDLFlBQVlsQjtZQUNabUIsT0FBTztZQUNQTCxPQUFPO1lBQ1BNLGdCQUFnQjtZQUNoQmI7WUFDQWMsT0FBTztnQkFDTCxDQUFDakIsZ0JBQWdCLEVBQUU7b0JBQ2pCa0IsUUFBUVg7Z0JBQ1Y7WUFDRjtRQUNGO1FBRUEsTUFBTVksY0FBY1IsTUFBTSxDQUFDLEVBQUUsRUFBRUM7UUFFL0IsSUFBSVIsU0FBUyxZQUFZO1lBQ3ZCLElBQUlQLFNBQVMsQ0FBQ3NCLGFBQWE7Z0JBQ3pCLGlHQUFpRztnQkFDakdYLGdCQUFnQixHQUFHVCxRQUFRcUIsTUFBTSxDQUFDQyxNQUFNLENBQUNDLEtBQUssQ0FBQyxhQUFhLEVBQUUxQixLQUFLLE9BQU8sQ0FBQztZQUM3RSxPQUFPLElBQUl1QixlQUFldEIsVUFBVXNCLGFBQWE7Z0JBQy9DLDBHQUEwRztnQkFDMUdYLGdCQUFnQixHQUFHVCxRQUFRcUIsTUFBTSxDQUFDQyxNQUFNLENBQUNDLEtBQUssQ0FBQyxhQUFhLEVBQUUxQixLQUFLLENBQUMsRUFBRXVCLGFBQWE7WUFDckY7UUFDRixPQUFPLElBQUlmLFNBQVMsUUFBUTtZQUMxQixJQUFJZSxhQUFhO2dCQUNmLGdEQUFnRDtnQkFDaERYLGdCQUFnQixHQUFHVCxRQUFRcUIsTUFBTSxDQUFDQyxNQUFNLENBQUNDLEtBQUssQ0FBQyxhQUFhLEVBQUUxQixLQUFLLENBQUMsRUFBRXVCLGFBQWE7WUFDckYsT0FBTztnQkFDTCwyREFBMkQ7Z0JBQzNEWCxnQkFBZ0IsR0FBR1QsUUFBUXFCLE1BQU0sQ0FBQ0MsTUFBTSxDQUFDQyxLQUFLLENBQUMsYUFBYSxFQUFFMUIsS0FBSyxPQUFPLENBQUM7WUFDN0U7UUFDRjtJQUNGLEVBQUUsT0FBTzJCLEdBQVk7UUFDbkJ4QixRQUFReUIsTUFBTSxDQUFDQyxLQUFLLENBQ2xCRixHQUNBLEdBQUcsT0FBT0EsTUFBTSxZQUFZQSxLQUFLLGFBQWFBLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxHQUFHLDJCQUEyQixDQUFDO0lBRXZHO0lBQ0EsT0FBT2Y7QUFDVCJ9