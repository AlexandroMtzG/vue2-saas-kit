<template>
  <div>
    <div v-if="sortedItems.length === 0">
      <EmptyState
        class="bg-white"
        :captions="{
          thereAreNo: $t('app.links.empty'),
        }"
      />
    </div>
    <div v-else class="flex flex-col">
      <div class="overflow-x-auto">
        <div class="py-2 align-middle inline-block min-w-full">
          <div class="shadow overflow-hidden border border-gray-200 sm:rounded-lg">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    v-for="(header, idx) in headers"
                    :key="idx"
                    @click="sortBy(header.name)"
                    scope="col"
                    class="px-3 py-2 text-left text-xs font-medium text-gray-500 tracking-wider select-none"
                    :class="{
                      'cursor-pointer hover:text-gray-700': header.name,
                    }"
                  >
                    <div class="flex items-center space-x-1 text-gray-500">
                      <div>{{ header.title }}</div>
                      <div
                        :class="{
                          invisible: !header.name || sortByColumn !== header.name,
                        }"
                      >
                        <svg
                          v-if="sortDirection === -1"
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <svg
                          v-else
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(link, idx) in sortedItems" :key="idx">
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    <div class="flex items-end">
                      <div>
                        <div
                          class="text-sm font-extrabold text-gray-900"
                        >{{ getWorkspace(link).name }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    <span
                      v-if="whoAmI(link) === 0"
                      class="flex-shrink-0 inline-block px-2 py-0.5 text-indigo-800 text-xs font-medium bg-indigo-100 rounded-sm border-indigo-300"
                    >{{ $t("models.client.object") }}</span>
                    <span
                      v-else
                      class="flex-shrink-0 inline-block px-2 py-0.5 text-theme-800 text-xs font-medium bg-theme-100 rounded-sm border-theme-300"
                    >{{ $t("models.provider.object") }}</span>
                  </td>
                  <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    <div class="max-w-sm truncate">{{ getWorkspace(link).businessMainActivity }}</div>
                  </td>
                  <td class="w-20 px-3 py-2 whitespace-nowrap text-sm text-gray-600">
                    <div class="flex items-center space-x-2">
                      <ButtonTertiary :to="'/app/link/' + link.id">
                        <div>{{ $t("app.links.profile.title") }}</div>
                      </ButtonTertiary>
                      <ButtonTertiary :to="'/app/contract/new?l=' + link.id">
                        <div>{{ $t("app.contracts.new.title") }}</div>
                      </ButtonTertiary>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import i18n from "@/locale/i18n";
import store from "@/store";
import { LinkDto } from "@/application/dtos/core/links/LinkDto";
import EmptyState from "@/components/ui/emptyState/EmptyState.vue";
import ButtonTertiary from "@/components/ui/buttons/ButtonTertiary.vue";

@Component({
  components: {
    EmptyState,
    ButtonTertiary
  },
})
export default class AllLinksListAndTable extends Vue {
  @Prop({}) items!: LinkDto[];
  sortByColumn = "type";
  sortDirection = -1;
  headers = [
    {
      name: "name",
      title: i18n.t("models.workspace.object"),
    },
    {
      title: i18n.t("models.link.type"),
    },
    {
      title: i18n.t("models.workspace.businessMainActivity"),
    },
    {
      title: i18n.t("shared.actions"),
    },
  ];

  sortBy(column) {
    if (column) {
      this.sortDirection = this.sortDirection === -1 ? 1 : -1;
      this.sortByColumn = column;
    }
  }
  getWorkspace(item: LinkDto) {
    if (this.whoAmI(item) === 0) {
      return item.clientWorkspace;
    } else {
      return item.providerWorkspace;
    }
  }
  whoAmI(item: LinkDto) {
    const currentWorkspaceId = store.state.tenant.currentWorkspace?.id ?? "";
    if (currentWorkspaceId === item.providerWorkspaceId) {
      return 0;
    }
    return 1;
  }
  get sortedItems(): LinkDto[] {
    const column = this.sortByColumn;
    const sortDirection = this.sortDirection;
    if (!column || column === "") {
      return this.items;
    }
    return this.items.sort((x, y) => {
      if (x[column] && y[column]) {
        if (sortDirection === -1) {
          return (x[column] > y[column] ? 1 : -1) ?? 1;
        } else {
          return (x[column] < y[column] ? 1 : -1) ?? 1;
        }
      }
      return 1;
    });
  }
}
</script>
