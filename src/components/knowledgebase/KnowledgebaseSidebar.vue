<template>
  <div class="kb-sidebar">
    <!-- Show Overview when no app selected -->
    <div v-if="!selectedApp" class="kb-overview-section">
      <KnowledgebaseOverview />
    </div>

    <!-- Show App Navigation when app is selected -->
    <div v-else class="kb-app-navigation">
      <!-- App Header with Back Button -->
      <div class="kb-app-header mb-4 p-3 bg-light-primary rounded">
        <div class="d-flex align-items-center justify-content-between mb-2">
          <button
            class="btn btn-sm btn-light"
            @click="goBackToHome"
            title="Back to applications"
          >
            ← Back
          </button>
          <button
            class="btn btn-sm"
            :class="
              isAppFavorite(selectedApp.app_id)
                ? 'btn-light-danger'
                : 'btn-light-gray-200'
            "
            @click="toggleAppFavorite(selectedApp.app_id)"
          >
            {{ isAppFavorite(selectedApp.app_id) ? "♥" : "♡" }}
          </button>
        </div>
        <div>
          <h5 class="fw-bold text-primary mb-1">{{ selectedApp.name }}</h5>
          <div class="text-gray-600 fs-7">
            {{ selectedApp.article_list.length }} articles •
            {{ getTotalCategories(selectedApp) }} categories
          </div>
        </div>
      </div>

      <!-- Search (only when app is selected) -->
      <div class="kb-search mb-4">
        <div class="position-relative">
          <input
            v-model="localSearchQuery"
            type="text"
            class="form-control"
            :placeholder="`Search in ${selectedApp.name}...`"
            @input="handleSearch"
          />
          <button
            v-if="localSearchQuery"
            class="btn btn-sm btn-light position-absolute end-0 top-50 translate-middle-y me-2"
            @click="clearSearch"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Categories Navigation -->
      <div class="kb-categories">
        <div class="mb-3">
          <h6 class="text-gray-700 fw-bold mb-3">Categories</h6>
        </div>

        <!-- Overview Link -->
        <div class="mb-3">
          <a
            href="#"
            class="d-flex align-items-center text-decoration-none p-2 rounded hover-bg-light-primary"
            :class="{
              'bg-primary text-white': !selectedCategory && !selectedArticle,
            }"
            @click.prevent="showOverview"
          >
            <span class="fw-semibold">Overview</span>
          </a>
        </div>

        <!-- Category Tree -->
        <CategoryTree
          v-if="selectedApp.category_list.length > 0"
          :categories="selectedApp.category_list"
          :selected-category="selectedCategory"
          @select-category="selectCategory"
        />

        <!-- No Categories Message -->
        <div v-else class="text-center py-4">
          <p class="text-gray-500 fs-7 mb-0">No categories available</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from "vue";
import { useKnowledgebaseStore } from "@/stores/knowledgebase";
import type {
  KnowledgebaseApplication,
  KnowledgebaseCategory,
} from "@/types/knowledgebase";
import CategoryTree from "./CategoryTree.vue";
import KnowledgebaseOverview from "./KnowledgebaseOverview.vue";

export default defineComponent({
  name: "KnowledgebaseSidebar",
  components: {
    CategoryTree,
    KnowledgebaseOverview,
  },
  setup() {
    const store = useKnowledgebaseStore();
    const localSearchQuery = ref("");

    const applications = computed(() => store.applications);
    const selectedApp = computed(() => store.selectedApp);
    const selectedCategory = computed(() => store.selectedCategory);
    const selectedArticle = computed(() => store.selectedArticle);

    const isAppFavorite = (appId: number) => {
      return store.favorites.apps.includes(appId);
    };

    const toggleAppFavorite = (appId: number) => {
      store.toggleAppFavorite(appId);
    };

    const getTotalCategories = (app: KnowledgebaseApplication) => {
      const countCategories = (categories: KnowledgebaseCategory[]): number => {
        let count = categories.length;
        for (const category of categories) {
          count += countCategories(category.children);
        }
        return count;
      };
      return countCategories(app.category_list);
    };

    const selectApp = (app: KnowledgebaseApplication) => {
      store.selectApplication(app);
    };

    const selectCategory = (category: KnowledgebaseCategory) => {
      store.selectCategory(category);
    };

    const goBackToHome = () => {
      store.navigateHome();
    };

    const showOverview = () => {
      store.selectCategory(null as any);
      store.selectArticle(null as any);
    };

    const handleSearch = () => {
      if (localSearchQuery.value.trim()) {
        store.search(localSearchQuery.value);
      } else {
        store.clearSearch();
      }
    };

    const clearSearch = () => {
      localSearchQuery.value = "";
      store.clearSearch();
    };

    // Watch for search query changes
    watch(
      () => store.searchQuery,
      (newQuery) => {
        localSearchQuery.value = newQuery;
      },
    );

    return {
      applications,
      selectedApp,
      selectedCategory,
      selectedArticle,
      localSearchQuery,
      isAppFavorite,
      toggleAppFavorite,
      getTotalCategories,
      selectApp,
      selectCategory,
      goBackToHome,
      showOverview,
      handleSearch,
      clearSearch,
    };
  },
});
</script>

<style scoped>
.kb-sidebar {
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  background-color: #ffffff;
}

.kb-overview-section {
  height: 100%;
}

.kb-app-navigation {
  height: 100%;
}

.kb-app-header {
  border: 1px solid #e1f0ff;
}

.kb-search .form-control {
  border: 1px solid #e4e6ea;
  border-radius: 0.475rem;
  padding: 0.75rem 1rem;
  padding-left: 2.5rem;
}

.kb-search .form-control:focus {
  border-color: #3f8af5;
  box-shadow: 0 0 0 0.25rem rgba(63, 138, 245, 0.1);
}

.hover-bg-light-primary:hover {
  background-color: #f8f9fa !important;
  transition: background-color 0.2s ease;
}

.bg-primary.text-white {
  background-color: var(--bs-primary) !important;
}

.bg-primary.text-white * {
  color: white !important;
}

/* Responsive design */
@media (max-width: 768px) {
  .kb-sidebar {
    padding: 0.75rem;
  }
}

/* Better button spacing */
.btn-sm {
  padding: 0.375rem 0.75rem;
}

.btn-icon {
  width: 2rem;
  height: 2rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Typography improvements */
.fs-7 {
  font-size: 0.85rem;
}

.text-gray-600 {
  color: #7e8299;
}

.text-gray-700 {
  color: #5e6278;
}

/* Card and section spacing */
.mb-3 {
  margin-bottom: 1rem;
}

.mb-4 {
  margin-bottom: 1.5rem;
}

.p-2 {
  padding: 0.5rem;
}

.p-3 {
  padding: 1rem;
}

.rounded {
  border-radius: 0.375rem;
}

/* Icon improvements */
.ki-duotone {
  display: inline-flex;
  flex-direction: column;
}

.ki-duotone > * {
  display: block;
}
</style>
