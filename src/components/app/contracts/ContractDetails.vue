<template>
  <div class="max-w-5xl xl:max-w-7xl mx-auto pb-6">
    <Loading v-if="loading" />
    <div
      v-else-if="!item || !item.id"
      class="mx-auto p-5 items-center justify-between flex text-red-700"
    >{{ error }}</div>
    <div v-else-if="item" :key="id">
      <div
        class="md:flex space-y-2 md:space-y-0 items-center justify-between py-3 border-b border-gray-200 mb-2 md:space-x-3"
      >
        <div class="font-bold text-xl uppercase truncate">
          <span class="truncate">{{ item.name }}</span>
        </div>
        <div class="flex justify-end items-end space-x-2">
          <button
            v-if="editing && isOwnerOrAdmin"
            @click="deleteContract"
            type="button"
            class="bg-white py-2 px-4 border border-gray-300 sm:rounded-md shadow-sm sm:text-sm font-medium text-red-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >{{ $t("shared.delete") }}</button>
          <button
            v-if="editing"
            @click="toggleEdit"
            type="button"
            class="bg-white py-2 px-4 border border-gray-300 sm:rounded-md shadow-sm sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
          >{{ $t("shared.cancel") }}</button>
          <button
            ref="buttonSave"
            v-if="editing"
            @click="save"
            type="submit"
            class="inline-flex truncate justify-center px-4 py-2 border border-transparent shadow-sm sm:text-sm font-medium sm:rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
          >{{ $t("shared.saveChanges") }}</button>
          <div v-if="!editing" class="flex items-end space-x-2 space-y-0">
            <DropdownWithClick ref="dropdownOptions" @click="downloadPdf">
              <template v-slot:button>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="-ml-0.5 mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {{ $t("shared.download") }}
              </template>

              <template v-slot:options>
                <button
                  type="button"
                  v-if="canEdit"
                  @click="toggleEdit"
                  :disabled="!canBeEdited"
                  :class="{
                    ' bg-gray-100 cursor-not-allowed': !canBeEdited,
                    ' hover:bg-gray-50': canBeEdited,
                  }"
                  class="w-full text-left text-gray-700 block px-4 py-2 text-sm focus:outline-none"
                  role="menuitem"
                  tabindex="-1"
                  id="option-menu-item-1"
                >
                  <div>{{ $t("shared.edit") }}</div>
                </button>

                <button
                  type="button"
                  @click="reload"
                  class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
                  role="menuitem"
                  tabindex="-1"
                  id="option-menu-item-2"
                >
                  <div>{{ $t("shared.reload") }}</div>
                </button>

                <button
                  type="button"
                  @click="send"
                  class="w-full text-left text-gray-700 block px-4 py-2 text-sm hover:bg-gray-50 focus:outline-none"
                  role="menuitem"
                  tabindex="-1"
                  id="option-menu-item-6"
                >{{ $t("shared.send") }}</button>
              </template>
            </DropdownWithClick>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 min-h-screen">
        <div class="py-2">
          <div class="grid gap-4 lg:grid-cols-3">
            <div class="lg:col-span-2 space-y-4">
              <div>
                <h3
                  class="mb-2 text-gray-400 font-medium text-sm"
                >{{ $t("app.contracts.details.general") }}</h3>
                <div class="bg-white p-3 rounded border border-gray-100 shadow-md space-y-3">
                  <div class="grid sm:grid-cols-3 gap-2">
                    <div>
                      <label
                        for="provider"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.provider.object") }}</label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          name="provider"
                          id="provider"
                          autocomplete="off"
                          required
                          v-model="providerFullName"
                          disabled
                          class="bg-gray-100 text-gray-600 p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        for="client"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.client.object") }}</label>
                      <div class="mt-1 flex rounded-md shadow-sm w-full">
                        <input
                          type="text"
                          name="client"
                          id="client"
                          autocomplete="off"
                          required
                          v-model="clientFullName"
                          disabled
                          class="bg-gray-100 text-gray-600 p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        for="status"
                        class="block text-xs font-medium text-gray-700 truncate"
                      >{{ $t("models.contract.status") }}</label>
                      <select
                        id="status"
                        name="status"
                        :disabled="!editing"
                        :class="[
                        'mt-1 text-gray-600 p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md',
                        {
                          'bg-gray-100': !editing,
                          'bg-white': editing
                        }]"
                        v-model="status"
                      >
                        <option :value="0">{{ $t("app.contracts.status.PENDING") }}</option>
                        <option :value="1">{{ $t("app.contracts.status.SIGNED") }}</option>
                        <option :value="2">{{ $t("app.contracts.status.ARCHIVED") }}</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label
                      for="name"
                      class="block text-xs font-medium text-gray-700"
                    >{{ $t("models.contract.name") }}</label>
                    <div class="mt-1">
                      <input
                        :disabled="!editing"
                        type="text"
                        ref="inputName"
                        name="name"
                        v-model="name"
                        id="name"
                        class="text-gray-600 p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md"
                        :class="{
                          'bg-gray-100': !editing,
                          'bg-white': editing,
                        }"
                        :placeholder="$t('models.contract.name')"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      for="description"
                      class="block text-xs font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >{{ $t("models.contract.description") }}</label>
                    <div class="mt-1 sm:col-span-2">
                      <textarea
                        :disabled="!editing"
                        id="description"
                        v-model="description"
                        rows="5"
                        class="p-2 shadow-sm w-full block focus:outline-none focus:ring-theme-300 focus:border-theme-300 focus:z-10 sm:text-sm border border-gray-300 rounded-md"
                        :class="{
                          'bg-gray-100': !editing,
                          'bg-white': editing,
                        }"
                      ></textarea>
                    </div>
                  </div>

                  <div>
                    <label
                      class="block text-xs font-medium text-gray-700 sm:mt-px sm:pt-2"
                    >{{ $t("models.contract.file") }}</label>
                    <div
                      class="mt-1 sm:col-span-2"
                      :class="{
                        'bg-white': editing,
                      }"
                    >
                      <div v-if="loadingPdf">
                        <div class="overflow-hidden border border-gray-300 rounded-md items-center">
                          <Loading />
                        </div>
                      </div>
                      <div v-else>
                        <PdfViewer
                          v-if="contractPdf && contractPdf.length > 0"
                          :file="contractPdf"
                          :editing="editing"
                          @removeFile="removeFile"
                        />
                        <UploadDocument
                          v-else
                          accept=".pdf"
                          :description="$t('shared.onlyFileTypes', ['.PDF'])"
                          @droppedFiles="droppedContractFile"
                        >
                          <template v-slot:icon>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              x="0px"
                              y="0px"
                              width="32"
                              height="32"
                              class="mx-auto h-10 w-10 text-gray-400"
                              viewBox="0 0 172 172"
                              style="fill: #000000"
                            >
                              <g
                                fill="none"
                                fill-rule="nonzero"
                                stroke="none"
                                stroke-width="1"
                                stroke-linecap="butt"
                                stroke-linejoin="miter"
                                stroke-miterlimit="10"
                                stroke-dasharray
                                stroke-dashoffset="0"
                                font-family="none"
                                font-weight="none"
                                font-size="none"
                                text-anchor="none"
                                style="mix-blend-mode: normal"
                              >
                                <path d="M0,172v-172h172v172z" fill="none" />
                                <g fill="#ef4444">
                                  <path
                                    d="M32.25,16.125v37.625h10.75v-26.875h86v26.875h10.75v-37.625zM43,64.5v43h10.75v-10.75c8.83935,0 16.125,-7.28565 16.125,-16.125c0,-8.83935 -7.28565,-16.125 -16.125,-16.125zM75.25,64.5v43h13.4375c7.43262,0 13.4375,-6.00488 13.4375,-13.4375v-16.125c0,-7.43261 -6.00488,-13.4375 -13.4375,-13.4375zM107.5,64.5v43h10.75v-16.125h10.75v-10.75h-10.75v-5.375h16.125v-10.75zM53.75,75.25c2.98145,0 5.375,2.39356 5.375,5.375c0,2.98145 -2.39355,5.375 -5.375,5.375zM86,75.25h2.6875c1.15479,0 2.6875,1.53271 2.6875,2.6875v16.125c0,1.15479 -1.53271,2.6875 -2.6875,2.6875h-2.6875zM32.25,118.25v37.625h107.5v-37.625h-10.75v26.875h-86v-26.875z"
                                  />
                                </g>
                              </g>
                            </svg>
                          </template>
                        </UploadDocument>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-5">
              <ContractMembers :items="item.members" />
              <ContractEmployees v-if="item.employees.length > 0" :items="item.employees" />
              <ContractActivity :items="item.activity" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <ConfirmModal ref="confirmSendContract" @yes="yesSendContract" />
    <ConfirmModal ref="confirmDelete" @yes="yesDelete" />
    <ErrorModal ref="errorModal" />
    <SuccessModal ref="successModal" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import tinyEventBus from "@/plugins/tinyEventBus";
