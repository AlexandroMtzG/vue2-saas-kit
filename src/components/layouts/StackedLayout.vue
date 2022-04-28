<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <div>
    <div>
      <nav class="bg-gray-50 border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center space-x-3 justify-between h-16">
            <div class="flex items-center space-x-2 overflow-x-auto py-1">
              <div class="flex-shrink-0">
                <router-link to="/app">
                  <img class="h-8 w-auto" src="@/assets/img/logo-light.png" alt="Workflow" />
                </router-link>
              </div>
              <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                  <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                  <div
                    v-for="(group, index) in getMenu"
                    :key="index"
                    class="flex items-baseline space-x-4 py-1"
                  >
                    <div v-for="(menuItem, index) in group.items" :key="index">
                      <router-link
                        :to="menuItem.path"
                        class="px-3 py-2 rounded-md text-sm font-medium truncate"
                        :class="$route.path === menuItem.path ? 'text-white bg-theme-700' : 'text-gray-500 hover:bg-gray-700 hover:text-white'"
                        aria-current="page"
                      >{{ menuItem.title }}</router-link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-2 flex-shrink-0">
              <LayoutSelector v-if="layout === 'admin'" class="text-sm" />
              <LocaleSelector v-if="layout === 'admin'" class="text-sm" />
              <!-- <PendingInvitationsButton v-if="layout === 'app'" /> -->
              <!-- <ChatSupportButton v-if="layout === 'app'" /> -->
              <QuickActionsButton v-if="layout === 'app'" class="text-gray-400" />
              <ProfileButton />
              <button
                @click="sidebarOpen = !sidebarOpen"
                type="button"
                class="inline-flex items-center justify-center p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-theme-800 focus:ring-theme-500"
                aria-controls="mobile-menu"
                aria-expanded="false"
              >
                <span class="sr-only">Open main menu</span>
                <!-- Heroicon name: outline/menu -->
                <svg
                  class="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <!-- Heroicon name: outline/x -->
                <svg
                  class="hidden h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile menu, show/hide based on menu state. -->
        <div v-if="sidebarOpen" id="mobile-menu" class="bg-blueGray-900">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
            <SidebarMenu :layout="layout" @selected="sidebarOpen = !sidebarOpen" />
          </div>
          <div class="pt-2 pb-3 border-t border-gray-700">
            <div class="px-2 space-y-1">
              <router-link
                @click.native="sidebarOpen = !sidebarOpen"
                to="/app/settings/profile"
                class="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
              >{{ $t("settings.profile.profileTitle") }}</router-link>

              <button
                type="button"
                @click="logout"
                class="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-700"
              >{{ $t("app.navbar.signOut") }}</button>
            </div>
          </div>
        </div>
      </nav>
      <main>
        <div class="mx-auto">
          <!-- Replace with your content -->
          <slot></slot>
          <!-- /End replace -->
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { UserType } from "@/application/enums/core/users/UserType";
import store from "@/store";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import { Prop } from "vue-property-decorator";
import { AdminSidebar } from "@/application/sidebar/AdminSidebar";
import { AppSidebar } from "@/application/sidebar/AppSidebar";
import { SideBarItem } from "@/application/sidebar/SidebarItem";
import { SidebarGroup } from "@/application/sidebar/SidebarGroup";
import SidebarMenu from "./SidebarMenu.vue";
import ProfileButton from "./buttons/ProfileButton.vue";
import LocaleSelector from "@/components/ui/selectors/LocaleSelector.vue";
import LayoutSelector from "@/components/ui/selectors/LayoutSelector.vue";
import QuickActionsButton from "./buttons/QuickActionsButton.vue";

@Component({
  components: {
    ProfileButton,
    LocaleSelector,
    LayoutSelector,
    SidebarMenu,
    QuickActionsButton
  },
})
export default class StackedLayout extends Vue {
  @Prop()
  layout!: string;

  menu: SideBarItem[] = [];
  sidebarOpen = false;
  mounted() {
    if (this.layout === "admin") {
      this.menu = AdminSidebar;
    } else {
      this.menu = AppSidebar;
    }
  }
  allowCurrentUserType(types: UserType[] | undefined) {
    return (!types || types.includes(this.currentUserType));
  }
  allowCurrentRole(roles: TenantUserRole[] | undefined) {
    return (!roles || roles.includes(this.currentUserRole));
  }
  logout() {
    store.commit("auth/logout");
  }
  get getMenu(): SidebarGroup[] {
    const menu: SidebarGroup[] = [];
    this.menu
      .filter(f => this.allowCurrentUserType(f.userTypes)
        && this.allowCurrentRole(f.userRoles))
      .forEach(({ title, items }) => {
        menu.push({
          title: title.toString(),
          items: items?.filter(f => this.allowCurrentUserType(f.userTypes)
            && this.allowCurrentRole(f.userRoles)) ?? [],
        });
      });
    return menu.filter(f => f.items.length > 0);
  }
  get currentUserType(): UserType {
    return store.state.account.user?.type ?? UserType.Tenant;
  }
  get currentUserRole(): TenantUserRole {
    return store.state.tenant.current?.currentUser.role as TenantUserRole;
  }
}
</script>
