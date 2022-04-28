import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import appRoutes from "./appRoutes";

// /app/... core routes

export const appCoreRoutes = {
  path: "/app",
  component: require("@/views/core/Index.vue").default,
  meta: {
    requiresAuth: true,
  },
  redirect: "/app/dashboard",
  children: [
    {
      path: "dashboard",
      component: require("@/views/core/Dashboard.vue").default,
      meta: {
        roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER, TenantUserRole.GUEST],
      },
    },
    {
      path: "unauthorized",
      component: require("@/views/core/Unauthorized.vue").default,
    },
    {
      path: "settings",
      component: require("@/views/core/settings/Index.vue").default,
      redirect: "settings/profile",
      children: [
        {
          path: "profile",
          component: require("@/views/core/settings/Profile.vue").default,
        },
        {
          path: "workspaces",
          component: require("@/views/core/settings/Workspaces.vue").default,
          meta: {
            requiresAuth: true,
            roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
          },
          children: [
            {
              path: "new",
              component: require("@/components/core/workspaces/NewWorkspace.vue").default,
              meta: {
                roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
              },
            },
            {
              path: "edit/:id",
              component: require("@/components/core/workspaces/EditWorkspace.vue").default,
              meta: {
                roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
              },
            },
          ],
        },
        {
          path: "members",
          component: require("@/views/core/settings/Members.vue").default,
          meta: {
            roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
          },
          children: [
            {
              path: "new",
              component: require("@/components/core/settings/members/NewMember.vue").default,
              meta: {
                roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
              },
            },
            {
              path: "edit/:id",
              component: require("@/components/core/settings/members/EditMember.vue").default,
              meta: {
                roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
              },
            },
          ],
        },
        {
          path: "subscription",
          component: require("@/components/core/settings/subscription/MySubscription.vue").default,
          meta: {
            roles: [TenantUserRole.OWNER],
          },
        },
        {
          path: "tenant",
          component: require("@/views/core/settings/Tenant.vue").default,
          meta: {
            roles: [TenantUserRole.OWNER],
          },
        },
      ],
    },
    {
      path: "links",
      component: require("@/views/core/links/Index.vue").default,
      meta: {
        roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
      },
      children: [
        {
          path: "all",
          component: require("@/components/app/links/all/AllLinksList.vue").default,
        },
        {
          path: "pending",
          component: require("@/components/app/links/pending/PendingLinksList.vue").default,
        },
        {
          path: "providers",
          component: require("@/components/app/links/providers/ProvidersList.vue").default,
        },
        {
          path: "clients",
          component: require("@/components/app/links/clients/ClientsList.vue").default,
        },
      ],
    },
    {
      path: "link/:id",
      component: require("@/views/core/links/Link.vue").default,
      meta: {
        roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN],
      },
    },
    ...appRoutes,
  ],
};
