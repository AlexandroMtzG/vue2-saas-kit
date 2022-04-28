<template>
  <div>
    <!-- Mobile menu -->
    <div class="sm:hidden">
      <div v-for="(group, index) in getMenu" :key="index" class="mt-2">
        <div class="mt-2">
          <h3
            class="px-1 text-xs leading-4 font-semibold text-blueGray-500 uppercase tracking-wider"
          >{{ group.title }}</h3>
        </div>
        <div v-for="(menuItem, index) in group.items" :key="index">
          <div v-if="!menuItem.items || menuItem.items.length === 0">
            <router-link
              :to="menuItem.path"
              class="px-4 mt-1 group flex items-center space-x-4 py-2 text-base leading-5 rounded-sm hover:text-white text-blueGray-300 focus:outline-none focus:text-gray-50 transition ease-in-out duration-150"
              :class="{
                'text-blueGray-300 bg-theme-600 focus:bg-theme-700': isCurrent(menuItem),
                'text-blueGray-200 hover:bg-blueGray-800 focus:bg-blueGray-800': !isCurrent(menuItem),
              }"
              @click.native="$emit('selected')"
            >
              <SidebarIcon class="h-5 w-5 text-white" :icon="menuItem.icon" />
              <div>{{ menuItem.title }}</div>
            </router-link>
          </div>
          <div v-else>
            <div
              class="px-4 justify-between mt-1 group flex items-center py-2 text-base leading-5 rounded-sm hover:text-white focus:outline-none focus:text-gray-50 focus:bg-blueGray-800 transition ease-in-out duration-150 text-blueGray-200 hover:bg-blueGray-800"
              @click="toggleMenuItem(index)"
            >
              <div class="flex items-center space-x-4">
                <span class="text-blueGray-200 h-5 w-5 transition ease-in-out">
                  <SidebarIcon class="h-5 w-5 text-white" :icon="menuItem.icon" />
                </span>
                <div>{{ menuItem.title }}</div>
              </div>
              <!-- Expanded: "text-gray-400 rotate-90", Collapsed: "text-blueGray-200" -->
              <svg
                :class="menuItemIsExpanded(index) ? 'rotate-90 ml-auto h-3 w-3 transform group-hover:text-gray-400 group-focus:text-gray-400 transition-colors ease-in-out duration-150' : 'ml-auto h-3 w-3 transform group-hover:text-gray-400 group-focus:text-gray-400 transition-colors ease-in-out duration-150'"
                class="ml-auto h-5 w-5 transform transition-colors ease-in-out duration-150"
                viewBox="0 0 20 20"
              >
                <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
              </svg>
            </div>
            <!-- Expandable link section, show/hide based on state. -->
            <div v-if="menuItemIsExpanded(index)" class="mt-1">
              <router-link
                v-for="(subItem, index) in menuItem.items"
                :key="index"
                :to="subItem.path"
                class="pl-14 mt-1 group flex items-center py-2 sm:text-sm leading-5 rounded-sm hover:text-blueGray-300 focus:outline-none focus:text-blueGray-300 transition ease-in-out duration-150"
                :class="{
                  'text-blueGray-300 bg-theme-600 focus:bg-theme-700': isCurrent(subItem),
                  'text-blueGray-200 hover:bg-blueGray-800 focus:bg-blueGray-800': !isCurrent(subItem),
                }"
                @click.native="$emit('selected')"
              >
                <span v-if="subItem.icon" class="mr-1 h-5 w-5 transition ease-in-out">
                  <SidebarIcon class="h-5 w-5 text-white" :icon="subItem.icon" />
                </span>
                {{ subItem.title }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Desktop menu -->
    <div class="hidden sm:block">
      <div v-for="(group, index) in getMenu" :key="index" class="select-none">
        <div class="mt-2">
          <h3
            id="Settings-headline"
            class="px-1 text-xs leading-4 font-semibold text-blueGray-500 uppercase tracking-wider"
          >{{ group.title }}</h3>
        </div>
        <div v-for="(menuItem, index) in group.items" :key="index">
          <div v-if="!menuItem.items || menuItem.items.length === 0">
            <router-link
              :to="menuItem.path"
              class="px-4 justify-between mt-1 group flex items-center py-2 text-sm leading-5 rounded-sm hover:text-white text-blueGray-300 focus:outline-none focus:text-gray-50 transition ease-in-out duration-150"
              :class="{
                'px-4': menuItem.icon !== undefined,
                'text-blueGray-300 bg-theme-600 focus:bg-theme-700': isCurrent(menuItem),
                'text-blueGray-200 hover:bg-blueGray-800 focus:bg-blueGray-800': !isCurrent(menuItem),
              }"
            >
              <div class="flex items-center space-x-5">
                <SidebarIcon class="h-5 w-5 text-white" :icon="menuItem.icon" />
                <div>{{ menuItem.title }}</div>
              </div>
            </router-link>
          </div>
          <div v-else>
            <button
              type="button"
              class="w-full px-4 justify-between mt-1 group flex items-center py-2 text-sm leading-5 rounded-sm hover:text-white focus:outline-none focus:text-gray-50 transition ease-in-out duration-150 text-blueGray-200 hover:bg-blueGray-800 focus:bg-blueGray-800"
              @click="toggleMenuItem(index)"
            >
              <div class="flex items-center space-x-5">
                <SidebarIcon class="h-5 w-5 text-white" :icon="menuItem.icon" />
                <div>{{ menuItem.title }}</div>
              </div>
              <!-- Expanded: "text-gray-400 rotate-90", Collapsed: "text-blueGray-200" -->
              <svg
                :class="menuItemIsExpanded(index) ? 'rotate-90 ml-auto h-3 w-3 transform  transition-colors ease-in-out duration-150' : 'ml-auto h-3 w-3 transform  transition-colors ease-in-out duration-150'"
                class="bg-blueGray-900 ml-auto h-5 w-5 transform transition-colors ease-in-out duration-150"
                viewBox="0 0 20 20"
              >
                <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
              </svg>
            </button>
            <!-- Expandable link section, show/hide based on state. -->
            <div v-if="menuItemIsExpanded(index)" class="mt-1">
              <router-link
                v-for="(subItem, index) in menuItem.items"
                :key="index"
                :to="subItem.path"
                class="mt-1 group flex items-center py-2 text-sm leading-5 rounded-sm hover:text-white focus:outline-none focus:text-gray-50 text-blueGray-300 transition ease-in-out duration-150"
                :class="{
                  'pl-10': menuItem.icon === undefined,
                  'pl-14': menuItem.icon !== undefined,
                  'text-blueGray-300 bg-theme-600 focus:bg-theme-700': isCurrent(subItem),
                  'text-blueGray-200 hover:bg-blueGray-800 focus:bg-blueGray-800': !isCurrent(subItem),
                }"
              >
                <SidebarIcon class="h-5 w-5 text-white" :icon="subItem.icon" />
                <div>{{ subItem.title }}</div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from 'vue-class-component';
