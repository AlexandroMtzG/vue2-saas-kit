<template>
  <div>
    <Loading v-if="loading" />
    <form v-else @submit.prevent="save">
      <div class="bg-white py-6 px-8 shadow-lg border border-gray-200">
        <div class="flex items-center space-x-3 justify-between">
          <div>
            <h3
              class="text-lg leading-6 font-medium text-gray-900"
            >{{ $t("models.employee.plural") }}</h3>
          </div>
        </div>
        <div class="mt-6">
          <div v-if="!employeesFile && importingEmployees && showImportEmployees">
            <div class="flex items-center justify-between space-x-3">
              <label for="file" class="block text-sm font-normal text-gray-700 truncate">
                {{ $t("app.employees.actions.uploadCsv") }}:
                <span
                  class="font-bold italic truncate"
                >{{ $t("app.employees.actions.uploadCsvColumns") }}</span>
              </label>
              <button
                type="button"
                @click="downloadEmployeesFileTemplate"
                class="inline-flex items-center space-x-1 text-theme-500 hover:text-theme-700 underline text-sm truncate"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
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
                <div>{{ $t("app.employees.actions.uploadCsvTemplate") }}</div>
              </button>
            </div>
            <div class="mt-1">
              <UploadDocument
                accept=".csv"
                :description="$t('app.employees.actions.onlyCsv')"
                @droppedFiles="droppedEmployeesFile"
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
                      <g fill="currentColor">
                        <path
                          d="M32.25,16.125v37.625h10.75v-26.875h86v26.875h10.75v-37.625zM51.0625,64.5c-7.43261,0 -13.4375,6.00489 -13.4375,13.4375v16.125c0,7.43262 6.00489,13.4375 13.4375,13.4375c7.43262,0 13.4375,-6.00488 13.4375,-13.4375v-2.6875h-10.75v2.6875c0,1.15479 -1.53271,2.6875 -2.6875,2.6875c-1.15479,0 -2.6875,-1.53271 -2.6875,-2.6875v-16.125c0,-1.15479 1.53271,-2.6875 2.6875,-2.6875c1.15479,0 2.6875,1.53271 2.6875,2.6875v2.6875h10.75v-2.6875c0,-7.43261 -6.00488,-13.4375 -13.4375,-13.4375zM83.3125,64.5c-7.43261,0 -13.4375,6.00489 -13.4375,13.4375c0,7.43262 6.00489,13.4375 13.4375,13.4375c1.15479,0 2.6875,1.53271 2.6875,2.6875c0,1.6167 -0.62988,2.6875 -2.6875,2.6875c-1.97363,0 -2.28857,-0.41992 -2.35156,-0.50391c-0.06299,-0.08398 -0.33594,-0.41992 -0.33594,-1.67969h-10.75c0,3.04443 0.88184,6.4668 3.35938,9.07031c2.47754,2.60352 6.15185,3.86328 10.07813,3.86328c7.62158,0 13.4375,-6.4458 13.4375,-13.4375c0,-7.43261 -6.00488,-13.4375 -13.4375,-13.4375c-1.15479,0 -2.6875,-1.53271 -2.6875,-2.6875c0,-1.15479 1.53271,-2.6875 2.6875,-2.6875c1.42773,0 1.86865,0.33594 2.18359,0.67188c0.31494,0.33594 0.50391,0.90283 0.50391,1.51172h10.75c0,-3.17041 -1.15479,-6.40381 -3.52734,-8.90234c-2.37256,-2.49854 -5.96289,-4.03125 -9.91016,-4.03125zM102.125,64.5v6.21484l0.33594,0.83984l10.75,32.25l5.03906,15.28516l5.03906,-15.28516l10.75,-32.25l0.33594,-0.83984v-6.21484h-10.75v4.70313l-5.375,16.125l-5.375,-16.125v-4.70312zM32.25,118.25v37.625h107.5v-37.625h-10.75v26.875h-86v-26.875z"
                        />
                      </g>
                    </g>
                  </svg>
                </template>
              </UploadDocument>
            </div>
          </div>
          <div>
            <div
              v-for="(employee, idxEmployee) in employees"
              :key="idxEmployee"
              class="relative mt-1 grid gap-1 grid-cols-6 py-2"
            >
              <div class="col-span-3 sm:col-span-2">
                <label
                  v-if="idxEmployee === 0"
                  for="first-name"
                  class="block text-xs font-medium text-gray-700 truncate"
                >{{ $t("models.employee.firstName") }}</label>
                <div class="mt-1">
                  <input
                    autocomplete="off"
                    type="text"
                    :ref="'employee-first-name-' + idxEmployee"
                    :name="'employee-first-name-' + idxEmployee"
                    :id="'employee-first-name-' + idxEmployee"
                    :placeholder="$t('models.employee.firstName') + ' ' + (idxEmployee + 1)"
                    v-model="employee.firstName"
                    required
                    class="shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div class="col-span-3 sm:col-span-2">
                <label
                  v-if="idxEmployee === 0"
                  for="last-name"
                  class="block text-xs font-medium text-gray-700 truncate"
                >{{ $t("models.employee.lastName") }}</label>
                <div class="mt-1">
                  <input
                    autocomplete="off"
                    type="text"
                    :name="'employee-last-name-' + idxEmployee"
                    :id="'employee-last-name-' + idxEmployee"
                    :placeholder="$t('models.employee.lastName') + ' ' + (idxEmployee + 1)"
                    v-model="employee.lastName"
                    required
                    class="shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div class="col-span-6 sm:col-span-2">
                <label
                  v-if="idxEmployee === 0"
                  for="employee-email"
                  class="block text-xs font-medium text-gray-700 truncate"
                >{{ $t("models.employee.email") }}</label>
                <div class="mt-1 flex items-center space-x-2">
                  <input
                    autocomplete="off"
                    type="email"
                    :name="'employee-email' + idxEmployee"
                    :id="'employee-email' + idxEmployee"
                    :placeholder="$t('models.employee.email') + ' ' + (idxEmployee + 1)"
                    v-model="employee.email"
                    required
                    class="shadow-sm focus:ring-theme-500 focus:border-theme-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  <button
                    type="button"
                    class="text-gray-700 hover:bg-gray-50 inline-flex items-center px-1.5 py-1.5 border-gray-300 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-theme-500"
                    :class="{
                      'top-0': idxEmployee === 0,
                      '-top-3': idxEmployee > 0
                    }"
                    @click="removeEmployee(idxEmployee)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
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
            <div class="flex items-center space-x-3">
              <button
                type="button"
                @click="addEmployee"
                class="mt-6 flex items-center space-x-1 text-xs text-theme-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span class="uppercase font-medium">{{ $t("app.employees.actions.add") }}</span>
              </button>
              <button
                type="button"
                @click="importingEmployees = !importingEmployees"
                class="mt-6 flex items-center space-x-1 text-xs text-theme-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
                <span class="uppercase font-medium">{{ $t("app.employees.actions.import") }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="my-4 flex items-center justify-end space-x-2">
        <div class="flex items-center space-x-2">
          <ButtonSecondary
            @click="cancel"
            type="button"
            class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm sm:text-sm font-medium sm:rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
          >{{ $t("shared.cancel") }}</ButtonSecondary>
          <ButtonPrimary
            type="submit"
            class="inline-flex items-center space-x-2 px-3 py-2 border border-transparent shadow-sm sm:text-sm font-medium sm:rounded-md text-white bg-theme-600 hover:bg-theme-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-theme-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>{{ $t("shared.save") }}</span>
          </ButtonPrimary>
        </div>
      </div>
    </form>
    <ConfirmModal ref="confirmCreate" @yes="confirmSave" />
    <SuccessModal ref="successModal" @closed="goToProfile" />
    <ErrorModal ref="errorModal" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ErrorModal from "@/components/ui/modals/ErrorModal.vue";
import SuccessModal from "@/components/ui/modals/SuccessModal.vue";
import ConfirmModal from "@/components/ui/modals/ConfirmModal.vue";
import services from "@/services";
import UploadDocument from "@/components/ui/uploaders/UploadDocument.vue";
import { FileBase64 } from "@/application/dtos/shared/FileBase64";
import { EmployeeDto } from "@/application/dtos/app/employees/EmployeeDto";
import Loading from "@/components/ui/loaders/Loading.vue";
import ButtonPrimary from "@/components/ui/buttons/ButtonPrimary.vue";
import ButtonSecondary from "@/components/ui/buttons/ButtonSecondary.vue";

@Component({
  components: {
    UploadDocument,
    ErrorModal,
    SuccessModal,
    ConfirmModal,
    Loading,
    ButtonPrimary,
    ButtonSecondary
  },
})
export default class AddEmployees extends Vue {
  $refs!: {
    errorModal: ErrorModal;
    successModal: SuccessModal;
    confirmCreate: ConfirmModal;
  };

  employees: EmployeeDto[] = [];
  employeesFile = "";

  showImportEmployees = true;
  importingEmployees = false;

  loading = false;

  created() {
    if (process.env.VUE_APP_SERVICE === 'sandbox') {
      this.employees.push({
        id: undefined,
        firstName: "Luna",
        lastName: "Davis",
        email: "luna.davis@company.com",
      });
    }
    this.addEmployee();
  }
  removeEmployee(index) {
    this.employees = this.employees.filter((_x, i) => i !== index);
    if (this.employees.length === 0) {
      this.employeesFile = "";
    }
  }
  save() {
    this.$refs.confirmCreate.show(this.$t("shared.confirmSave"), this.$t("shared.confirm"), this.$t("shared.back"));
  }
  cancel() {
    this.$router.push("/app/employees");
  }
  confirmSave() {
    this.loading = true;
    if (this.employees.length > 0) {
      services.employees
        .createMultiple({
          employees: this.employees,
        })
        .then(() => {
          this.$refs.successModal.show(this.$t("shared.saved"));
        })
        .catch((error) => {
          this.$refs.errorModal.show(this.$t("shared.error"), this.$t(error));
        })
        .finally(() => {
          this.loading = false;
        });
    }
  }
  goToProfile() {
    this.$router.push("/app/employees");
  }
  addEmployee() {
    this.employees.push({
      id: undefined,
      firstName: "",
      lastName: "",
      email: "",
    });
    if (this.employees.length > 1) {
      this.$nextTick(() => {
        this.$refs["employee-first-name-" + (this.employees.length - 1)][0].focus();
      });
    }
  }
  downloadEmployeesFileTemplate() {
    const rows = [[
      this.$t("models.employee.firstName").toString().toUpperCase(),
      this.$t("models.employee.lastName").toString().toUpperCase(),
      this.$t("models.employee.email").toString().toUpperCase()]
    ];

    const csvContent = "data:text/csv;charset=utf-8," + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "plantilla.csv");
    document.body.appendChild(link);

    link.click();
  }
  droppedEmployeesFile(filesBase64: FileBase64[], files: File[]) {
    if (files.length > 0) {
      this.employeesFile = filesBase64[0].base64;
      const employeesFile = files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const employees = this.csvToArray(e.target.result);
        employees.forEach((employeeObject) => {
          const employee: string[] = Object.values(employeeObject);
          const firstName = employee.length > 0 ? employee[0].toString().replace("\r", "") : "";
          if (firstName === "NOMBRE" || firstName === "FIRST NAME" || firstName === "NAME") {
            return;
          }
          const lastName = employee.length > 1 ? employee[1].toString().replace("\r", "") : "";
          const email = employee.length > 2 ? employee[2].toString().replace("\r", "") : "";
          this.employees.push({
            id: undefined,
            firstName,
            lastName,
            email,
          });
        });
        this.employees = this.employees.filter((f) => f.firstName && f.lastName);
        this.clearEmptyEmployees();
      };
      reader.readAsText(employeesFile);
    }
  }
  clearEmptyEmployees() {
    this.employees.forEach((employee, index) => {
      if (!employee.firstName || employee.firstName.trim() === "") {
        this.employees = this.employees.filter((_x, i) => i !== index);
      }
    });
  }
  csvToArray(str, delimiter = ",") {
    const headers: string[] = str.slice(0, str.indexOf("\n")).split(delimiter);

    let rows = str.slice(str.indexOf("\n") + 1).split("\n");
    const header = headers[0].trim().toUpperCase();
    if (header === "NOMBRE" || header === "FIRST NAME" || header === "NAME") {
      rows = str.split("\n");
    }
    const arr = rows.map((row) => {
      const values = row.split(delimiter);
      const el = headers.reduce((object, _header, index) => {
        object[index] = values[index];
        return object;
      }, {});
      return el;
    });
    return arr;
  }
}
</script>
