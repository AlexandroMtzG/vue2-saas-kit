<template>
  <div>
    <div class="pt-2 space-y-2 mx-auto px-4 sm:px-6 lg:px-8">
      <Loading v-if="loading" />
      <div v-else-if="item && item.id">
        <div class="relative min-h-screen">
          <main class="py-4">
            <div
              class="max-w-5xl mx-auto md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl"
            >
              <div class="flex items-center space-x-5 truncate">
                <div class="flex-shrink-0">
                  <div class="relative">
                    <span class="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                      <svg
                        class="h-full w-full text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <div class="truncate">
                  <div class="flex items-center space-x-2">
                    <h1 class="text-2xl font-bold text-gray-900">{{ item.firstName }}</h1>
                  </div>
                  <p class="text-sm font-medium text-gray-500 truncate">
                    {{ $t("shared.added") }}
                    <span v-if="item.createdByUser">
                      {{ $t("shared.by") }}
                      <span
                        class="text-gray-900"
                      >{{ item.createdByUser.firstName }} {{ item.createdByUser.lastName }}</span>
                    </span>
                    {{ $t("shared.in") }}
                    <time
                      :datetime="item.createdAt"
                    >{{ dateMonthDayYear(item.createdAt) }}</time>
                  </p>
                </div>
              </div>
              <div
                class="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3"
              >
                <ButtonSecondary @click="edit">{{ $t("shared.edit") }}</ButtonSecondary>
              </div>
            </div>

            <div class="mt-8 max-w-3xl mx-auto lg:max-w-7xl">
              <div>
                <div class="lg:grid lg:grid-cols-3 lg:gap-6">
                  <div class="lg:col-span-1">
                    <div class="px-4 sm:px-0">
                      <h3
                        class="text-lg font-medium leading-6 text-gray-900"
                      >{{ $t("app.employees.profile.title") }}</h3>
                      <p
                        class="mt-1 text-sm text-gray-600"
                      >{{ $t("app.employees.profile.general") }}</p>
                    </div>
                  </div>
                  <div class="mt-5 lg:mt-0 lg:col-span-2">
                    <form @submit.prevent="save" method="POST">
                      <div class="shadow overflow-hidden sm:rounded-md">
                        <div class="px-4 py-5 bg-white sm:p-6">
                          <div class="grid grid-cols-6 gap-6">
                            <div class="col-span-6 lg:col-span-3">
                              <label
                                for="first-name"
                                class="block text-sm font-medium text-gray-700"
                              >{{ $t("models.employee.firstName") }}</label>
                              <input
                                type="text"
                                ref="firstNameInput"
                                name="first-name"
                                id="first-name"
                                autocomplete="first-name"
                                v-model="firstName"
                                required
                                :disabled="!editing"
                                :class="{ 'bg-gray-100': !editing }"
                                class="mt-1 focus:ring-theme-500 focus:border-theme-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>

                            <div class="col-span-6 lg:col-span-3">
                              <label
                                for="last-name"
                                class="block text-sm font-medium text-gray-700"
                              >{{ $t("models.employee.lastName") }}</label>
                              <input
                                type="text"
                                name="last-name"
                                id="last-name"
                                autocomplete="last-name"
                                v-model="lastName"
                                required
                                :disabled="!editing"
                                :class="{ 'bg-gray-100': !editing }"
                                class="mt-1 focus:ring-theme-500 focus:border-theme-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>

                            <div class="col-span-6">
                              <label
                                for="email-address"
                                class="block text-sm font-medium text-gray-700"
                              >{{ $t("models.employee.email") }}</label>
                              <input
                                type="email"
                                name="email-address"
                                id="email-address"
                                autocomplete="email"
                                v-model="email"
                                :disabled="!editing"
                                :class="{ 'bg-gray-100': !editing }"
                                class="mt-1 focus:ring-theme-500 focus:border-theme-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="editing"
                          class="px-4 py-3 bg-gray-50 text-right sm:px-6 flex justify-between"
                        >
                          <div>
                            <button
                              type="button"
                              @click="deleteEmployee"
                              :disabled="!editing"
                              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                            >{{ $t("shared.delete") }}</button>
                          </div>
                          <div class="flex items-center space-x-2">
                            <button
                              type="button"
                              @click="cancel"
                              :disabled="!editing"
                              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                            >{{ $t("shared.cancel") }}</button>
                            <button
                              type="submit"
                              :disabled="!editing || thereAreNoChanges"
                              :class="{
                                ' opacity-50 cursor-not-allowed': !editing || thereAreNoChanges,
                              }"
                              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
                            >{{ $t("shared.save") }}</button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
    <SuccessModal ref="successModal" />
    <SuccessModal ref="successModalDeleted" @closed="successModalDeletedClosed" />
    <ErrorModal ref="errorModal" />
    <ConfirmModal ref="confirmSave" @yes="saveConfirm" />
    <ConfirmModal ref="confirmDeleteEmployee" @yes="confirmedDeleteEmployee" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import services from "@/services";
