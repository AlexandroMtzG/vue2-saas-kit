import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";

// /app/... routes

export default [
  {
    path: "contracts/:status?",
    component: require("@/views/app/contracts/Index.vue").default,
    meta: {
      roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER, TenantUserRole.GUEST],
    },
  },
  {
    path: "contract/new",
    component: require("@/views/app/contracts/NewContract.vue").default,
    meta: {
      roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER],
    },
  },
  {
    path: "contract/:id",
    component: require("@/views/app/contracts/Contract.vue").default,
    meta: {
      roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER],
    },
  },
  {
    path: "employees",
    component: require("@/views/app/employees/Index.vue").default,
    meta: {
      roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER],
    },
  },
  {
    path: "employees/new",
    component: require("@/views/app/employees/NewEmployees.vue").default,
    meta: {
      roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER],
    },
  },
  {
    path: "employee/:id",
    component: require("@/views/app/employees/Employee.vue").default,
    meta: {
      roles: [TenantUserRole.OWNER, TenantUserRole.ADMIN, TenantUserRole.MEMBER],
    },
  },
];
