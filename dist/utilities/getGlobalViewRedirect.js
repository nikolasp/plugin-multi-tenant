import { SELECT_ALL } from "../constants";
import { findTenantOptions } from "../queries/findTenantOptions";
import { getCollectionIDType } from "./getCollectionIDType";
import { getTenantFromCookie } from "./getTenantFromCookie";
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsaXRpZXMvZ2V0R2xvYmFsVmlld1JlZGlyZWN0LnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB0eXBlIHsgUGF5bG9hZCwgVXNlciwgVmlld1R5cGVzIH0gZnJvbSAncGF5bG9hZCdcblxuaW1wb3J0IHsgU0VMRUNUX0FMTCB9IGZyb20gJy4uL2NvbnN0YW50cydcbmltcG9ydCB7IGZpbmRUZW5hbnRPcHRpb25zIH0gZnJvbSAnLi4vcXVlcmllcy9maW5kVGVuYW50T3B0aW9ucydcbmltcG9ydCB7IGdldENvbGxlY3Rpb25JRFR5cGUgfSBmcm9tICcuL2dldENvbGxlY3Rpb25JRFR5cGUnXG5pbXBvcnQgeyBnZXRUZW5hbnRGcm9tQ29va2llIH0gZnJvbSAnLi9nZXRUZW5hbnRGcm9tQ29va2llJ1xuaW1wb3J0IHsgVXNlcldpdGhUZW5hbnRzRmllbGQgfSBmcm9tICdAL3R5cGVzJ1xuXG50eXBlIEFyZ3MgPSB7XG4gIGRvY0lEPzogbnVtYmVyIHwgc3RyaW5nXG4gIGhlYWRlcnM6IEhlYWRlcnNcbiAgcGF5bG9hZDogUGF5bG9hZFxuICBzbHVnOiBzdHJpbmdcbiAgdGVuYW50RmllbGROYW1lOiBzdHJpbmdcbiAgdGVuYW50c0NvbGxlY3Rpb25TbHVnOiBzdHJpbmdcbiAgdXNlQXNUaXRsZTogc3RyaW5nXG4gIHVzZXI/OiBVc2VyV2l0aFRlbmFudHNGaWVsZFxuICB2aWV3OiBWaWV3VHlwZXNcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRHbG9iYWxWaWV3UmVkaXJlY3Qoe1xuICBzbHVnLFxuICBkb2NJRCxcbiAgaGVhZGVycyxcbiAgcGF5bG9hZCxcbiAgdGVuYW50RmllbGROYW1lLFxuICB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gIHVzZUFzVGl0bGUsXG4gIHVzZXIsXG4gIHZpZXcsXG59OiBBcmdzKTogUHJvbWlzZTxzdHJpbmcgfCB2b2lkPiB7XG4gIGNvbnN0IGlkVHlwZSA9IGdldENvbGxlY3Rpb25JRFR5cGUoe1xuICAgIGNvbGxlY3Rpb25TbHVnOiB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgcGF5bG9hZCxcbiAgfSlcbiAgbGV0IHRlbmFudCA9IGdldFRlbmFudEZyb21Db29raWUoaGVhZGVycywgaWRUeXBlKVxuICBsZXQgcmVkaXJlY3RSb3V0ZVxuXG4gIGlmICghdGVuYW50IHx8IHRlbmFudCA9PT0gU0VMRUNUX0FMTCkge1xuICAgIGNvbnN0IHRlbmFudHNRdWVyeSA9IGF3YWl0IGZpbmRUZW5hbnRPcHRpb25zKHtcbiAgICAgIGxpbWl0OiAxLFxuICAgICAgcGF5bG9hZCxcbiAgICAgIHRlbmFudHNDb2xsZWN0aW9uU2x1ZyxcbiAgICAgIHVzZUFzVGl0bGUsXG4gICAgICB1c2VyLFxuICAgIH0pXG5cbiAgICB0ZW5hbnQgPSB0ZW5hbnRzUXVlcnkuZG9jc1swXT8uaWQgfHwgbnVsbFxuICB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB7IGRvY3MgfSA9IGF3YWl0IHBheWxvYWQuZmluZCh7XG4gICAgICBjb2xsZWN0aW9uOiBzbHVnLFxuICAgICAgZGVwdGg6IDAsXG4gICAgICBsaW1pdDogMSxcbiAgICAgIG92ZXJyaWRlQWNjZXNzOiBmYWxzZSxcbiAgICAgIHVzZXIsXG4gICAgICB3aGVyZToge1xuICAgICAgICBbdGVuYW50RmllbGROYW1lXToge1xuICAgICAgICAgIGVxdWFsczogdGVuYW50LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgY29uc3QgdGVuYW50RG9jSUQgPSBkb2NzPy5bMF0/LmlkXG5cbiAgICBpZiAodmlldyA9PT0gJ2RvY3VtZW50Jykge1xuICAgICAgaWYgKGRvY0lEICYmICF0ZW5hbnREb2NJRCkge1xuICAgICAgICAvLyB2aWV3aW5nIGEgZG9jdW1lbnQgd2l0aCBhbiBpZCBidXQgZG9lcyBub3QgbWF0Y2ggdGhlIHNlbGVjdGVkIHRlbmFudCwgcmVkaXJlY3QgdG8gY3JlYXRlIHJvdXRlXG4gICAgICAgIHJlZGlyZWN0Um91dGUgPSBgJHtwYXlsb2FkLmNvbmZpZy5yb3V0ZXMuYWRtaW59L2NvbGxlY3Rpb25zLyR7c2x1Z30vY3JlYXRlYFxuICAgICAgfSBlbHNlIGlmICh0ZW5hbnREb2NJRCAmJiBkb2NJRCAhPT0gdGVuYW50RG9jSUQpIHtcbiAgICAgICAgLy8gdGVuYW50IGRvY3VtZW50IGFscmVhZHkgZXhpc3RzIGJ1dCBkb2VzIG5vdCBtYXRjaCBjdXJyZW50IHJvdXRlIGRvYyBJRCwgcmVkaXJlY3QgdG8gbWF0Y2hpbmcgdGVuYW50IGRvY1xuICAgICAgICByZWRpcmVjdFJvdXRlID0gYCR7cGF5bG9hZC5jb25maWcucm91dGVzLmFkbWlufS9jb2xsZWN0aW9ucy8ke3NsdWd9LyR7dGVuYW50RG9jSUR9YFxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAodmlldyA9PT0gJ2xpc3QnKSB7XG4gICAgICBpZiAodGVuYW50RG9jSUQpIHtcbiAgICAgICAgLy8gdGVuYW50IGRvY3VtZW50IGV4aXN0cywgcmVkaXJlY3QgdG8gZWRpdCB2aWV3XG4gICAgICAgIHJlZGlyZWN0Um91dGUgPSBgJHtwYXlsb2FkLmNvbmZpZy5yb3V0ZXMuYWRtaW59L2NvbGxlY3Rpb25zLyR7c2x1Z30vJHt0ZW5hbnREb2NJRH1gXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB0ZW5hbnQgZG9jdW1lbnQgZG9lcyBub3QgZXhpc3QsIHJlZGlyZWN0IHRvIGNyZWF0ZSByb3V0ZVxuICAgICAgICByZWRpcmVjdFJvdXRlID0gYCR7cGF5bG9hZC5jb25maWcucm91dGVzLmFkbWlufS9jb2xsZWN0aW9ucy8ke3NsdWd9L2NyZWF0ZWBcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGU6IHVua25vd24pIHtcbiAgICBwYXlsb2FkLmxvZ2dlci5lcnJvcihcbiAgICAgIGUsXG4gICAgICBgJHt0eXBlb2YgZSA9PT0gJ29iamVjdCcgJiYgZSAmJiAnbWVzc2FnZScgaW4gZSA/IGBlPy5tZXNzYWdlIC0gYCA6ICcnfU11bHRpIFRlbmFudCBSZWRpcmVjdCBFcnJvcmAsXG4gICAgKVxuICB9XG4gIHJldHVybiByZWRpcmVjdFJvdXRlXG59XG4iXSwibmFtZXMiOlsiU0VMRUNUX0FMTCIsImZpbmRUZW5hbnRPcHRpb25zIiwiZ2V0Q29sbGVjdGlvbklEVHlwZSIsImdldFRlbmFudEZyb21Db29raWUiLCJnZXRHbG9iYWxWaWV3UmVkaXJlY3QiLCJzbHVnIiwiZG9jSUQiLCJoZWFkZXJzIiwicGF5bG9hZCIsInRlbmFudEZpZWxkTmFtZSIsInRlbmFudHNDb2xsZWN0aW9uU2x1ZyIsInVzZUFzVGl0bGUiLCJ1c2VyIiwidmlldyIsImlkVHlwZSIsImNvbGxlY3Rpb25TbHVnIiwidGVuYW50IiwicmVkaXJlY3RSb3V0ZSIsInRlbmFudHNRdWVyeSIsImxpbWl0IiwiZG9jcyIsImlkIiwiZmluZCIsImNvbGxlY3Rpb24iLCJkZXB0aCIsIm92ZXJyaWRlQWNjZXNzIiwid2hlcmUiLCJlcXVhbHMiLCJ0ZW5hbnREb2NJRCIsImNvbmZpZyIsInJvdXRlcyIsImFkbWluIiwiZSIsImxvZ2dlciIsImVycm9yIl0sIm1hcHBpbmdzIjoiQUFFQSxTQUFTQSxVQUFVLFFBQVEsZUFBYztBQUN6QyxTQUFTQyxpQkFBaUIsUUFBUSwrQkFBOEI7QUFDaEUsU0FBU0MsbUJBQW1CLFFBQVEsd0JBQXVCO0FBQzNELFNBQVNDLG1CQUFtQixRQUFRLHdCQUF1QjtBQWMzRCxPQUFPLGVBQWVDLHNCQUFzQixFQUMxQ0MsSUFBSSxFQUNKQyxLQUFLLEVBQ0xDLE9BQU8sRUFDUEMsT0FBTyxFQUNQQyxlQUFlLEVBQ2ZDLHFCQUFxQixFQUNyQkMsVUFBVSxFQUNWQyxJQUFJLEVBQ0pDLElBQUksRUFDQztJQUNMLE1BQU1DLFNBQVNaLG9CQUFvQjtRQUNqQ2EsZ0JBQWdCTDtRQUNoQkY7SUFDRjtJQUNBLElBQUlRLFNBQVNiLG9CQUFvQkksU0FBU087SUFDMUMsSUFBSUc7SUFFSixJQUFJLENBQUNELFVBQVVBLFdBQVdoQixZQUFZO1FBQ3BDLE1BQU1rQixlQUFlLE1BQU1qQixrQkFBa0I7WUFDM0NrQixPQUFPO1lBQ1BYO1lBQ0FFO1lBQ0FDO1lBQ0FDO1FBQ0Y7UUFFQUksU0FBU0UsYUFBYUUsSUFBSSxDQUFDLEVBQUUsRUFBRUMsTUFBTTtJQUN2QztJQUVBLElBQUk7UUFDRixNQUFNLEVBQUVELElBQUksRUFBRSxHQUFHLE1BQU1aLFFBQVFjLElBQUksQ0FBQztZQUNsQ0MsWUFBWWxCO1lBQ1ptQixPQUFPO1lBQ1BMLE9BQU87WUFDUE0sZ0JBQWdCO1lBQ2hCYjtZQUNBYyxPQUFPO2dCQUNMLENBQUNqQixnQkFBZ0IsRUFBRTtvQkFDakJrQixRQUFRWDtnQkFDVjtZQUNGO1FBQ0Y7UUFFQSxNQUFNWSxjQUFjUixNQUFNLENBQUMsRUFBRSxFQUFFQztRQUUvQixJQUFJUixTQUFTLFlBQVk7WUFDdkIsSUFBSVAsU0FBUyxDQUFDc0IsYUFBYTtnQkFDekIsaUdBQWlHO2dCQUNqR1gsZ0JBQWdCLEdBQUdULFFBQVFxQixNQUFNLENBQUNDLE1BQU0sQ0FBQ0MsS0FBSyxDQUFDLGFBQWEsRUFBRTFCLEtBQUssT0FBTyxDQUFDO1lBQzdFLE9BQU8sSUFBSXVCLGVBQWV0QixVQUFVc0IsYUFBYTtnQkFDL0MsMEdBQTBHO2dCQUMxR1gsZ0JBQWdCLEdBQUdULFFBQVFxQixNQUFNLENBQUNDLE1BQU0sQ0FBQ0MsS0FBSyxDQUFDLGFBQWEsRUFBRTFCLEtBQUssQ0FBQyxFQUFFdUIsYUFBYTtZQUNyRjtRQUNGLE9BQU8sSUFBSWYsU0FBUyxRQUFRO1lBQzFCLElBQUllLGFBQWE7Z0JBQ2YsZ0RBQWdEO2dCQUNoRFgsZ0JBQWdCLEdBQUdULFFBQVFxQixNQUFNLENBQUNDLE1BQU0sQ0FBQ0MsS0FBSyxDQUFDLGFBQWEsRUFBRTFCLEtBQUssQ0FBQyxFQUFFdUIsYUFBYTtZQUNyRixPQUFPO2dCQUNMLDJEQUEyRDtnQkFDM0RYLGdCQUFnQixHQUFHVCxRQUFRcUIsTUFBTSxDQUFDQyxNQUFNLENBQUNDLEtBQUssQ0FBQyxhQUFhLEVBQUUxQixLQUFLLE9BQU8sQ0FBQztZQUM3RTtRQUNGO0lBQ0YsRUFBRSxPQUFPMkIsR0FBWTtRQUNuQnhCLFFBQVF5QixNQUFNLENBQUNDLEtBQUssQ0FDbEJGLEdBQ0EsR0FBRyxPQUFPQSxNQUFNLFlBQVlBLEtBQUssYUFBYUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEdBQUcsMkJBQTJCLENBQUM7SUFFdkc7SUFDQSxPQUFPZjtBQUNUIn0=