import { SidebarGroup } from '@/application/sidebar/SidebarGroup';
import { Prop } from 'vue-property-decorator';
import { SideBarItem } from '@/application/sidebar/SidebarItem';
import { UserType } from '@/application/enums/core/users/UserType';
import { TenantUserRole } from '@/application/enums/core/tenants/TenantUserRole';
import store from '@/store';
import { AdminSidebar } from '@/application/sidebar/AdminSidebar';
import { AppSidebar } from "@/application/sidebar/AppSidebar";
import SidebarIcon from "./icons/SidebarIcon.vue";

@Component({
  components: {
    SidebarIcon
  }
})
export default class SidebarMenu extends Vue {
  @Prop({ default: '' }) layout!: string;
  menu: SideBarItem[] = [];
  expanded: number[] = [];
  mounted() {
    this.menu = this.layout === 'admin' ? AdminSidebar : AppSidebar;
    this.menu.forEach((group) => {
      group.items?.forEach((element, index) => {
        if (element.open) {
          this.expanded.push(index);
        } else {
          this.expanded = this.expanded.filter((f) => f !== index);
        }
      });
    });
  }
  menuItemIsExpanded(index: number) {
    return this.expanded.includes(index);
  }
  toggleMenuItem(index) {
    if (this.expanded.includes(index)) {
      this.expanded = this.expanded.filter((item) => item !== index);
    } else {
      this.expanded.push(index);
    }
  }
  isCurrent(menuItem: SideBarItem) {
    return this.$route.path?.includes(menuItem.path);
    // return this.$route.name && menuItem.pathName && this.$route.name.includes(menuItem.pathName)
  }
  allowCurrentUserType(item: SideBarItem) {
    return (!item.userTypes || item.userTypes.includes(this.currentUserType));
  }
  allowCurrentRole(item: SideBarItem) {
    return (!item.userRoles || item.userRoles.includes(this.currentUserRole));
  }
  get getMenu(): SidebarGroup[] {
    const _menu: SidebarGroup[] = [];
    this.menu
      .filter(f => this.allowCurrentUserType(f) && this.allowCurrentRole(f))
      .forEach(({ title, items }) => {
        _menu.push({
          title: title.toString(),
          items: items?.filter(f => this.allowCurrentUserType(f) && this.allowCurrentRole(f)) ?? [],
        });
      });
    return _menu.filter(f => f.items.length > 0);
  }
  get currentUserType(): UserType {
    return store.state.account.user?.type ?? UserType.Tenant;
  }
  get currentUserRole(): TenantUserRole {
    return store.state.tenant.current?.currentUser.role as TenantUserRole;
  }
}
</script>