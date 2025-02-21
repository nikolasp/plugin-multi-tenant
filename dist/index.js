import { defaults } from "./defaults";
import { tenantField } from "./fields/tenantField/index";
import { tenantsArrayField } from "./fields/tenantsArrayField/index";
import { addTenantCleanup } from "./hooks/afterTenantDelete";
import { addCollectionAccess } from "./utilities/addCollectionAccess";
import { addFilterOptionsToFields } from "./utilities/addFilterOptionsToFields";
import { withTenantListFilter } from "./utilities/withTenantListFilter";
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
        // addCollectionAccess({
        //   collection: adminUsersCollection,
        //   fieldName: `${tenantsArrayFieldName}.${tenantsArrayTenantFieldName}`,
        //   userHasAccessToAllTenants,
        // })
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
                    config: incomingConfig,
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IENvbGxlY3Rpb25Db25maWcsIENvbmZpZyB9IGZyb20gJ3BheWxvYWQnXG5cbmltcG9ydCB0eXBlIHsgTXVsdGlUZW5hbnRQbHVnaW5Db25maWcgfSBmcm9tICcuL3R5cGVzJ1xuXG5pbXBvcnQgeyBkZWZhdWx0cyB9IGZyb20gJy4vZGVmYXVsdHMnXG5pbXBvcnQgeyB0ZW5hbnRGaWVsZCB9IGZyb20gJy4vZmllbGRzL3RlbmFudEZpZWxkL2luZGV4J1xuaW1wb3J0IHsgdGVuYW50c0FycmF5RmllbGQgfSBmcm9tICcuL2ZpZWxkcy90ZW5hbnRzQXJyYXlGaWVsZC9pbmRleCdcbmltcG9ydCB7IGFkZFRlbmFudENsZWFudXAgfSBmcm9tICcuL2hvb2tzL2FmdGVyVGVuYW50RGVsZXRlJ1xuaW1wb3J0IHsgYWRkQ29sbGVjdGlvbkFjY2VzcyB9IGZyb20gJy4vdXRpbGl0aWVzL2FkZENvbGxlY3Rpb25BY2Nlc3MnXG5pbXBvcnQgeyBhZGRGaWx0ZXJPcHRpb25zVG9GaWVsZHMgfSBmcm9tICcuL3V0aWxpdGllcy9hZGRGaWx0ZXJPcHRpb25zVG9GaWVsZHMnXG5pbXBvcnQgeyB3aXRoVGVuYW50TGlzdEZpbHRlciB9IGZyb20gJy4vdXRpbGl0aWVzL3dpdGhUZW5hbnRMaXN0RmlsdGVyJ1xuXG5leHBvcnQgY29uc3QgbXVsdGlUZW5hbnRQbHVnaW4gPVxuICA8Q29uZmlnVHlwZT4ocGx1Z2luQ29uZmlnOiBNdWx0aVRlbmFudFBsdWdpbkNvbmZpZzxDb25maWdUeXBlPikgPT5cbiAgKGluY29taW5nQ29uZmlnOiBDb25maWcpOiBDb25maWcgPT4ge1xuICAgIGlmIChwbHVnaW5Db25maWcuZW5hYmxlZCA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBpbmNvbWluZ0NvbmZpZ1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNldCBkZWZhdWx0c1xuICAgICAqL1xuICAgIGNvbnN0IHVzZXJIYXNBY2Nlc3NUb0FsbFRlbmFudHM6IFJlcXVpcmVkPFxuICAgICAgTXVsdGlUZW5hbnRQbHVnaW5Db25maWc8Q29uZmlnVHlwZT5cbiAgICA+Wyd1c2VySGFzQWNjZXNzVG9BbGxUZW5hbnRzJ10gPVxuICAgICAgdHlwZW9mIHBsdWdpbkNvbmZpZy51c2VySGFzQWNjZXNzVG9BbGxUZW5hbnRzID09PSAnZnVuY3Rpb24nXG4gICAgICAgID8gcGx1Z2luQ29uZmlnLnVzZXJIYXNBY2Nlc3NUb0FsbFRlbmFudHNcbiAgICAgICAgOiAoKSA9PiBmYWxzZVxuICAgIGNvbnN0IHRlbmFudHNDb2xsZWN0aW9uU2x1ZyA9IChwbHVnaW5Db25maWcudGVuYW50c1NsdWcgPVxuICAgICAgcGx1Z2luQ29uZmlnLnRlbmFudHNTbHVnIHx8IGRlZmF1bHRzLnRlbmFudENvbGxlY3Rpb25TbHVnKVxuICAgIGNvbnN0IHRlbmFudEZpZWxkTmFtZSA9IHBsdWdpbkNvbmZpZz8udGVuYW50RmllbGQ/Lm5hbWUgfHwgZGVmYXVsdHMudGVuYW50RmllbGROYW1lXG4gICAgY29uc3QgdGVuYW50c0FycmF5RmllbGROYW1lID1cbiAgICAgIHBsdWdpbkNvbmZpZz8udGVuYW50c0FycmF5RmllbGQ/LmFycmF5RmllbGROYW1lIHx8IGRlZmF1bHRzLnRlbmFudHNBcnJheUZpZWxkTmFtZVxuICAgIGNvbnN0IHRlbmFudHNBcnJheVRlbmFudEZpZWxkTmFtZSA9XG4gICAgICBwbHVnaW5Db25maWc/LnRlbmFudHNBcnJheUZpZWxkPy5hcnJheVRlbmFudEZpZWxkTmFtZSB8fCBkZWZhdWx0cy50ZW5hbnRzQXJyYXlUZW5hbnRGaWVsZE5hbWVcblxuICAgIC8qKlxuICAgICAqIEFkZCBkZWZhdWx0cyBmb3IgYWRtaW4gcHJvcGVydGllc1xuICAgICAqL1xuICAgIGlmICghaW5jb21pbmdDb25maWcuYWRtaW4pIHtcbiAgICAgIGluY29taW5nQ29uZmlnLmFkbWluID0ge31cbiAgICB9XG4gICAgaWYgKCFpbmNvbWluZ0NvbmZpZy5hZG1pbj8uY29tcG9uZW50cykge1xuICAgICAgaW5jb21pbmdDb25maWcuYWRtaW4uY29tcG9uZW50cyA9IHtcbiAgICAgICAgYWN0aW9uczogW10sXG4gICAgICAgIGJlZm9yZU5hdkxpbmtzOiBbXSxcbiAgICAgICAgcHJvdmlkZXJzOiBbXSxcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFpbmNvbWluZ0NvbmZpZy5hZG1pbi5jb21wb25lbnRzPy5wcm92aWRlcnMpIHtcbiAgICAgIGluY29taW5nQ29uZmlnLmFkbWluLmNvbXBvbmVudHMucHJvdmlkZXJzID0gW11cbiAgICB9XG4gICAgaWYgKCFpbmNvbWluZ0NvbmZpZy5hZG1pbi5jb21wb25lbnRzPy5hY3Rpb25zKSB7XG4gICAgICBpbmNvbWluZ0NvbmZpZy5hZG1pbi5jb21wb25lbnRzLmFjdGlvbnMgPSBbXVxuICAgIH1cbiAgICBpZiAoIWluY29taW5nQ29uZmlnLmFkbWluLmNvbXBvbmVudHM/LmJlZm9yZU5hdkxpbmtzKSB7XG4gICAgICBpbmNvbWluZ0NvbmZpZy5hZG1pbi5jb21wb25lbnRzLmJlZm9yZU5hdkxpbmtzID0gW11cbiAgICB9XG4gICAgaWYgKCFpbmNvbWluZ0NvbmZpZy5jb2xsZWN0aW9ucykge1xuICAgICAgaW5jb21pbmdDb25maWcuY29sbGVjdGlvbnMgPSBbXVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCB0ZW5hbnRzIGFycmF5IGZpZWxkIHRvIHVzZXJzIGNvbGxlY3Rpb25cbiAgICAgKi9cbiAgICBjb25zdCBhZG1pblVzZXJzQ29sbGVjdGlvbiA9IGluY29taW5nQ29uZmlnLmNvbGxlY3Rpb25zLmZpbmQoKHsgc2x1ZywgYXV0aCB9KSA9PiB7XG4gICAgICBpZiAoaW5jb21pbmdDb25maWcuYWRtaW4/LnVzZXIpIHtcbiAgICAgICAgcmV0dXJuIHNsdWcgPT09IGluY29taW5nQ29uZmlnLmFkbWluLnVzZXJcbiAgICAgIH0gZWxzZSBpZiAoYXV0aCkge1xuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAoIWFkbWluVXNlcnNDb2xsZWN0aW9uKSB7XG4gICAgICB0aHJvdyBFcnJvcignQW4gYXV0aCBlbmFibGVkIGNvbGxlY3Rpb24gd2FzIG5vdCBmb3VuZCcpXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIHRlbmFudHMgYXJyYXkgZmllbGQgdG8gdXNlcnMgY29sbGVjdGlvblxuICAgICAqL1xuICAgIGlmIChwbHVnaW5Db25maWc/LnRlbmFudHNBcnJheUZpZWxkPy5pbmNsdWRlRGVmYXVsdEZpZWxkICE9PSBmYWxzZSkge1xuICAgICAgYWRtaW5Vc2Vyc0NvbGxlY3Rpb24uZmllbGRzLnB1c2goXG4gICAgICAgIHRlbmFudHNBcnJheUZpZWxkKHtcbiAgICAgICAgICAuLi4ocGx1Z2luQ29uZmlnPy50ZW5hbnRzQXJyYXlGaWVsZCB8fCB7fSksXG4gICAgICAgICAgdGVuYW50c0FycmF5RmllbGROYW1lLFxuICAgICAgICAgIHRlbmFudHNBcnJheVRlbmFudEZpZWxkTmFtZSxcbiAgICAgICAgICB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgICAgIH0pLFxuICAgICAgKVxuICAgIH1cblxuICAgIC8vIGFkZENvbGxlY3Rpb25BY2Nlc3Moe1xuICAgIC8vICAgY29sbGVjdGlvbjogYWRtaW5Vc2Vyc0NvbGxlY3Rpb24sXG4gICAgLy8gICBmaWVsZE5hbWU6IGAke3RlbmFudHNBcnJheUZpZWxkTmFtZX0uJHt0ZW5hbnRzQXJyYXlUZW5hbnRGaWVsZE5hbWV9YCxcbiAgICAvLyAgIHVzZXJIYXNBY2Nlc3NUb0FsbFRlbmFudHMsXG4gICAgLy8gfSlcblxuICAgIGxldCB0ZW5hbnRDb2xsZWN0aW9uOiBDb2xsZWN0aW9uQ29uZmlnIHwgdW5kZWZpbmVkXG5cbiAgICBjb25zdCBbY29sbGVjdGlvblNsdWdzLCBnbG9iYWxDb2xsZWN0aW9uU2x1Z3NdID0gT2JqZWN0LmtleXMocGx1Z2luQ29uZmlnLmNvbGxlY3Rpb25zKS5yZWR1Y2U8XG4gICAgICBbc3RyaW5nW10sIHN0cmluZ1tdXVxuICAgID4oXG4gICAgICAoYWNjLCBzbHVnKSA9PiB7XG4gICAgICAgIGlmIChwbHVnaW5Db25maWc/LmNvbGxlY3Rpb25zPy5bc2x1Z10/LmlzR2xvYmFsKSB7XG4gICAgICAgICAgYWNjWzFdLnB1c2goc2x1ZylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhY2NbMF0ucHVzaChzbHVnKVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGFjY1xuICAgICAgfSxcbiAgICAgIFtbXSwgW11dLFxuICAgIClcblxuICAgIC8qKlxuICAgICAqIE1vZGlmeSBjb2xsZWN0aW9uc1xuICAgICAqL1xuICAgIGluY29taW5nQ29uZmlnLmNvbGxlY3Rpb25zLmZvckVhY2goKGNvbGxlY3Rpb24pID0+IHtcbiAgICAgIC8qKlxuICAgICAgICogTW9kaWZ5IHRlbmFudHMgY29sbGVjdGlvblxuICAgICAgICovXG4gICAgICBpZiAoY29sbGVjdGlvbi5zbHVnID09PSB0ZW5hbnRzQ29sbGVjdGlvblNsdWcpIHtcbiAgICAgICAgdGVuYW50Q29sbGVjdGlvbiA9IGNvbGxlY3Rpb25cblxuICAgICAgICBpZiAocGx1Z2luQ29uZmlnLnVzZVRlbmFudHNDb2xsZWN0aW9uQWNjZXNzICE9PSBmYWxzZSkge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEFkZCBhY2Nlc3MgY29udHJvbCBjb25zdHJhaW50IHRvIHRlbmFudHMgY29sbGVjdGlvblxuICAgICAgICAgICAqIC0gY29uc3RyYWlucyBhY2Nlc3MgYSB1c2VycyBhc3NpZ25lZCB0ZW5hbnRzXG4gICAgICAgICAgICovXG4gICAgICAgICAgYWRkQ29sbGVjdGlvbkFjY2Vzcyh7XG4gICAgICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICAgICAgZmllbGROYW1lOiAnaWQnLFxuICAgICAgICAgICAgdXNlckhhc0FjY2Vzc1RvQWxsVGVuYW50cyxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBsdWdpbkNvbmZpZy5jbGVhbnVwQWZ0ZXJUZW5hbnREZWxldGUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQWRkIGNsZWFudXAgbG9naWMgd2hlbiB0ZW5hbnQgaXMgZGVsZXRlZFxuICAgICAgICAgICAqIC0gZGVsZXRlIGRvY3VtZW50cyByZWxhdGVkIHRvIHRlbmFudFxuICAgICAgICAgICAqIC0gcmVtb3ZlIHRlbmFudCBmcm9tIHVzZXJzXG4gICAgICAgICAgICovXG4gICAgICAgICAgYWRkVGVuYW50Q2xlYW51cCh7XG4gICAgICAgICAgICBjb2xsZWN0aW9uLFxuICAgICAgICAgICAgZW5hYmxlZFNsdWdzOiBbLi4uY29sbGVjdGlvblNsdWdzLCAuLi5nbG9iYWxDb2xsZWN0aW9uU2x1Z3NdLFxuICAgICAgICAgICAgdGVuYW50RmllbGROYW1lLFxuICAgICAgICAgICAgdGVuYW50c0NvbGxlY3Rpb25TbHVnLFxuICAgICAgICAgICAgdXNlcnNTbHVnOiBhZG1pblVzZXJzQ29sbGVjdGlvbi5zbHVnLFxuICAgICAgICAgICAgdXNlcnNUZW5hbnRzQXJyYXlGaWVsZE5hbWU6IHRlbmFudHNBcnJheUZpZWxkTmFtZSxcbiAgICAgICAgICAgIHVzZXJzVGVuYW50c0FycmF5VGVuYW50RmllbGROYW1lOiB0ZW5hbnRzQXJyYXlUZW5hbnRGaWVsZE5hbWUsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmIChwbHVnaW5Db25maWcuY29sbGVjdGlvbnM/Lltjb2xsZWN0aW9uLnNsdWddKSB7XG4gICAgICAgIGNvbnN0IGlzR2xvYmFsID0gQm9vbGVhbihwbHVnaW5Db25maWcuY29sbGVjdGlvbnNbY29sbGVjdGlvbi5zbHVnXT8uaXNHbG9iYWwpXG5cbiAgICAgICAgaWYgKGlzR2xvYmFsKSB7XG4gICAgICAgICAgY29sbGVjdGlvbi5kaXNhYmxlRHVwbGljYXRlID0gdHJ1ZVxuICAgICAgICB9XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIE1vZGlmeSBlbmFibGVkIGNvbGxlY3Rpb25zXG4gICAgICAgICAqL1xuICAgICAgICBhZGRGaWx0ZXJPcHRpb25zVG9GaWVsZHMoe1xuICAgICAgICAgIGNvbmZpZzogaW5jb21pbmdDb25maWcsXG4gICAgICAgICAgZmllbGRzOiBjb2xsZWN0aW9uLmZpZWxkcyxcbiAgICAgICAgICB0ZW5hbnRFbmFibGVkQ29sbGVjdGlvblNsdWdzOiBjb2xsZWN0aW9uU2x1Z3MsXG4gICAgICAgICAgdGVuYW50RW5hYmxlZEdsb2JhbFNsdWdzOiBnbG9iYWxDb2xsZWN0aW9uU2x1Z3MsXG4gICAgICAgICAgdGVuYW50RmllbGROYW1lLFxuICAgICAgICAgIHRlbmFudHNDb2xsZWN0aW9uU2x1ZyxcbiAgICAgICAgfSlcblxuICAgICAgICAvKipcbiAgICAgICAgICogQWRkIHRlbmFudCBmaWVsZCB0byBlbmFibGVkIGNvbGxlY3Rpb25zXG4gICAgICAgICAqL1xuICAgICAgICBjb2xsZWN0aW9uLmZpZWxkcy5zcGxpY2UoXG4gICAgICAgICAgMCxcbiAgICAgICAgICAwLFxuICAgICAgICAgIHRlbmFudEZpZWxkKHtcbiAgICAgICAgICAgIC4uLihwbHVnaW5Db25maWc/LnRlbmFudEZpZWxkIHx8IHt9KSxcbiAgICAgICAgICAgIG5hbWU6IHRlbmFudEZpZWxkTmFtZSxcbiAgICAgICAgICAgIGRlYnVnOiBwbHVnaW5Db25maWcuZGVidWcsXG4gICAgICAgICAgICB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgICAgICAgICB1bmlxdWU6IGlzR2xvYmFsLFxuICAgICAgICAgIH0pLFxuICAgICAgICApXG5cbiAgICAgICAgaWYgKHBsdWdpbkNvbmZpZy5jb2xsZWN0aW9uc1tjb2xsZWN0aW9uLnNsdWddPy51c2VCYXNlTGlzdEZpbHRlciAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBDb2xsZWN0aW9uIGJhc2VMaXN0RmlsdGVyIHdpdGggc2VsZWN0ZWQgdGVuYW50IGNvbnN0cmFpbnQgKGlmIHNlbGVjdGVkKVxuICAgICAgICAgICAqL1xuICAgICAgICAgIGlmICghY29sbGVjdGlvbi5hZG1pbikge1xuICAgICAgICAgICAgY29sbGVjdGlvbi5hZG1pbiA9IHt9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbGxlY3Rpb24uYWRtaW4uYmFzZUxpc3RGaWx0ZXIgPSB3aXRoVGVuYW50TGlzdEZpbHRlcih7XG4gICAgICAgICAgICBiYXNlTGlzdEZpbHRlcjogY29sbGVjdGlvbi5hZG1pbj8uYmFzZUxpc3RGaWx0ZXIsXG4gICAgICAgICAgICB0ZW5hbnRGaWVsZE5hbWUsXG4gICAgICAgICAgICB0ZW5hbnRzQ29sbGVjdGlvblNsdWcsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwbHVnaW5Db25maWcuY29sbGVjdGlvbnNbY29sbGVjdGlvbi5zbHVnXT8udXNlVGVuYW50QWNjZXNzICE9PSBmYWxzZSkge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEFkZCBhY2Nlc3MgY29udHJvbCBjb25zdHJhaW50IHRvIHRlbmFudCBlbmFibGVkIGNvbGxlY3Rpb25cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBhZGRDb2xsZWN0aW9uQWNjZXNzKHtcbiAgICAgICAgICAgIGNvbGxlY3Rpb24sXG4gICAgICAgICAgICBmaWVsZE5hbWU6IHRlbmFudEZpZWxkTmFtZSxcbiAgICAgICAgICAgIHVzZXJIYXNBY2Nlc3NUb0FsbFRlbmFudHMsXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICBpZiAoIXRlbmFudENvbGxlY3Rpb24pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVGVuYW50cyBjb2xsZWN0aW9uIG5vdCBmb3VuZCB3aXRoIHNsdWc6ICR7dGVuYW50c0NvbGxlY3Rpb25TbHVnfWApXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkIFRlbmFudFNlbGVjdGlvblByb3ZpZGVyIHRvIGFkbWluIHByb3ZpZGVyc1xuICAgICAqL1xuICAgIGluY29taW5nQ29uZmlnLmFkbWluLmNvbXBvbmVudHMucHJvdmlkZXJzLnB1c2goe1xuICAgICAgY2xpZW50UHJvcHM6IHtcbiAgICAgICAgdGVuYW50c0NvbGxlY3Rpb25TbHVnOiB0ZW5hbnRDb2xsZWN0aW9uLnNsdWcsXG4gICAgICAgIHVzZUFzVGl0bGU6IHRlbmFudENvbGxlY3Rpb24uYWRtaW4/LnVzZUFzVGl0bGUgfHwgJ2lkJyxcbiAgICAgIH0sXG4gICAgICBwYXRoOiAnQHBheWxvYWRjbXMvcGx1Z2luLW11bHRpLXRlbmFudC9yc2MjVGVuYW50U2VsZWN0aW9uUHJvdmlkZXInLFxuICAgIH0pXG5cbiAgICAvKipcbiAgICAgKiBBZGQgZ2xvYmFsIHJlZGlyZWN0IGFjdGlvblxuICAgICAqL1xuICAgIGlmIChnbG9iYWxDb2xsZWN0aW9uU2x1Z3MubGVuZ3RoKSB7XG4gICAgICBpbmNvbWluZ0NvbmZpZy5hZG1pbi5jb21wb25lbnRzLmFjdGlvbnMucHVzaCh7XG4gICAgICAgIHBhdGg6ICdAcGF5bG9hZGNtcy9wbHVnaW4tbXVsdGktdGVuYW50L3JzYyNHbG9iYWxWaWV3UmVkaXJlY3QnLFxuICAgICAgICBzZXJ2ZXJQcm9wczoge1xuICAgICAgICAgIGdsb2JhbFNsdWdzOiBnbG9iYWxDb2xsZWN0aW9uU2x1Z3MsXG4gICAgICAgICAgdGVuYW50RmllbGROYW1lLFxuICAgICAgICAgIHRlbmFudHNDb2xsZWN0aW9uU2x1ZyxcbiAgICAgICAgICB1c2VBc1RpdGxlOiB0ZW5hbnRDb2xsZWN0aW9uLmFkbWluPy51c2VBc1RpdGxlIHx8ICdpZCcsXG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCB0ZW5hbnQgc2VsZWN0b3IgdG8gYWRtaW4gVUlcbiAgICAgKi9cbiAgICBpbmNvbWluZ0NvbmZpZy5hZG1pbi5jb21wb25lbnRzLmJlZm9yZU5hdkxpbmtzLnB1c2goe1xuICAgICAgcGF0aDogJ0BwYXlsb2FkY21zL3BsdWdpbi1tdWx0aS10ZW5hbnQvY2xpZW50I1RlbmFudFNlbGVjdG9yJyxcbiAgICB9KVxuXG4gICAgcmV0dXJuIGluY29taW5nQ29uZmlnXG4gIH1cbiJdLCJuYW1lcyI6WyJkZWZhdWx0cyIsInRlbmFudEZpZWxkIiwidGVuYW50c0FycmF5RmllbGQiLCJhZGRUZW5hbnRDbGVhbnVwIiwiYWRkQ29sbGVjdGlvbkFjY2VzcyIsImFkZEZpbHRlck9wdGlvbnNUb0ZpZWxkcyIsIndpdGhUZW5hbnRMaXN0RmlsdGVyIiwibXVsdGlUZW5hbnRQbHVnaW4iLCJwbHVnaW5Db25maWciLCJpbmNvbWluZ0NvbmZpZyIsImVuYWJsZWQiLCJ1c2VySGFzQWNjZXNzVG9BbGxUZW5hbnRzIiwidGVuYW50c0NvbGxlY3Rpb25TbHVnIiwidGVuYW50c1NsdWciLCJ0ZW5hbnRDb2xsZWN0aW9uU2x1ZyIsInRlbmFudEZpZWxkTmFtZSIsIm5hbWUiLCJ0ZW5hbnRzQXJyYXlGaWVsZE5hbWUiLCJhcnJheUZpZWxkTmFtZSIsInRlbmFudHNBcnJheVRlbmFudEZpZWxkTmFtZSIsImFycmF5VGVuYW50RmllbGROYW1lIiwiYWRtaW4iLCJjb21wb25lbnRzIiwiYWN0aW9ucyIsImJlZm9yZU5hdkxpbmtzIiwicHJvdmlkZXJzIiwiY29sbGVjdGlvbnMiLCJhZG1pblVzZXJzQ29sbGVjdGlvbiIsImZpbmQiLCJzbHVnIiwiYXV0aCIsInVzZXIiLCJFcnJvciIsImluY2x1ZGVEZWZhdWx0RmllbGQiLCJmaWVsZHMiLCJwdXNoIiwidGVuYW50Q29sbGVjdGlvbiIsImNvbGxlY3Rpb25TbHVncyIsImdsb2JhbENvbGxlY3Rpb25TbHVncyIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJhY2MiLCJpc0dsb2JhbCIsImZvckVhY2giLCJjb2xsZWN0aW9uIiwidXNlVGVuYW50c0NvbGxlY3Rpb25BY2Nlc3MiLCJmaWVsZE5hbWUiLCJjbGVhbnVwQWZ0ZXJUZW5hbnREZWxldGUiLCJlbmFibGVkU2x1Z3MiLCJ1c2Vyc1NsdWciLCJ1c2Vyc1RlbmFudHNBcnJheUZpZWxkTmFtZSIsInVzZXJzVGVuYW50c0FycmF5VGVuYW50RmllbGROYW1lIiwiQm9vbGVhbiIsImRpc2FibGVEdXBsaWNhdGUiLCJjb25maWciLCJ0ZW5hbnRFbmFibGVkQ29sbGVjdGlvblNsdWdzIiwidGVuYW50RW5hYmxlZEdsb2JhbFNsdWdzIiwic3BsaWNlIiwiZGVidWciLCJ1bmlxdWUiLCJ1c2VCYXNlTGlzdEZpbHRlciIsImJhc2VMaXN0RmlsdGVyIiwidXNlVGVuYW50QWNjZXNzIiwiY2xpZW50UHJvcHMiLCJ1c2VBc1RpdGxlIiwicGF0aCIsImxlbmd0aCIsInNlcnZlclByb3BzIiwiZ2xvYmFsU2x1Z3MiXSwibWFwcGluZ3MiOiJBQUlBLFNBQVNBLFFBQVEsUUFBUSxhQUFZO0FBQ3JDLFNBQVNDLFdBQVcsUUFBUSw2QkFBNEI7QUFDeEQsU0FBU0MsaUJBQWlCLFFBQVEsbUNBQWtDO0FBQ3BFLFNBQVNDLGdCQUFnQixRQUFRLDRCQUEyQjtBQUM1RCxTQUFTQyxtQkFBbUIsUUFBUSxrQ0FBaUM7QUFDckUsU0FBU0Msd0JBQXdCLFFBQVEsdUNBQXNDO0FBQy9FLFNBQVNDLG9CQUFvQixRQUFRLG1DQUFrQztBQUV2RSxPQUFPLE1BQU1DLG9CQUNYLENBQWFDLGVBQ2IsQ0FBQ0M7UUFDQyxJQUFJRCxhQUFhRSxPQUFPLEtBQUssT0FBTztZQUNsQyxPQUFPRDtRQUNUO1FBRUE7O0tBRUMsR0FDRCxNQUFNRSw0QkFHSixPQUFPSCxhQUFhRyx5QkFBeUIsS0FBSyxhQUM5Q0gsYUFBYUcseUJBQXlCLEdBQ3RDLElBQU07UUFDWixNQUFNQyx3QkFBeUJKLGFBQWFLLFdBQVcsR0FDckRMLGFBQWFLLFdBQVcsSUFBSWIsU0FBU2Msb0JBQW9CO1FBQzNELE1BQU1DLGtCQUFrQlAsY0FBY1AsYUFBYWUsUUFBUWhCLFNBQVNlLGVBQWU7UUFDbkYsTUFBTUUsd0JBQ0pULGNBQWNOLG1CQUFtQmdCLGtCQUFrQmxCLFNBQVNpQixxQkFB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