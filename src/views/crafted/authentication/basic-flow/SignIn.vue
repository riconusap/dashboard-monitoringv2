<template>
  <!--begin::Wrapper-->
  <div class="w-lg-500px p-10">
    <!--begin::Form-->
    <VForm
      class="form w-100"
      id="kt_login_signin_form"
      @submit="onSubmitLogin"
      :validation-schema="login"
      :initial-values="{ email: '', password: '' }"
    >
      <!--begin::Heading-->
      <div class="text-center mb-10">
        <!--begin::Title-->
        <h1 class="text-gray-900 mb-3">Sign In</h1>
        <!--end::Title-->

        <!--begin::Link-->
        <div class="text-gray-500 fw-semibold fs-4">
          New Here?

          <router-link to="/sign-up" class="link-primary fw-bold">
            Create an Account
          </router-link>
        </div>
        <!--end::Link-->
      </div>
      <!--begin::Heading-->

      <div class="mb-10 bg-light-primary p-8 rounded">
        <div class="text-primary">
          Enter your credentials to sign in to the application. The system
          will connect to the API at
          <strong>http://62.72.44.203:4079</strong>.
        </div>
      </div>

      <!-- Error Notification -->
      <ErrorNotification
        :show="showError"
        :type="errorType"
        :title="errorTitle"
        :message="errorMessage"
        :details="errorDetails"
        @close="clearError"
      />

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Label-->
        <label class="form-label fs-6 fw-bold text-gray-900">Email</label>
        <!--end::Label-->

        <!--begin::Input-->
        <Field
          tabindex="1"
          class="form-control form-control-lg form-control-solid"
          type="text"
          name="email"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="email" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Input group-->
      <div class="fv-row mb-10">
        <!--begin::Wrapper-->
        <div class="d-flex flex-stack mb-2">
          <!--begin::Label-->
          <label class="form-label fw-bold text-gray-900 fs-6 mb-0"
            >Password</label
          >
          <!--end::Label-->

          <!--begin::Link-->
          <router-link to="/password-reset" class="link-primary fs-6 fw-bold">
            Forgot Password ?
          </router-link>
          <!--end::Link-->
        </div>
        <!--end::Wrapper-->

        <!--begin::Input-->
        <Field
          tabindex="2"
          class="form-control form-control-lg form-control-solid"
          type="password"
          name="password"
          autocomplete="off"
        />
        <!--end::Input-->
        <div class="fv-plugins-message-container">
          <div class="fv-help-block">
            <ErrorMessage name="password" />
          </div>
        </div>
      </div>
      <!--end::Input group-->

      <!--begin::Actions-->
      <div class="text-center">
        <!--begin::Submit button-->
        <button
          tabindex="3"
          type="submit"
          ref="submitButton"
          id="kt_sign_in_submit"
          class="btn btn-lg btn-primary w-100 mb-5"
        >
          <span class="indicator-label"> Continue </span>

          <span class="indicator-progress">
            Please wait...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
        <!--end::Submit button-->

        <!--begin::Separator-->
        <div class="text-center text-muted text-uppercase fw-bold mb-5">or</div>
        <!--end::Separator-->

        <!--begin::Google link-->
        <a
          href="#"
          class="btn btn-flex flex-center btn-light btn-lg w-100 mb-5"
        >
          <img
            alt="Logo"
            :src="getAssetPath('media/svg/brand-logos/google-icon.svg')"
            class="h-20px me-3"
          />
          Continue with Google
        </a>
        <!--end::Google link-->

        <!--begin::Google link-->
        <a
          href="#"
          class="btn btn-flex flex-center btn-light btn-lg w-100 mb-5"
        >
          <img
            alt="Logo"
            :src="getAssetPath('media/svg/brand-logos/facebook-4.svg')"
            class="h-20px me-3"
          />
          Continue with Facebook
        </a>
        <!--end::Google link-->

        <!--begin::Google link-->
        <a href="#" class="btn btn-flex flex-center btn-light btn-lg w-100">
          <img
            alt="Logo"
            :src="getAssetPath('media/svg/brand-logos/apple-black.svg')"
            class="h-20px me-3"
          />
          Continue with Apple
        </a>
        <!--end::Google link-->
      </div>
      <!--end::Actions-->
    </VForm>
    <!--end::Form-->
  </div>
  <!--end::Wrapper-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref } from "vue";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { useAuthStore, type User } from "@/stores/auth";
import { useRouter } from "vue-router";
import Swal from "sweetalert2/dist/sweetalert2.js";
import * as Yup from "yup";
import ErrorNotification from "@/components/ErrorNotification.vue";

