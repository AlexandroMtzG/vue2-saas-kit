export default [
  {
    path: "/",
    component: require("@/views/front/Landing.vue").default,
  },
  {
    path: "/pricing",
    component: require("@/views/front/Pricing.vue").default,
  },
  {
    path: "/contact",
    component: require("@/views/front/Contact.vue").default,
  },
  {
    path: "/privacy-policy",
    component: require("@/views/front/PrivacyPolicy.vue").default,
  },
  {
    path: "/terms-and-conditions",
    component: require("@/views/front/TermsAndConditions.vue").default,
  },
  {
    path: "/login",
    component: require("@/views/front/account/Login.vue").default,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/register",
    component: require("@/views/front/account/Register.vue").default,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/verify",
    component: require("@/views/front/account/Verify.vue").default,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/forgot-password",
    component: require("@/views/front/account/Forgot.vue").default,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/reset",
    component: require("@/views/front/account/Reset.vue").default,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/invitation",
    component: require("@/views/front/account/Invitation.vue").default,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/join/:tenant",
    component: require("@/views/front/account/JoinTenant.vue").default,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/components",
    component: require("@/views/front/Components.vue").default,
    meta: {
      requiresAuth: false,
    },
  },
];