import { ContractDto } from "@/application/dtos/app/contracts/ContractDto";
import services from "@/services";
import store from "@/store";
import UploadDocument from "@/components/ui/uploaders/UploadDocument.vue";
import { FileBase64 } from "@/application/dtos/shared/FileBase64";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import { ContractActivityType } from "@/application/enums/app/contracts/ContractActivityType";
import ContractMembers from "@/components/app/contracts/ContractMembers.vue";
import { ContractActivityDto } from "@/application/dtos/app/contracts/ContractActivityDto";
import { TenantUserRole } from "@/application/enums/core/tenants/TenantUserRole";
import Loading from "@/components/ui/loaders/Loading.vue";
import { Prop } from 'vue-property-decorator';
import DropdownWithClick from "@/components/ui/dropdowns/DropdownWithClick.vue";
import { ContractStatus } from "@/application/enums/app/contracts/ContractStatus";
import ContractEmployees from "./ContractEmployees.vue";
import ContractActivity from "./ContractActivity.vue";
import PdfViewer from "../../ui/pdf/PdfViewer.vue";

@Component({
  components: {
    ErrorModal,
    SuccessModal,
    ConfirmModal,
    UploadDocument,
    ContractMembers,
    ContractEmployees,
    ContractActivity,
    Loading,
    PdfViewer,
    DropdownWithClick
  },
})
export default class ContractDetails extends Vue {
  $refs!: {
    buttonSave: HTMLButtonElement;
    confirmSendContract: ConfirmModal;
    confirmDelete: ConfirmModal;
    errorModal: ErrorModal;
    successModal: SuccessModal;
    inputName: HTMLInputElement;
  };
  @Prop({}) id!: string;
  name = "";
  status = ContractStatus.PENDING;
  description = "";
  contractPdf = "";