export default defineComponent({
  name: "sign-in",
  components: {
    Field,
    VForm,
    ErrorMessage,
    ErrorNotification,
  },
  setup() {
    const store = useAuthStore();
    const router = useRouter();
    const submitButton = ref<HTMLButtonElement | null>(null);

    // Error state management
    const showError = ref(false);
    const errorType = ref("error");
    const errorTitle = ref("Error");
    const errorMessage = ref("");
    const errorDetails = ref("");

    // Clear error function
    const clearError = () => {
      showError.value = false;
      errorMessage.value = "";
      errorDetails.value = "";
    };

    // Show error function
    const showErrorNotification = (
      title: string,
      message: string,
      type: string = "error",
      details: string = "",
    ) => {
      errorTitle.value = title;
      errorMessage.value = message;
      errorType.value = type;
      errorDetails.value = details;
      showError.value = true;
    };

    // Create form validation object
    const login = Yup.object().shape({
      email: Yup.string().email().required().label("Email"),
      password: Yup.string().min(4).required().label("Password"),
    });

    // Helper function to handle login errors
    const handleLoginError = (errors: any) => {
      let errorMessage = "Login failed";
      let errorTitle = "Login Failed";
      let details = "";

      if (errors?.message) {
        errorMessage = errors.message;
      } else if (typeof errors === "string") {
        errorMessage = errors;
      } else if (errors && typeof errors === "object") {
        // Handle validation errors
        const errorValues = Object.values(errors);
        if (errorValues.length > 0) {
          errorMessage = errorValues[0] as string;
        }
      }

      // Customize title and details based on error type
      if (errorMessage.includes("Network")) {
        errorTitle = "Connection Error";
        details = "Please check your internet connection and try again.";
      } else if (
        errorMessage.includes("credentials") ||
        errorMessage.includes("Invalid")
      ) {
        errorTitle = "Invalid Credentials";
        details = "Please check your email and password.";
      } else if (
        errorMessage.includes("disabled") ||
        errorMessage.includes("suspended")
      ) {
        errorTitle = "Account Issue";
        details = "Please contact support for assistance.";
      } else if (errorMessage.includes("attempts")) {
        errorTitle = "Too Many Attempts";
        details = "Please wait a moment before trying again.";
      } else if (errorMessage.includes("timeout")) {
        errorTitle = "Request Timeout";
        details = "The server took too long to respond.";
      }

      // Show error notification
      showErrorNotification(errorTitle, errorMessage, "error", details);

      // Also show SweetAlert for important errors
      Swal.fire({
        title: errorTitle,
        text: errorMessage,
        icon: "error",
        buttonsStyling: false,
        confirmButtonText: "Try again!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn fw-semibold btn-light-danger",
        },
      }).then(() => {
        store.errors = {};
      });
    };

    // Form submit function
    const onSubmitLogin = async (values: any) => {
      values = values as User;
      // Clear existing errors
      store.logout();
      clearError(); // Clear any previous error notifications

      if (submitButton.value) {
        submitButton.value.disabled = true;
        // Activate indicator
        submitButton.value.setAttribute("data-kt-indicator", "on");
      }

      try {
        // Send login request
        await store.login(values);

        // Check if there are any errors
        const errors = store.errors as any;
        const hasErrors =
          errors &&
          (Object.keys(errors).length > 0 ||
            (typeof errors === "string" && errors.length > 0));

        if (!hasErrors) {
          // Success - show success message
          showErrorNotification(
            "Login Successful",
            "You have successfully logged in!",
            "success",
            "Redirecting to dashboard...",
          );

          setTimeout(() => {
            Swal.fire({
              text: "You have successfully logged in!",
              icon: "success",
              buttonsStyling: false,
              confirmButtonText: "Ok, got it!",
              heightAuto: false,
              customClass: {
                confirmButton: "btn fw-semibold btn-light-primary",
              },
            }).then(() => {
              // Go to page after successfully login
              router.push({ name: "dashboard" });
            });
          }, 1000);
        } else {
          // Handle errors
          handleLoginError(errors);
        }
      } catch (error: any) {
        // Handle network errors or other exceptions
        let errorMessage = "Login failed";
        let details = "";

        if (error.response) {
          // Get error from store if available
          const storeErrors = store.errors as any;
          if (storeErrors?.message) {
            errorMessage = storeErrors.message;
          } else if (typeof storeErrors === "string") {
            errorMessage = storeErrors;
          } else {
            errorMessage = "Invalid credentials";
          }
        } else if (error.request) {
          errorMessage =
            "Network error. Please check your internet connection and try again.";
          details = "Make sure you are connected to the internet.";
        } else if (error.code === "ECONNABORTED") {
          errorMessage = "Request timeout";
          details = "The server took too long to respond.";
        } else {
          errorMessage = "An unexpected error occurred. Please try again.";
          details = "If the problem persists, please contact support.";
        }

        // Show error notification
        showErrorNotification("Login Failed", errorMessage, "error", details);

        // Show error message
        Swal.fire({
          title: "Login Failed",
          text: errorMessage,
          icon: "error",
          buttonsStyling: false,
          confirmButtonText: "Try again!",
          heightAuto: false,
          customClass: {
            confirmButton: "btn fw-semibold btn-light-danger",
          },
        }).then(() => {
          store.errors = {};
        });
      } finally {
        // Always deactivate indicator and enable button
        if (submitButton.value) {
          submitButton.value.removeAttribute("data-kt-indicator");
          submitButton.value.disabled = false;
        }
      }
    };

    return {
      onSubmitLogin,
      login,
      submitButton,
      getAssetPath,
      showError,
      errorType,
      errorTitle,
      errorMessage,
      errorDetails,
      clearError,
    };
  },
});
</script>
