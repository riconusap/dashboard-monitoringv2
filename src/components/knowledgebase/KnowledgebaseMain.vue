<template>
  <div class="knowledgebase-main d-flex flex-column h-100">
    <!-- Header -->
    <div class="kb-header bg-light border-bottom">
      <div class="container-fluid">
        <div class="row align-items-center py-3">
          <div class="col-md-6">
            <div class="d-flex align-items-center">
              <button
                class="btn btn-icon btn-sm btn-light me-3 d-lg-none"
                @click="toggleSidebar"
              >
                <i class="ki-duotone ki-burger-menu-3 fs-2">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </button>
              <div>
                <h1 class="mb-0 h4 fw-bold text-gray-800">Knowledge Base</h1>
                <p class="text-muted fs-7 mb-0">
                  Documentation and guides for all applications
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-6">
            <div class="d-flex align-items-center justify-content-end">
              <!-- Quick Actions -->
              <div class="me-3">
                <button
                  class="btn btn-sm btn-light-primary me-2"
                  :class="{ active: showFavoritesOnly }"
                  @click="toggleFavoritesFilter"
                  title="Show only favorites"
                >
                  <i class="ki-duotone ki-heart fs-4">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  Favorites
                </button>
                <button
                  class="btn btn-sm btn-light-success"
                  @click="refreshData"
                  title="Refresh data"
                >
                  <i class="ki-duotone ki-arrows-circle fs-4">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                  Refresh
                </button>
              </div>

              <!-- Theme Toggle -->
              <div class="me-3">
                <button
                  class="btn btn-sm btn-icon btn-light"
                  @click="toggleTheme"
                  :title="
                    isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'
                  "
                >
                  <i
                    :class="`ki-duotone fs-2 ${
                      isDarkMode ? 'ki-sun' : 'ki-moon'
                    }`"
                  >
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </button>
              </div>

              <!-- Settings -->
              <div class="dropdown">
                <button
                  class="btn btn-sm btn-icon btn-light"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i class="ki-duotone ki-setting-2 fs-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <h6 class="dropdown-header">Settings</h6>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="#"
                      @click.prevent="exportData"
                    >
                      <i class="ki-duotone ki-export fs-5 me-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                      Export Data
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      href="#"
                      @click.prevent="clearCache"
                    >
                      <i class="ki-duotone ki-trash fs-5 me-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                        <span class="path4"></span>
                        <span class="path5"></span>
                      </i>
                      Clear Cache
                    </a>
                  </li>
                  <li>
                    <hr class="dropdown-divider" />
                  </li>
                  <li>
                    <a class="dropdown-item" href="#" @click.prevent="showHelp">
                      <i class="ki-duotone ki-information fs-5 me-2">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                      </i>
                      Help & Support
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="kb-body flex-grow-1 d-flex overflow-hidden">
      <!-- Sidebar -->
      <div
        class="kb-sidebar bg-white border-end"
        :class="{
          'sidebar-collapsed': sidebarCollapsed,
          'sidebar-mobile-open': sidebarMobileOpen,
        }"
      >
        <KnowledgebaseSidebar />
      </div>

      <!-- Content Area -->
      <div
        class="kb-content-area flex-grow-1 d-flex flex-column overflow-hidden"
      >
        <!-- Loading State -->
        <div
          v-if="isLoading"
          class="d-flex align-items-center justify-content-center h-100"
        >
          <div class="text-center">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading knowledge base...</p>
          </div>
        </div>

        <!-- Error State -->
        <div
          v-else-if="hasError"
          class="d-flex align-items-center justify-content-center h-100"
        >
          <div class="text-center">
            <i class="ki-duotone ki-information fs-3x text-danger mb-3">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
            </i>
            <h5 class="text-danger mb-2">Error Loading Content</h5>
            <p class="text-muted mb-4">{{ errorMessage }}</p>
            <button class="btn btn-primary" @click="retryLoad">
              <i class="ki-duotone ki-arrows-circle fs-5 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Retry
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div v-else class="p-4 overflow-auto h-100">
          <KnowledgebaseContent />
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="sidebarMobileOpen"
      class="kb-mobile-overlay d-lg-none"
      @click="closeMobileSidebar"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useKnowledgebaseStore } from "@/stores/knowledgebase";
import KnowledgebaseSidebar from "./KnowledgebaseSidebar.vue";
import KnowledgebaseContent from "./KnowledgebaseContent.vue";

export default defineComponent({
  name: "KnowledgebaseMain",
  components: {
    KnowledgebaseSidebar,
    KnowledgebaseContent,
  },
  setup() {
    const store = useKnowledgebaseStore();

    // Local state
    const sidebarCollapsed = ref(false);
    const sidebarMobileOpen = ref(false);
    const showFavoritesOnly = ref(false);
    const isDarkMode = ref(false);
    const isLoading = ref(false);
    const hasError = ref(false);
    const errorMessage = ref("");

    // Computed
    const applications = computed(() => store.applications);

    // Methods
    const toggleSidebar = () => {
      if (window.innerWidth < 992) {
        // Mobile: toggle mobile sidebar
        sidebarMobileOpen.value = !sidebarMobileOpen.value;
      } else {
        // Desktop: toggle collapsed state
        sidebarCollapsed.value = !sidebarCollapsed.value;
      }
    };

    const closeMobileSidebar = () => {
      sidebarMobileOpen.value = false;
    };

    const toggleFavoritesFilter = () => {
      showFavoritesOnly.value = !showFavoritesOnly.value;
      // You can implement filtering logic here
      console.log("Favorites filter toggled:", showFavoritesOnly.value);
    };

    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value;
      // Implement theme switching logic
      document.body.classList.toggle("dark-mode", isDarkMode.value);
      localStorage.setItem("kb-dark-mode", isDarkMode.value.toString());
    };

    const refreshData = async () => {
      isLoading.value = true;
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Data refreshed");
      } catch (error) {
        console.error("Error refreshing data:", error);
      } finally {
        isLoading.value = false;
      }
    };

    const exportData = () => {
      const dataStr = JSON.stringify(applications.value, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `knowledgebase-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    const clearCache = () => {
      localStorage.removeItem("kb-favorites");
      localStorage.removeItem("kb-recent-searches");
      localStorage.removeItem("kb-dark-mode");
      store.clearFavorites();
      console.log("Cache cleared");
    };

    const showHelp = () => {
      // Open help modal or navigate to help page
      console.log("Show help");
    };

    const retryLoad = () => {
      hasError.value = false;
      errorMessage.value = "";
      // Retry loading logic
      refreshData();
    };

    // Handle window resize
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        sidebarMobileOpen.value = false;
      }
    };

    // Initialize
    onMounted(() => {
      // Load theme preference
      const savedTheme = localStorage.getItem("kb-dark-mode");
      if (savedTheme) {
        isDarkMode.value = savedTheme === "true";
        document.body.classList.toggle("dark-mode", isDarkMode.value);
      }

      // Add resize listener
      window.addEventListener("resize", handleResize);

      // Initialize data if needed
      if (applications.value.length === 0) {
        refreshData();
      }
    });

    return {
      sidebarCollapsed,
      sidebarMobileOpen,
      showFavoritesOnly,
      isDarkMode,
      isLoading,
      hasError,
      errorMessage,
      applications,
      toggleSidebar,
      closeMobileSidebar,
      toggleFavoritesFilter,
      toggleTheme,
      refreshData,
      exportData,
      clearCache,
      showHelp,
      retryLoad,
    };
  },
});
</script>