  editing = false;

  item?: ContractDto | null = null;
  error = "";
  loading = false;
  loadingPdf = false;
  currentPage = 1;
  pageCount = 0;
  mounted() {
    tinyEventBus().emitter.on("contract-reload", () => {
      this.reload();
    });
    this.reload();
  }
  beforeDestroy() {
    tinyEventBus().emitter.off("contract-reload");
  }
  reload() {
    this.closeOptions();
    this.loading = true;
    this.item = undefined;
    services.contracts
      .getContract(this.id)
      .then((response) => {
        this.item = response;
        this.status = response.status;
        this.name = response.name;
        this.description = response.description;
        this.loadPdf();
      })
      .catch((error) => {
        this.error = error;
      })
      .finally(() => {
        this.loading = false;
      });
  }
  nextPage(pages) {
    this.currentPage += pages;
  }
  removeFile() {
    if (this.item) {
      this.contractPdf = "";
    }
  }
  loadPdf() {
    this.downloadFile(false);
  }
  downloadFile(open: boolean) {
    this.closeOptions();
    this.loadingPdf = true;
    services.contracts
      .downloadFile(this.id)
      .then((response) => {
        if (open) {
          const downloadLink = document.createElement("a");
          const fileName = this.item?.name + ".pdf";
          downloadLink.href = response;
          downloadLink.download = fileName;
          downloadLink.click();
        } else {
          this.contractPdf = response;
        }
      })
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      })
      .finally(() => {
        this.loadingPdf = false;
      });
  }
  downloadPdf() {
    this.closeOptions();
    if (this.item) {
      const downloadLink = document.createElement("a");
      const fileName = this.item?.name + ".pdf";
      downloadLink.href = this.contractPdf;
      downloadLink.download = fileName;
      downloadLink.click();
    }
  }
  toggleEdit() {
    this.closeOptions();
    this.editing = !this.editing;
    if (this.editing) {
      this.$nextTick(() => {
        this.$refs.inputName.focus();
        this.$refs.inputName.select();
      });
    }
  }
  deleteContract() {
    this.$refs.confirmDelete.show(this.$t("shared.confirmDelete"), this.$t("shared.delete"), this.$t("shared.cancel"), this.$t("shared.warningCannotUndo"));
  }
  yesDelete() {
    this.loading = true;
    services.contracts
      .delete(this.item?.id)
      .then(() => {
        this.$router.push("/app/contracts/all");
      })
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
        this.loading = false;
      });
  }
  droppedContractFile(files: FileBase64[]) {
    if (this.item) {
      if (files.length > 0) {
        this.contractPdf = files[0].base64;
      }
    }
  }
  send() {
    this.closeOptions();
    this.$refs.confirmSendContract.show(
      this.$t("shared.send"),
      this.$t("shared.send"),
      this.$t("shared.cancel"),
      this.$t("shared.sendTo", [this.item?.members.map((f) => (f.user.firstName + " " + f.user.lastName).trim() + " (" + f.user.email + ")").join(", ")])
    );
  }
  yesSendContract() {
    if (!this.item) {
      return;
    }
    services.contracts
      .send(this.item.id, {
        emails: [],
      })
      .then(() => {
        this.$refs.successModal.show(this.$t("shared.sent"));
      })
      .catch((error) => {
        this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
      });
  }
  getActivityTitle(activity: ContractActivityDto) {
    switch (activity.type) {
      case ContractActivityType.CREATED:
        return this.$t("app.contracts.activity.types.CREATED");
    }
  }
  save() {
    if (!this.name) {
      this.$refs.errorModal.show(this.$t("shared.error"), this.$t("app.contracts.errors.nameRequired"));
    } else if (!this.description) {
      this.$refs.errorModal.show(this.$t("shared.error"), this.$t("app.contracts.errors.descriptionRequired"));
    } else if (!this.contractPdf) {
      this.$refs.errorModal.show(this.$t("shared.error"), this.$t("app.contracts.errors.fileRequired"));
    } else {
      this.loading = true;
      services.contracts
        .update(this.id, {
          name: this.name,
          status: this.status,
          description: this.description,
          file: this.contractPdf,
        })
        .then(() => {
          this.editing = false;
          this.$refs.successModal.show(this.$t("shared.updated"), this.$t("shared.saved"));
        })
        .catch((error) => {
          this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
  closeOptions() {
    if (this.$refs["dropdownOptions"]) {
      this.$refs["dropdownOptions"].close();
    }
  }
  get clientFullName() {
    if (this.item && this.item.link?.clientWorkspace) {
      return `${this.item.link.clientWorkspace.name}`;
    }
    return "";
  }
  get providerFullName() {
    if (this.item && this.item.link?.providerWorkspace) {
      return `${this.item.link.providerWorkspace.name}`;
    }
    return "";
  }
  get canBeEdited() {
    return this.item?.members.filter((f) => f.role === 0 && f.signDate).length === 0;
  }
  get isOwnerOrAdmin(): boolean {
    return this.currentRole === TenantUserRole.OWNER || this.currentRole === TenantUserRole.ADMIN;
  }
  get currentRole(): TenantUserRole {
    return store.state.tenant.current?.currentUser.role ?? TenantUserRole.GUEST;
  }
  get canEdit() {
    if (this.isOwnerOrAdmin) {
      return true;
    }
    return this.item?.createdByUserId === store.state.account.user?.id || true;
  }
}
</script>