import { EmployeeDto } from "@/application/dtos/app/employees/EmployeeDto";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import DateUtils from "@/utils/shared/DateUtils";
import Loading from "@/components/ui/loaders/Loading.vue";
import { Prop } from 'vue-property-decorator';
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";

@Component({
  components: {
    ConfirmModal,
    ErrorModal,
    SuccessModal,
    Loading,
    ButtonSecondary
  },
})
export default class EmployeeProfile extends Vue {
  $refs!: {
    confirmSave: ConfirmModal;
    confirmDeleteEmployee: ConfirmModal;
    errorModal: ErrorModal;
    successModal: SuccessModal;
    successModalDeleted: SuccessModal;
    firstNameInput: HTMLInputElement;
  };
  @Prop({}) id!: string;
  loading = false;
  item: EmployeeDto = {} as EmployeeDto;
  firstName = "";
  lastName = "";
  email = "";

  editing = false;
  mounted() {
    this.reload();
  }
  reload() {
    this.loading = true;
    services.employees
      .get(this.id)
      .then((response) => {
        this.item = response;
        this.loadProfile();
      })
      .finally(() => {
        this.loading = false;
      });
  }
  loadProfile() {
    this.firstName = this.item.firstName;
    this.lastName = this.item.lastName;
    this.email = this.item.email ?? "";
  }
  edit() {
    this.editing = true;
    this.$nextTick(() => {
      this.$refs.firstNameInput.focus();
      this.$refs.firstNameInput.select();
    });
  }
  save() {
    if (this.thereAreNoChanges) {
      this.$refs.errorModal.show(this.$t("shared.error"), this.$t("shared.noChanges"));
    } else {
      this.$refs.confirmSave.show(this.$t("shared.saveChanges"), this.$t("shared.yes"), this.$t("shared.cancel"));
    }
  }
  deleteEmployee() {
    this.$refs.confirmDeleteEmployee.show(this.$t("shared.confirmDelete"), this.$t("shared.yes"), this.$t("shared.cancel"), this.$t("shared.warningCannotUndo"));
  }
  successModalDeletedClosed() {
    this.$router.push("/app/employees");
  }
  confirmedDeleteEmployee() {
    this.loading = true;
    services.employees
      .delete(this.id)
      .then(() => {
        this.$refs.successModalDeleted.show(this.$t("shared.deleted"));
      })
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      })
      .finally(() => {
        this.loading = false;
      });
  }
  saveConfirm() {
    this.loading = true;
    services.employees
      .update(this.id, {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
      })
      .then((response) => {
        this.$refs.successModal.show(this.$t("shared.updated"));
        this.item = response;
        this.loadProfile();
        this.editing = false;
      })
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      })
      .finally(() => {
        this.loading = false;
      });
  }
  cancel() {
    this.loadProfile();
    this.editing = false;
  }
  dateMonthDayYear(value: Date | undefined) {
    return DateUtils.dateMonthDayYear(value);
  }
  get thereAreNoChanges() {
    if (this.item) {
      return this.firstName === this.item.firstName && this.lastName === this.item.lastName && this.email === this.item.email;
    }
    return true;
  }
}
</script>