<style scoped>
.knowledgebase-main {
  height: 100vh;
  background-color: #f8f9fa;
}

.kb-header {
  min-height: 70px;
  z-index: 1020;
}

.kb-body {
  height: calc(100vh - 70px);
}

.kb-sidebar {
  width: 320px;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1010;
}

.kb-sidebar.sidebar-collapsed {
  width: 60px;
}

.kb-content-area {
  background-color: #ffffff;
}

/* Mobile Sidebar */
@media (max-width: 991.98px) {
  .kb-sidebar {
    position: fixed;
    left: -320px;
    top: 70px;
    height: calc(100vh - 70px);
    z-index: 1030;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  }

  .kb-sidebar.sidebar-mobile-open {
    left: 0;
  }

  .kb-mobile-overlay {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1025;
  }
}

/* Dark mode styles */
:global(.dark-mode) .knowledgebase-main {
  background-color: #1e1e2d;
}

:global(.dark-mode) .kb-header {
  background-color: #1e1e2d !important;
  border-color: #2b2b40 !important;
}

:global(.dark-mode) .kb-sidebar {
  background-color: #1e1e2d !important;
  border-color: #2b2b40 !important;
}

:global(.dark-mode) .kb-content-area {
  background-color: #151521 !important;
}

/* Hover effects */
.btn:hover {
  transform: translateY(-1px);
  transition: all 0.2s ease;
}

/* Loading animation */
.spinner-border {
  width: 3rem;
  height: 3rem;
}

/* Button active states */
.btn.active {
  background-color: var(--bs-primary) !important;
  color: white !important;
  border-color: var(--bs-primary) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .kb-header .col-md-6:last-child .d-flex > div:not(:last-child) {
    display: none !important;
  }
}

/* Smooth transitions */
* {
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    color 0.3s ease;
}
</style>
