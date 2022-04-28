<template>
  <div>
    <h3 class="mb-2 text-gray-400 font-medium text-sm">{{ $t("models.contract.activity") }}</h3>
    <div class="bg-white p-3 rounded border border-gray-100 shadow-md space-y-3 overflow-hidden">
      <div class="flow-root">
        <ul role="list" class="-mb-8">
          <li v-for="(activity, idxActivity) in sortedActivity" :key="idxActivity">
            <div class="relative pb-8">
              <span
                v-if="items.length > 0 && idxActivity + 1 < items.length"
                class="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                aria-hidden="true"
              ></span>
              <div class="relative flex space-x-3">
                <div>
                  <span
                    class="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white"
                  >
                    <!-- Heroicon name: solid/user -->
                    <svg
                      v-if="activity.type === 0"
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                </div>
                <div class="flex-grow">
                  <div class="min-w-0 flex-1 flex justify-between space-x-4">
                    <div class="truncate">
                      <div class="text-sm text-gray-500">
                        <div class="text-gray-900 truncate">
                          <span
                            :title="getActivityTitle(activity)"
                            class
                          >{{ getActivityTitle(activity) }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-right text-xs whitespace-nowrap text-gray-500 lowercase">
                      <time
                        :datetime="activity.createdAt"
                        :title="activity.createdAt"
                      >{{ dateDM(activity.createdAt) }}</time>
                    </div>
                  </div>
                  <div class="min-w-0 flex-1 flex justify-between space-x-4">
                    <div
                      class="font-light text-xs"
                      v-if="activity.createdByUser"
                    >{{ activity.createdByUser.email }}</div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import { Prop } from "vue-property-decorator";
import { ContractActivityDto } from "@/application/dtos/app/contracts/ContractActivityDto";
import { ContractActivityType } from "@/application/enums/app/contracts/ContractActivityType";
import DateUtils from "@/utils/shared/DateUtils";

@Component({
  components: {},
})
export default class ContractActivity extends Vue {
  @Prop({}) items!: ContractActivityDto[];
  getActivityTitle(activity: ContractActivityDto) {
    switch (activity.type) {
      case ContractActivityType.CREATED:
        return this.$t("app.contracts.activity.types.CREATED");
    }
  }
  dateDM(value: Date | undefined) {
    return DateUtils.dateDM(value);
  }
  get sortedActivity() {
    if (!this.items) {
      return [];
    }
    return this.items.sort((x, y) => {
      if (x.createdAt && y.createdAt) {
        return x.createdAt > y.createdAt ? 1 : -1;
      }
      return 1;
    });
  }
}
</script>
