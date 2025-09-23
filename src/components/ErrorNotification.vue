<template>
  <div
    v-if="show"
    class="alert alert-dismissible d-flex align-items-center p-5 mb-10"
    :class="alertClass"
  >
    <!--begin::Icon-->
    <i :class="iconClass" class="fs-2hx text-primary me-4"></i>
    <!--end::Icon-->

    <!--begin::Wrapper-->
    <div class="d-flex flex-column">
      <!--begin::Title-->
      <h4 class="mb-1" :class="titleClass">{{ title }}</h4>
      <!--end::Title-->
      
      <!--begin::Content-->
      <span :class="textClass">{{ message }}</span>
      <!--end::Content-->
      
      <!--begin::Details-->
      <div v-if="details" class="mt-2">
        <small class="text-muted">{{ details }}</small>
      </div>
      <!--end::Details-->
    </div>
    <!--end::Wrapper-->

    <!--begin::Close-->
    <button
      type="button"
      class="position-absolute position-sm-relative m-2 m-sm-0 top-0 end-0 btn btn-icon ms-sm-auto"
      @click="close"
    >
      <i class="ki-duotone ki-cross fs-1 text-primary">
        <span class="path1"></span>
        <span class="path2"></span>
      </i>
    </button>
    <!--end::Close-->
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "ErrorNotification",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "error", // error, warning, info, success
    },
    title: {
      type: String,
      default: "Error",
    },
    message: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      default: "",
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const alertClass = computed(() => {
      switch (props.type) {
        case "error":
          return "alert-danger border border-danger";
        case "warning":
          return "alert-warning border border-warning";
        case "info":
          return "alert-info border border-info";
        case "success":
          return "alert-success border border-success";
        default:
          return "alert-danger border border-danger";
      }
    });

    const iconClass = computed(() => {
      switch (props.type) {
        case "error":
          return "ki-duotone ki-information-5 text-danger";
        case "warning":
          return "ki-duotone ki-warning-2 text-warning";
        case "info":
          return "ki-duotone ki-information text-info";
        case "success":
          return "ki-duotone ki-check text-success";
        default:
          return "ki-duotone ki-information-5 text-danger";
      }
    });

    const titleClass = computed(() => {
      switch (props.type) {
        case "error":
          return "text-danger";
        case "warning":
          return "text-warning";
        case "info":
          return "text-info";
        case "success":
          return "text-success";
        default:
          return "text-danger";
      }
    });

    const textClass = computed(() => {
      switch (props.type) {
        case "error":
          return "text-danger";
        case "warning":
          return "text-warning";
        case "info":
          return "text-info";
        case "success":
          return "text-success";
        default:
          return "text-danger";
      }
    });

    const close = () => {
      emit("close");
    };

    return {
      alertClass,
      iconClass,
      titleClass,
      textClass,
      close,
    };
  },
});
</script>