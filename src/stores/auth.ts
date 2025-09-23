import { ref } from "vue";
import { defineStore } from "pinia";
import ApiService from "@/core/services/ApiService";
import JwtService from "@/core/services/JwtService";

export interface User {
  id?: number;
  name?: string;
  surname?: string;
  email: string;
  password?: string;
  api_token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    token: string;
    user?: User;
  };
}

export const useAuthStore = defineStore("auth", () => {
  const errors = ref({});
  const user = ref<User>({} as User);
  const isAuthenticated = ref(!!JwtService.getToken());

  function setAuth(authUser: User, token?: string) {
    isAuthenticated.value = true;
    user.value = authUser;
    errors.value = {};
    const authToken = token || authUser.api_token;
    if (authToken) {
      JwtService.saveToken(authToken);
    }
  }

  function setError(error: any) {
    errors.value = { ...error };
  }

  function purgeAuth() {
    isAuthenticated.value = false;
    user.value = {} as User;
    errors.value = [];
    JwtService.destroyToken();
  }

  function login(credentials: LoginCredentials) {
    return ApiService.post("login", credentials)
      .then(({ data }: { data: LoginResponse }) => {
        // Handle the API response structure: { data: { token: "...", user?: {...} } }
        const token = data.data.token;
        const userData = data.data.user || { email: credentials.email };
        setAuth(userData, token);
        return data;
      })
      .catch((error) => {
        let errorMessage = "Login failed";
        let errorData = {};

        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const responseData = error.response.data;

          switch (status) {
            case 400:
              errorMessage = "Invalid email or password format";
              break;
            case 401:
              errorMessage = responseData?.message || "Invalid credentials";
              break;
            case 403:
              errorMessage = "Account is disabled or suspended";
              break;
            case 404:
              errorMessage = "Login service not available";
              break;
            case 422:
              errorMessage = responseData?.message || "Validation failed";
              errorData = responseData?.errors || {};
              break;
            case 429:
              errorMessage = "Too many login attempts. Please try again later";
              break;
            case 500:
              errorMessage = "Server error. Please try again later";
              break;
            default:
              errorMessage =
                responseData?.message || `Error ${status}: Login failed`;
          }

          // Handle validation errors specifically
          if (responseData?.errors) {
            errorData = responseData.errors;
          }
        } else if (error.request) {
          // Network error
          errorMessage = "Network error. Please check your connection";
        } else {
          // Something else happened
          errorMessage = error.message || "Unexpected error occurred";
        }

        setError({ message: errorMessage, ...errorData });
        throw error;
      });
  }

  function logout() {
    // You can add API call here if your backend has a logout endpoint
    // ApiService.post("logout", {}).catch(() => {});
    purgeAuth();
  }

  function register(credentials: User) {
    return ApiService.post("register", credentials)
      .then(({ data }) => {
        setAuth(data);
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function forgotPassword(email: string) {
    return ApiService.post("forgot_password", email)
      .then(() => {
        setError({});
      })
      .catch(({ response }) => {
        setError(response.data.errors);
      });
  }

  function verifyAuth() {
    if (JwtService.getToken()) {
      // Just set the header and mark as authenticated if token exists
      ApiService.setHeader();
      isAuthenticated.value = true;
    } else {
      purgeAuth();
    }
  }

  return {
    errors,
    user,
    isAuthenticated,
    login,
    logout,
    register,
    forgotPassword,
    verifyAuth,
  };
});
