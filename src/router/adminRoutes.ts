import { UserType } from "@/application/enums/core/users/UserType";

export const adminRoutes = {
  path: "/admin",
  component: require("@/views/admin/Index.vue").default,
  meta: {
    requiresAuth: true,
    userTypes: [UserType.Admin],
  },
  redirect: "admin/tenants",
  children: [
    {
      path: "tenants",
      component: require("@/views/admin/tenants/Index.vue").default,
    },
    {
      path: "tenant/:id",
      component: require("@/views/admin/tenants/Tenant.vue").default,
    },
    {
      path: "users",
      component: require("@/views/admin/Users.vue").default,
    },
    {
      path: "pricing",
      component: require("@/views/admin/Pricing.vue").default,
    },
    {
      path: "emails",
      component: require("@/views/admin/Emails.vue").default,
    },
    {
      path: "navigation",
      component: require("@/views/admin/Navigation.vue").default,
    },
    {
      path: "components",
      component: require("@/views/admin/Components.vue").default,
    },
  ],
};
