<template>
  <div class="row g-6 g-xl-9">
    <div v-for="app in apps" :key="app.id" class="col-md-6 col-xl-4">
      <div class="card">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold fs-3 mb-1">{{ app.name }}</span>
            <span class="text-muted fs-7">{{ app.description }}</span>
          </h3>
          <div class="card-toolbar">
            <button
              class="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
              @click="toggleFavorite(app.id)"
            >
              <i
                class="ki-duotone fs-2"
                :class="
                  app.isFavorite ? 'ki-heart text-danger' : 'ki-heart-half'
                "
              >
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
          </div>
        </div>

        <div class="card-body">
          <!-- Status Indicators -->
          <div class="mb-5">
            <!-- Ping Status -->
            <div class="d-flex align-items-center mb-3">
              <div
                class="symbol symbol-25px me-3"
                :class="getPingStatusClass(app.pingStatus)"
              >
                <span class="symbol-label">
                  <i class="ki-duotone ki-pulse fs-6 text-white">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </span>
              </div>
              <div class="flex-grow-1">
                <span class="text-gray-800 fw-bold d-block fs-7"
                  >Ping Status</span
                >
                <span class="text-muted fs-8">{{ app.pingTime }}ms</span>
              </div>
              <span
                class="badge fs-8 fw-bold"
                :class="getPingBadgeClass(app.pingStatus)"
              >
                {{ app.pingStatus }}
              </span>
            </div>

            <!-- SSL Status -->
            <div class="d-flex align-items-center mb-3">
              <div
                class="symbol symbol-25px me-3"
                :class="getSSLStatusClass(app.sslStatus)"
              >
                <span class="symbol-label">
                  <i class="ki-duotone ki-shield-check fs-6 text-white">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </span>
              </div>
              <div class="flex-grow-1">
                <span class="text-gray-800 fw-bold d-block fs-7"
                  >SSL Certificate</span
                >
                <span class="text-muted fs-8"
                  >Expires: {{ app.sslExpiry }}</span
                >
              </div>
              <span
                class="badge fs-8 fw-bold"
                :class="getSSLBadgeClass(app.sslStatus)"
              >
                {{ app.sslStatus }}
              </span>
            </div>

            <!-- Concurrent Users -->
            <div class="d-flex align-items-center mb-3">
              <div class="symbol symbol-25px me-3 bg-light-info">
                <span class="symbol-label">
                  <i class="ki-duotone ki-people fs-6 text-info">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span class="path3"></span>
                    <span class="path4"></span>
                    <span class="path5"></span>
                  </i>
                </span>
              </div>
              <div class="flex-grow-1">
                <span class="text-gray-800 fw-bold d-block fs-7"
                  >Concurrent Users</span
                >
                <span class="text-muted fs-8">Active now</span>
              </div>
              <span class="badge badge-light-info fs-8 fw-bold">
                {{ app.concurrentUsers }}
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="d-flex gap-2">
            <button
              class="btn btn-light-primary btn-sm flex-fill"
              @click="openApp(app.url)"
            >
              <i class="ki-duotone ki-directbox-default fs-5 me-1">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
              </i>
              Open App
            </button>
            <button
              class="btn btn-light-info btn-sm flex-fill"
              @click="viewDetails(app)"
            >
              <i class="ki-duotone ki-information fs-5 me-1">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              Details
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";

interface App {
  id: number;
  name: string;
  description: string;
  url: string;
  pingStatus: "online" | "offline" | "slow";
  pingTime: number;
  sslStatus: "valid" | "expiring" | "expired";
  sslExpiry: string;
  concurrentUsers: number;
  isFavorite: boolean;
}

export default defineComponent({
  name: "AppMonitoringCards",
  setup() {
    const apps = ref<App[]>([]);

    const loadApps = () => {
      // Mock data - in real implementation, this would come from an API
      apps.value = [
        {
          id: 1,
          name: "Web Portal",
          description: "Main customer portal",
          url: "https://portal.example.com",
          pingStatus: "online",
          pingTime: 45,
          sslStatus: "valid",
          sslExpiry: "2025-12-15",
          concurrentUsers: 156,
          isFavorite: false,
        },
        {
          id: 2,
          name: "Admin Dashboard",
          description: "Internal admin interface",
          url: "https://admin.example.com",
          pingStatus: "slow",
          pingTime: 890,
          sslStatus: "expiring",
          sslExpiry: "2024-11-30",
          concurrentUsers: 23,
          isFavorite: true,
        },
        {
          id: 3,
          name: "API Gateway",
          description: "REST API services",
          url: "https://api.example.com",
          pingStatus: "online",
          pingTime: 12,
          sslStatus: "valid",
          sslExpiry: "2026-03-20",
          concurrentUsers: 89,
          isFavorite: false,
        },
        {
          id: 4,
          name: "Mobile App Backend",
          description: "Mobile application services",
          url: "https://mobile-api.example.com",
          pingStatus: "offline",
          pingTime: 0,
          sslStatus: "expired",
          sslExpiry: "2024-08-15",
          concurrentUsers: 0,
          isFavorite: false,
        },
      ];
    };

    const getPingStatusClass = (status: string) => {
      switch (status) {
        case "online":
          return "bg-success";
        case "slow":
          return "bg-warning";
        case "offline":
          return "bg-danger";
        default:
          return "bg-secondary";
      }
    };

    const getPingBadgeClass = (status: string) => {
      switch (status) {
        case "online":
          return "badge-light-success";
        case "slow":
          return "badge-light-warning";
        case "offline":
          return "badge-light-danger";
        default:
          return "badge-light-secondary";
      }
    };

    const getSSLStatusClass = (status: string) => {
      switch (status) {
        case "valid":
          return "bg-success";
        case "expiring":
          return "bg-warning";
        case "expired":
          return "bg-danger";
        default:
          return "bg-secondary";
      }
    };

    const getSSLBadgeClass = (status: string) => {
      switch (status) {
        case "valid":
          return "badge-light-success";
        case "expiring":
          return "badge-light-warning";
        case "expired":
          return "badge-light-danger";
        default:
          return "badge-light-secondary";
      }
    };

    const toggleFavorite = (appId: number) => {
      const app = apps.value.find((a) => a.id === appId);
      if (app) {
        app.isFavorite = !app.isFavorite;
      }
    };

    const openApp = (url: string) => {
      window.open(url, "_blank");
    };

    const viewDetails = (app: App) => {
      // In real implementation, this would navigate to a details page or open a modal
      console.log("View details for app:", app.name);
      alert(
        `Viewing details for ${app.name}\n\nURL: ${app.url}\nStatus: ${app.pingStatus}\nUsers: ${app.concurrentUsers}`,
      );
    };

    onMounted(() => {
      loadApps();
    });

    return {
      apps,
      getPingStatusClass,
      getPingBadgeClass,
      getSSLStatusClass,
      getSSLBadgeClass,
      toggleFavorite,
      openApp,
      viewDetails,
    };
  },
});
</script>

<style scoped>
.card {
  transition: transform 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
}

.symbol {
  border-radius: 50%;
}
</style>
