import { defaults } from "./defaults.js";
import { tenantField } from "./fields/tenantField";
import { tenantsArrayField } from "./fields/tenantsArrayField";
import { addTenantCleanup } from "./hooks/afterTenantDelete.js";
import { addCollectionAccess } from "./utilities/addCollectionAccess.js";
import { addFilterOptionsToFields } from "./utilities/addFilterOptionsToFields.js";
import { withTenantListFilter } from "./utilities/withTenantListFilter.js";
export const multiTenantPlugin = (pluginConfig)=>(incomingConfig)=>{
        if (pluginConfig.enabled === false) {
            return incomingConfig;
        }
        /**
     * Set defaults
     */ const userHasAccessToAllTenants = typeof pluginConfig.userHasAccessToAllTenants === 'function' ? pluginConfig.userHasAccessToAllTenants : ()=>false;
        const tenantsCollectionSlug = pluginConfig.tenantsSlug = pluginConfig.tenantsSlug || defaults.tenantCollectionSlug;
        const tenantFieldName = pluginConfig?.tenantField?.name || defaults.tenantFieldName;
        const tenantsArrayFieldName = pluginConfig?.tenantsArrayField?.arrayFieldName || defaults.tenantsArrayFieldName;
        const tenantsArrayTenantFieldName = pluginConfig?.tenantsArrayField?.arrayTenantFieldName || defaults.tenantsArrayTenantFieldName;
        /**
     * Add defaults for admin properties
     */ if (!incomingConfig.admin) {
            incomingConfig.admin = {};
        }
        if (!incomingConfig.admin?.components) {
            incomingConfig.admin.components = {
                actions: [],
                beforeNavLinks: [],
                providers: []
            };
        }
        if (!incomingConfig.admin.components?.providers) {
            incomingConfig.admin.components.providers = [];
        }
        if (!incomingConfig.admin.components?.actions) {
            incomingConfig.admin.components.actions = [];
        }
        if (!incomingConfig.admin.components?.beforeNavLinks) {
            incomingConfig.admin.components.beforeNavLinks = [];
        }
        if (!incomingConfig.collections) {
            incomingConfig.collections = [];
        }
        /**
     * Add tenants array field to users collection
     */ const adminUsersCollection = incomingConfig.collections.find(({ slug, auth })=>{
            if (incomingConfig.admin?.user) {
                return slug === incomingConfig.admin.user;
            } else if (auth) {
                return true;
            }
        });
        if (!adminUsersCollection) {
            throw Error('An auth enabled collection was not found');
        }
        /**
     * Add tenants array field to users collection
     */ if (pluginConfig?.tenantsArrayField?.includeDefaultField !== false) {
            adminUsersCollection.fields.push(tenantsArrayField({
                ...pluginConfig?.tenantsArrayField || {},
                tenantsArrayFieldName,
                tenantsArrayTenantFieldName,
                tenantsCollectionSlug
            }));
        }
        addCollectionAccess({
            collection: adminUsersCollection,
            fieldName: `${tenantsArrayFieldName}.${tenantsArrayTenantFieldName}`,
            userHasAccessToAllTenants
        });
        let tenantCollection;
        const [collectionSlugs, globalCollectionSlugs] = Object.keys(pluginConfig.collections).reduce((acc, slug)=>{
            if (pluginConfig?.collections?.[slug]?.isGlobal) {
                acc[1].push(slug);
            } else {
                acc[0].push(slug);
            }
            return acc;
        }, [
            [],
            []
        ]);
        /**
     * Modify collections
     */ incomingConfig.collections.forEach((collection)=>{
            /**
       * Modify tenants collection
       */ if (collection.slug === tenantsCollectionSlug) {
                tenantCollection = collection;
                if (pluginConfig.useTenantsCollectionAccess !== false) {
                    /**
           * Add access control constraint to tenants collection
           * - constrains access a users assigned tenants
           */ addCollectionAccess({
                        collection,
                        fieldName: 'id',
                        userHasAccessToAllTenants
                    });
                }
                if (pluginConfig.cleanupAfterTenantDelete !== false) {
                    /**
           * Add cleanup logic when tenant is deleted
           * - delete documents related to tenant
           * - remove tenant from users
           */ addTenantCleanup({
                        collection,
                        enabledSlugs: [
                            ...collectionSlugs,
                            ...globalCollectionSlugs
                        ],
                        tenantFieldName,
                        tenantsCollectionSlug,
                        usersSlug: adminUsersCollection.slug,
                        usersTenantsArrayFieldName: tenantsArrayFieldName,
                        usersTenantsArrayTenantFieldName: tenantsArrayTenantFieldName
                    });
                }
            } else if (pluginConfig.collections?.[collection.slug]) {
                const isGlobal = Boolean(pluginConfig.collections[collection.slug]?.isGlobal);
                if (isGlobal) {
                    collection.disableDuplicate = true;
                }
                /**
         * Modify enabled collections
         */ addFilterOptionsToFields({
                    fields: collection.fields,
                    tenantEnabledCollectionSlugs: collectionSlugs,
                    tenantEnabledGlobalSlugs: globalCollectionSlugs,
                    tenantFieldName,
                    tenantsCollectionSlug
                });
                /**
         * Add tenant field to enabled collections
         */ collection.fields.splice(0, 0, tenantField({
                    ...pluginConfig?.tenantField || {},
                    name: tenantFieldName,
                    debug: pluginConfig.debug,
                    tenantsCollectionSlug,
                    unique: isGlobal
                }));
                if (pluginConfig.collections[collection.slug]?.useBaseListFilter !== false) {
                    /**
           * Collection baseListFilter with selected tenant constraint (if selected)
           */ if (!collection.admin) {
                        collection.admin = {};
                    }
                    collection.admin.baseListFilter = withTenantListFilter({
                        baseListFilter: collection.admin?.baseListFilter,
                        tenantFieldName,
                        tenantsCollectionSlug
                    });
                }
                if (pluginConfig.collections[collection.slug]?.useTenantAccess !== false) {
                    /**
           * Add access control constraint to tenant enabled collection
           */ addCollectionAccess({
                        collection,
                        fieldName: tenantFieldName,
                        userHasAccessToAllTenants
                    });
                }
            }
        });
        if (!tenantCollection) {
            throw new Error(`Tenants collection not found with slug: ${tenantsCollectionSlug}`);
        }
        /**
     * Add TenantSelectionProvider to admin providers
     */ incomingConfig.admin.components.providers.push({
            clientProps: {
                tenantsCollectionSlug: tenantCollection.slug,
                useAsTitle: tenantCollection.admin?.useAsTitle || 'id'
            },
            path: '@payloadcms/plugin-multi-tenant/rsc#TenantSelectionProvider'
        });
        /**
     * Add global redirect action
     */ if (globalCollectionSlugs.length) {
            incomingConfig.admin.components.actions.push({
                path: '@payloadcms/plugin-multi-tenant/rsc#GlobalViewRedirect',
                serverProps: {
                    globalSlugs: globalCollectionSlugs,
                    tenantFieldName,
                    tenantsCollectionSlug,
                    useAsTitle: tenantCollection.admin?.useAsTitle || 'id'
                }
            });
        }
        /**
     * Add tenant selector to admin UI
     */ incomingConfig.admin.components.beforeNavLinks.push({
            path: '@payloadcms/plugin-multi-tenant/client#TenantSelector'
        });
        return incomingConfig;
    };

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IENvbGxlY3Rpb25Db25maWcsIENvbmZpZyB9IGZyb20gJ3BheWxvYWQnXG5cbmltcG9ydCB0eXBlIHsgTXVsdGlUZW5hbnRQbHVnaW5Db25maWcgfSBmcm9tICcuL3R5cGVzLmpzJ1xuXG5pbXBvcnQgeyBkZWZhdWx0cyB9IGZyb20gJy4vZGVmYXVsdHMuanMnXG5pbXBvcnQgeyB0ZW5hbnRGaWVsZCB9IGZyb20gJy4vZmllbGRzL3RlbmFudEZpZWxkL2luZGV4LmpzJ1xuaW1wb3J0IHsgdGVuYW50c0FycmF5RmllbGQgfSBmcm9tICcuL2ZpZWxkcy90ZW5hbnRzQXJyYXlGaWVsZC9pbmRleC5qcydcbmltcG9ydCB7IGFkZFRlbmFudENsZWFudXAgfSBmcm9tICcuL2hvb2tzL2FmdGVyVGVuYW50RGVsZXRlLmpzJ1xuaW1wb3J0IHsgYWRkQ29sbGVjdGlvbkFjY2VzcyB9IGZyb20gJy4vdXRpbGl0aWVzL2FkZENvbGxlY3Rpb25BY2Nlc3MuanMnXG5pbXBvcnQgeyBhZGRGaWx0ZXJPcHRpb25zVG9GaWVsZHMgfSBmcm9tICcuL3V0aWxpdGllcy9hZGRGaWx0ZXJPcHRpb25zVG9GaWVsZHMuanMnXG5pbXBvcnQgeyB3aXRoVGVuYW50TGlzdEZpbHRlciB9IGZyb20gJy4vdXRpbGl0aWVzL3dpdGhUZW5hbnRMaXN0RmlsdGVyLmpzJ1xuXG5leHBvcnQgY29uc3QgbXVsdGlUZW5hbnRQbHVnaW4gPVxuICA8Q29uZmlnVHlwZT4ocGx1Z2luQ29uZmlnOiBNdWx0aVRlbmFudFBsdWdpbkNvbmZpZzxDb25maWdUeXBlPikgPT5cbiAgKGluY29taW5nQ29uZmlnOiBDb25maWcpOiBDb25maWcgPT4ge1xuICAgIGlmIChwbHVnaW5Db25maWcuZW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBpbmNvbWluZ0NvbmZpZ1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBkZWZhdWx0c1xuICAgICAqL1xuICAgIGNvbnN0IHVzZXJIYXNBY2Nlc3NUb0FsbFRlbmFudHM6IFJlcXVpcmVkPFxuICAgICAgTXVsdGlUZW5hbnRQbHVnaW5Db25maWc8Q29uZmlnVHlwZT5cbiAgICA+Wyd1c2VySGFzQWNjZXNzVG9BbGxUZW5hbnRzJ10gPVxuICAgICAgdHlwZW9mIHBsdWdpbkNvbmZpZy51c2VySGFzQWNjZXNzVG9BbGxUZW5hbnRzID09PSAnZnVuY3Rpb24nXG4gICAgICAgID8gcGx1Z2luQ29uZmlnLnVzZXJIYXNBY2Nlc3NUb0FsbFRlbmFudHNcbiAgICAgICAgOiAoKSA9PiBmYWxzZVxuICAgIGNvbnN0IHRlbmFudHNDb2xsZWN0aW9uU2x1ZyA9IChwbHVnaW5Db25maWcudGVuYW50c1NsdWcgPVxuICAgICAgcGx1Z2luQ29uZmlnLnRlbmFudHNTbHVnIHx8IGRlZmF1bHRzLnRlbmFudENvbGxlY3Rpb25TbHVnKVxuICAgIGNvbnN0IHRlbmFudEZpZWxkTmFtZSA9IHBsdWdpbkNvbmZpZz8udGVuYW50RmllbGQ/Lm5hbWUgfHwgZGVmYXVsdHMudGVuYW50RmllbGROYW1lXG4gICAgY29uc3QgdGVuYW50c0FycmF5RmllbGROYW1lID1cbiAgICAgIHBsdWdpbkNvbmZpZz8udGVuYW50c0FycmF5RmllbGQ/LmFycmF5RmllbGROYW1lIHx8IGRlZmF1bHRzLnRlbmFudHNBcnJheUZpZWxkTmFtZVxuICAgIGNvbnN0IHRlbmFudHNBcnJheVRlbmFudEZpZWxkTmFtZSA9XG4gICAgICBwbHVnaW5Db25maWc/LnRlbmFudHNBcnJheUZpZWxkPy5hcnJheVRlbmFudEZpZWxkTmFtZSB8fCBkZWZhdWx0cy50ZW5hbnRzQXJyYXlUZW5hbnRGaWVsZE5hbWVcblxuICAgIC8qKlxuICAgICAqIEFkZCBkZWZhdWx0cyBmb3IgYWRtaW4gcHJvcGVydGllc1xuICAgICAqL1xuICAgIGlmICghaW5jb21pbmdDb25maWcuYWRtaW4pIHtcbiAgICAgIGluY29taW5nQ29uZmlnLmFkbWluID0ge31cbiAgICB9XG4gICAgaWYgKCFpbmNvbWluZ0NvbmZpZy5hZG1pbj8uY29tcG9uZW50cykge1xuICAgICAgaW5jb21pbmdDb25maWcuYWRtaW4uY29tcG9uZW50cyA9IHtcbiAgICAgICAgYWN0aW9uczogW10sXG4gICAgICAgIGJlZm9yZU5hdkxpbmtzOiBbXSxcbiAgICAgICAgcHJvdmlkZXJzOiBbXSxcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFpbmNvbWluZ0NvbmZpZy5hZG1pbi5jb21wb25lbnRzPy5wcm92aWRlcnMpIHtcbiAgICAgIGluY29taW5nQ29uZmlnLmFkbWluLmNvbXBvbmVudHMucHJvdmlkZXJzID0gW11cbiAgICB9XG4gICAgaWYgKCFpbmNvbWluZ0NvbmZpZy5hZG1pbi5jb21wb25lbnRzPy5hY3Rpb25zKSB7XG4gICAgICBpbmNvbWluZ0NvbmZpZy5hZG1pbi5jb21wb25lbnRzLmFjdGlvbnMgPSBbXVxuICAgIH1cbiAgICBpZiAoIWluY29taW5nQ29uZmlnLmFkbWluLmNvbXBvbmVudHM/LmJlZm9yZU5hdkxpbmtzKSB7XG4gICAgICBpbmNvbWluZ0NvbmZpZy5hZG1pbi5jb21wb25lbnRzLmJlZm9yZU5hdkxpbmtzID0gW11cbiAgICB9XG4gICAgaWYgKCFpbmNvbWluZ0NvbmZpZy5jb2xsZWN0aW9ucykge1xuICAgICAgaW5jb21pbmdDb25maWcuY29sbGVjdGlvbnMgPSBbXVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCB0ZW5hbnRzIGFycmF5IGZpZWxkIHRvIHVzZXJzIGNvbGxlY3Rpb25cbiAgICAgKi9cbiAgICBjb25zdCBhZG1pblVzZXJzQ29sbGVjdGlvbiA9IGluY29taW5nQ29uZmlnLmNvbGxlY3Rpb25zLmZpbmQoKHsgc2x1ZywgYXV0aCB9KSA9PiB7XG4gICAgICBpZiAoaW5jb21pbmdDb25maWcuYWRtaW4/LnVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHNsdWcgPT09IGluY29taW5nQ29uZmlnLmFkbWluLnVzZXJcbiAgICAgIH0gZWxzZSBpZiAoYXV0aCkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAoIWFkbWluVXNlcnNDb2xsZWN0aW9uKSB7XG4gICAgICB0aHJvdyBFcnJvcignQW4gYXV0aCBlbmFibGVkIGNvbGxlY3Rpb24gd2FzIG5vdCBmb3VuZCcpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHRlbmFudHMgYXJyYXkgZmllbGQgdG8gdXNlcnMgY29sbGVjdGlvblxuICAgICAqL1xuICAgIGlmIChwbHVnaW5Db25maWc/LnRlbmFudHNBcnJheUZpZWxkPy5pbmNsdWRlRGVmYXVsdEZpZWxkICE9PSBmYWxzZSkge1xuICAgICAgYWRtaW5Vc2Vyc0NvbGxlY3Rpb24uZmllbGRzLnB1c2goXG4gICAgICAgIHRlbmFudHNBcnJheUZpZWxkKHtcbiAgICAgICAgICAuLi4ocGx1Z2luQ29uZmlnPy50ZW5hbnRzQXJyYXlGaWVsZCB8fCB7fSksXG4gICAgICAgICAgdGVuYW50c0FycmF5RmllbGROYW1lLFxuICAgICAgICAgIHRlbmFudHNBcnJheVRlbmFudEZpZWxkTmFtZSxcbiAgICAgICAgICB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH1cblxuICAgIGFkZENvbGxlY3Rpb25BY2Nlc3Moe1xuICAgICAgY29sbGVjdGlvbjogYWRtaW5Vc2Vyc0NvbGxlY3Rpb24sXG4gICAgICBmaWVsZE5hbWU6IGAke3RlbmFudHNBcnJheUZpZWxkTmFtZX0uJHt0ZW5hbnRzQXJyYXlUZW5hbnRGaWVsZE5hbWV9YCxcbiAgICAgIHVzZXJIYXNBY2Nlc3NUb0FsbFRlbmFudHMsXG4gICAgfSlcblxuICAgIGxldCB0ZW5hbnRDb2xsZWN0aW9uOiBDb2xsZWN0aW9uQ29uZmlnIHwgdW5kZWZpbmVkXG5cbiAgICBjb25zdCBbY29sbGVjdGlvblNsdWdzLCBnbG9iYWxDb2xsZWN0aW9uU2x1Z3NdID0gT2JqZWN0LmtleXMocGx1Z2luQ29uZmlnLmNvbGxlY3Rpb25zKS5yZWR1Y2U8XG4gICAgICBbc3RyaW5nW10sIHN0cmluZ1tdXVxuICAgID4oXG4gICAgICAoYWNjLCBzbHVnKSA9PiB7XG4gICAgICAgIGlmIChwbHVnaW5Db25maWc/LmNvbGxlY3Rpb25zPy5bc2x1Z10/LmlzR2xvYmFsKSB7XG4gICAgICAgICAgYWNjWzFdLnB1c2goc2x1ZylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhY2NbMF0ucHVzaChzbHVnKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgfSxcbiAgICAgIFtbXSwgW11dLFxuICAgIClcblxuICAgIC8qKlxuICAgICAqIE1vZGlmeSBjb2xsZWN0aW9uc1xuICAgICAqL1xuICAgIGluY29taW5nQ29uZmlnLmNvbGxlY3Rpb25zLmZvckVhY2goKGNvbGxlY3Rpb24pID0+IHtcbiAgICAgIC8qKlxuICAgICAgICogTW9kaWZ5IHRlbmFudHMgY29sbGVjdGlvblxuICAgICAgICovXG4gICAgICBpZiAoY29sbGVjdGlvbi5zbHVnID09PSB0ZW5hbnRzQ29sbGVjdGlvblNsdWcpIHtcbiAgICAgICAgdGVuYW50Q29sbGVjdGlvbiA9IGNvbGxlY3Rpb25cblxuICAgICAgICBpZiAocGx1Z2luQ29uZmlnLnVzZVRlbmFudHNDb2xsZWN0aW9uQWNjZXNzICE9PSBmYWxzZSkge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEFkZCBhY2Nlc3MgY29udHJvbCBjb25zdHJhaW50IHRvIHRlbmFudHMgY29sbGVjdGlvblxuICAgICAgICAgICAqIC0gY29uc3RyYWlucyBhY2Nlc3MgYSB1c2VycyBhc3NpZ25lZCB0ZW5hbnRzXG4gICAgICAgICAgICovXG4gICAgICAgICAgYWRkQ29sbGVjdGlvbkFjY2Vzcyh7XG4gICAgICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICAgICAgZmllbGROYW1lOiAnaWQnLFxuICAgICAgICAgICAgdXNlckhhc0FjY2Vzc1RvQWxsVGVuYW50cyxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBsdWdpbkNvbmZpZy5jbGVhbnVwQWZ0ZXJUZW5hbnREZWxldGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQWRkIGNsZWFudXAgbG9naWMgd2hlbiB0ZW5hbnQgaXMgZGVsZXRlZFxuICAgICAgICAgICAqIC0gZGVsZXRlIGRvY3VtZW50cyByZWxhdGVkIHRvIHRlbmFudFxuICAgICAgICAgICAqIC0gcmVtb3ZlIHRlbmFudCBmcm9tIHVzZXJzXG4gICAgICAgICAgICovXG4gICAgICAgICAgYWRkVGVuYW50Q2xlYW51cCh7XG4gICAgICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICAgICAgZW5hYmxlZFNsdWdzOiBbLi4uY29sbGVjdGlvblNsdWdzLCAuLi5nbG9iYWxDb2xsZWN0aW9uU2x1Z3NdLFxuICAgICAgICAgICAgdGVuYW50RmllbGROYW1lLFxuICAgICAgICAgICAgdGVuYW50c0NvbGxlY3Rpb25TbHVnLFxuICAgICAgICAgICAgdXNlcnNTbHVnOiBhZG1pblVzZXJzQ29sbGVjdGlvbi5zbHVnLFxuICAgICAgICAgICAgdXNlcnNUZW5hbnRzQXJyYXlGaWVsZE5hbWU6IHRlbmFudHNBcnJheUZpZWxkTmFtZSxcbiAgICAgICAgICAgIHVzZXJzVGVuYW50c0FycmF5VGVuYW50RmllbGROYW1lOiB0ZW5hbnRzQXJyYXlUZW5hbnRGaWVsZE5hbWUsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwbHVnaW5Db25maWcuY29sbGVjdGlvbnM/Lltjb2xsZWN0aW9uLnNsdWddKSB7XG4gICAgICAgIGNvbnN0IGlzR2xvYmFsID0gQm9vbGVhbihwbHVnaW5Db25maWcuY29sbGVjdGlvbnNbY29sbGVjdGlvbi5zbHVnXT8uaXNHbG9iYWwpXG5cbiAgICAgICAgaWYgKGlzR2xvYmFsKSB7XG4gICAgICAgICAgY29sbGVjdGlvbi5kaXNhYmxlRHVwbGljYXRlID0gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZGlmeSBlbmFibGVkIGNvbGxlY3Rpb25zXG4gICAgICAgICAqL1xuICAgICAgICBhZGRGaWx0ZXJPcHRpb25zVG9GaWVsZHMoe1xuICAgICAgICAgIGZpZWxkczogY29sbGVjdGlvbi5maWVsZHMsXG4gICAgICAgICAgdGVuYW50RW5hYmxlZENvbGxlY3Rpb25TbHVnczogY29sbGVjdGlvblNsdWdzLFxuICAgICAgICAgIHRlbmFudEVuYWJsZWRHbG9iYWxTbHVnczogZ2xvYmFsQ29sbGVjdGlvblNsdWdzLFxuICAgICAgICAgIHRlbmFudEZpZWxkTmFtZSxcbiAgICAgICAgICB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgICAgIH0pXG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEFkZCB0ZW5hbnQgZmllbGQgdG8gZW5hYmxlZCBjb2xsZWN0aW9uc1xuICAgICAgICAgKi9cbiAgICAgICAgY29sbGVjdGlvbi5maWVsZHMuc3BsaWNlKFxuICAgICAgICAgIDAsXG4gICAgICAgICAgMCxcbiAgICAgICAgICB0ZW5hbnRGaWVsZCh7XG4gICAgICAgICAgICAuLi4ocGx1Z2luQ29uZmlnPy50ZW5hbnRGaWVsZCB8fCB7fSksXG4gICAgICAgICAgICBuYW1lOiB0ZW5hbnRGaWVsZE5hbWUsXG4gICAgICAgICAgICBkZWJ1ZzogcGx1Z2luQ29uZmlnLmRlYnVnLFxuICAgICAgICAgICAgdGVuYW50c0NvbGxlY3Rpb25TbHVnLFxuICAgICAgICAgICAgdW5pcXVlOiBpc0dsb2JhbCxcbiAgICAgICAgICB9KSxcbiAgICAgICAgKVxuXG4gICAgICAgIGlmIChwbHVnaW5Db25maWcuY29sbGVjdGlvbnNbY29sbGVjdGlvbi5zbHVnXT8udXNlQmFzZUxpc3RGaWx0ZXIgIT09IGZhbHNlKSB7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQ29sbGVjdGlvbiBiYXNlTGlzdEZpbHRlciB3aXRoIHNlbGVjdGVkIHRlbmFudCBjb25zdHJhaW50IChpZiBzZWxlY3RlZClcbiAgICAgICAgICAgKi9cbiAgICAgICAgICBpZiAoIWNvbGxlY3Rpb24uYWRtaW4pIHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb24uYWRtaW4gPSB7fVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb2xsZWN0aW9uLmFkbWluLmJhc2VMaXN0RmlsdGVyID0gd2l0aFRlbmFudExpc3RGaWx0ZXIoe1xuICAgICAgICAgICAgYmFzZUxpc3RGaWx0ZXI6IGNvbGxlY3Rpb24uYWRtaW4/LmJhc2VMaXN0RmlsdGVyLFxuICAgICAgICAgICAgdGVuYW50RmllbGROYW1lLFxuICAgICAgICAgICAgdGVuYW50c0NvbGxlY3Rpb25TbHVnLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICBpZiAocGx1Z2luQ29uZmlnLmNvbGxlY3Rpb25zW2NvbGxlY3Rpb24uc2x1Z10/LnVzZVRlbmFudEFjY2VzcyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBBZGQgYWNjZXNzIGNvbnRyb2wgY29uc3RyYWludCB0byB0ZW5hbnQgZW5hYmxlZCBjb2xsZWN0aW9uXG4gICAgICAgICAgICovXG4gICAgICAgICAgYWRkQ29sbGVjdGlvbkFjY2Vzcyh7XG4gICAgICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICAgICAgZmllbGROYW1lOiB0ZW5hbnRGaWVsZE5hbWUsXG4gICAgICAgICAgICB1c2VySGFzQWNjZXNzVG9BbGxUZW5hbnRzLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuXG4gICAgaWYgKCF0ZW5hbnRDb2xsZWN0aW9uKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRlbmFudHMgY29sbGVjdGlvbiBub3QgZm91bmQgd2l0aCBzbHVnOiAke3RlbmFudHNDb2xsZWN0aW9uU2x1Z31gKVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBUZW5hbnRTZWxlY3Rpb25Qcm92aWRlciB0byBhZG1pbiBwcm92aWRlcnNcbiAgICAgKi9cbiAgICBpbmNvbWluZ0NvbmZpZy5hZG1pbi5jb21wb25lbnRzLnByb3ZpZGVycy5wdXNoKHtcbiAgICAgIGNsaWVudFByb3BzOiB7XG4gICAgICAgIHRlbmFudHNDb2xsZWN0aW9uU2x1ZzogdGVuYW50Q29sbGVjdGlvbi5zbHVnLFxuICAgICAgICB1c2VBc1RpdGxlOiB0ZW5hbnRDb2xsZWN0aW9uLmFkbWluPy51c2VBc1RpdGxlIHx8ICdpZCcsXG4gICAgICB9LFxuICAgICAgcGF0aDogJ0BwYXlsb2FkY21zL3BsdWdpbi1tdWx0aS10ZW5hbnQvcnNjI1RlbmFudFNlbGVjdGlvblByb3ZpZGVyJyxcbiAgICB9KVxuXG4gICAgLyoqXG4gICAgICogQWRkIGdsb2JhbCByZWRpcmVjdCBhY3Rpb25cbiAgICAgKi9cbiAgICBpZiAoZ2xvYmFsQ29sbGVjdGlvblNsdWdzLmxlbmd0aCkge1xuICAgICAgaW5jb21pbmdDb25maWcuYWRtaW4uY29tcG9uZW50cy5hY3Rpb25zLnB1c2goe1xuICAgICAgICBwYXRoOiAnQHBheWxvYWRjbXMvcGx1Z2luLW11bHRpLXRlbmFudC9yc2MjR2xvYmFsVmlld1JlZGlyZWN0JyxcbiAgICAgICAgc2VydmVyUHJvcHM6IHtcbiAgICAgICAgICBnbG9iYWxTbHVnczogZ2xvYmFsQ29sbGVjdGlvblNsdWdzLFxuICAgICAgICAgIHRlbmFudEZpZWxkTmFtZSxcbiAgICAgICAgICB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgICAgICAgdXNlQXNUaXRsZTogdGVuYW50Q29sbGVjdGlvbi5hZG1pbj8udXNlQXNUaXRsZSB8fCAnaWQnLFxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBZGQgdGVuYW50IHNlbGVjdG9yIHRvIGFkbWluIFVJXG4gICAgICovXG4gICAgaW5jb21pbmdDb25maWcuYWRtaW4uY29tcG9uZW50cy5iZWZvcmVOYXZMaW5rcy5wdXNoKHtcbiAgICAgIHBhdGg6ICdAcGF5bG9hZGNtcy9wbHVnaW4tbXVsdGktdGVuYW50L2NsaWVudCNUZW5hbnRTZWxlY3RvcicsXG4gICAgfSlcblxuICAgIHJldHVybiBpbmNvbWluZ0NvbmZpZ1xuICB9XG4iXSwibmFtZXMiOlsiZGVmYXVsdHMiLCJ0ZW5hbnRGaWVsZCIsInRlbmFudHNBcnJheUZpZWxkIiwiYWRkVGVuYW50Q2xlYW51cCIsImFkZENvbGxlY3Rpb25BY2Nlc3MiLCJhZGRGaWx0ZXJPcHRpb25zVG9GaWVsZHMiLCJ3aXRoVGVuYW50TGlzdEZpbHRlciIsIm11bHRpVGVuYW50UGx1Z2luIiwicGx1Z2luQ29uZmlnIiwiaW5jb21pbmdDb25maWciLCJlbmFibGVkIiwidXNlckhhc0FjY2Vzc1RvQWxsVGVuYW50cyIsInRlbmFudHNDb2xsZWN0aW9uU2x1ZyIsInRlbmFudHNTbHVnIiwidGVuYW50Q29sbGVjdGlvblNsdWciLCJ0ZW5hbnRGaWVsZE5hbWUiLCJuYW1lIiwidGVuYW50c0FycmF5RmllbGROYW1lIiwiYXJyYXlGaWVsZE5hbWUiLCJ0ZW5hbnRzQXJyYXlUZW5hbnRGaWVsZE5hbWUiLCJhcnJheVRlbmFudEZpZWxkTmFtZSIsImFkbWluIiwiY29tcG9uZW50cyIsImFjdGlvbnMiLCJiZWZvcmVOYXZMaW5rcyIsInByb3ZpZGVycyIsImNvbGxlY3Rpb25zIiwiYWRtaW5Vc2Vyc0NvbGxlY3Rpb24iLCJmaW5kIiwic2x1ZyIsImF1dGgiLCJ1c2VyIiwiRXJyb3IiLCJpbmNsdWRlRGVmYXVsdEZpZWxkIiwiZmllbGRzIiwicHVzaCIsImNvbGxlY3Rpb24iLCJmaWVsZE5hbWUiLCJ0ZW5hbnRDb2xsZWN0aW9uIiwiY29sbGVjdGlvblNsdWdzIiwiZ2xvYmFsQ29sbGVjdGlvblNsdWdzIiwiT2JqZWN0Iiwia2V5cyIsInJlZHVjZSIsImFjYyIsImlzR2xvYmFsIiwiZm9yRWFjaCIsInVzZVRlbmFudHNDb2xsZWN0aW9uQWNjZXNzIiwiY2xlYW51cEFmdGVyVGVuYW50RGVsZXRlIiwiZW5hYmxlZFNsdWdzIiwidXNlcnNTbHVnIiwidXNlcnNUZW5hbnRzQXJyYXlGaWVsZE5hbWUiLCJ1c2Vyc1RlbmFudHNBcnJheVRlbmFudEZpZWxkTmFtZSIsIkJvb2xlYW4iLCJkaXNhYmxlRHVwbGljYXRlIiwidGVuYW50RW5hYmxlZENvbGxlY3Rpb25TbHVncyIsInRlbmFudEVuYWJsZWRHbG9iYWxTbHVncyIsInNwbGljZSIsImRlYnVnIiwidW5pcXVlIiwidXNlQmFzZUxpc3RGaWx0ZXIiLCJiYXNlTGlzdEZpbHRlciIsInVzZVRlbmFudEFjY2VzcyIsImNsaWVudFByb3BzIiwidXNlQXNUaXRsZSIsInBhdGgiLCJsZW5ndGgiLCJzZXJ2ZXJQcm9wcyIsImdsb2JhbFNsdWdzIl0sIm1hcHBpbmdzIjoiQUFJQSxTQUFTQSxRQUFRLFFBQVEsZ0JBQWU7QUFDeEMsU0FBU0MsV0FBVyxRQUFRLHVCQUErQjtBQUMzRCxTQUFTQyxpQkFBaUIsUUFBUSw2QkFBcUM7QUFDdkUsU0FBU0MsZ0JBQWdCLFFBQVEsK0JBQThCO0FBQy9ELFNBQVNDLG1CQUFtQixRQUFRLHFDQUFvQztBQUN4RSxTQUFTQyx3QkFBd0IsUUFBUSwwQ0FBeUM7QUFDbEYsU0FBU0Msb0JBQW9CLFFBQVEsc0NBQXFDO0FBRTFFLE9BQU8sTUFBTUMsb0JBQ1gsQ0FBYUMsZUFDYixDQUFDQztRQUNDLElBQUlELGFBQWFFLE9BQU8sS0FBSyxPQUFPO1lBQ2xDLE9BQU9EO1FBQ1Q7UUFFQTs7S0FFQyxHQUNELE1BQU1FLDRCQUdKLE9BQU9ILGFBQWFHLHlCQUF5QixLQUFLLGFBQzlDSCxhQUFhRyx5QkFBeUIsR0FDdEMsSUFBTTtRQUNaLE1BQU1DLHdCQUF5QkosYUFBYUssV0FBVyxHQUNyREwsYUFBYUssV0FBVyxJQUFJYixTQUFTYyxvQkFBb0I7UUFDM0QsTUFBTUMsa0JBQWtCUCxjQUFjUCxhQUFhZSxRQUFRaEIsU0FBU2UsZUFBZTtRQUNuRixNQUFNRSx3QkFDSlQsY0FBY04sbUJBQW1CZ0Isa0JBQWtCbEIsU0FBU2lCLHFCQUFxQjtRQUNuRixNQUFNRSw4QkFDSlgsY0FBY04sbUJBQW1C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