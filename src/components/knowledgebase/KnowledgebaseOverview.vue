<template>
  <div class="kb-overview">
    <!-- Overview Header -->
    <div class="d-flex align-items-center mb-4">
      <div>
        <h6 class="fw-bold text-gray-900 mb-0">Overview</h6>
        <span class="text-gray-500 fs-8">{{
          selectedApp?.name || "Knowledge Base"
        }}</span>
      </div>
    </div>

    <!-- App Stats (when app is selected) -->
    <div v-if="selectedApp" class="mb-6">
      <div class="bg-light-primary rounded p-4 mb-4">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <h6 class="fw-bold text-primary mb-0">{{ selectedApp.name }}</h6>
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
        
        <div class="row g-3">
          <div class="col-6">
            <div class="text-center">
              <div class="fw-bold text-primary fs-5">
                {{ selectedApp.article_list.length }}
              </div>
              <div class="text-gray-600 fs-8">Articles</div>
            </div>
          </div>
          <div class="col-6">
            <div class="text-center">
              <div class="fw-bold text-primary fs-5">
                {{ getTotalCategories(selectedApp) }}
              </div>
              <div class="text-gray-600 fs-8">Categories</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Global Stats (when no app selected) -->
    <div v-else class="mb-6">
      <div class="row g-3">
        <div class="col-6">
          <div class="bg-light-info rounded p-3 text-center">
            <div class="fw-bold text-info">{{ applications.length }}</div>
            <div class="text-gray-600 fs-8">Apps</div>
          </div>
        </div>
        <div class="col-6">
          <div class="bg-light-success rounded p-3 text-center">
            <div class="fw-bold text-success">{{ totalArticles }}</div>
            <div class="text-gray-600 fs-8">Articles</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Favorite Articles -->
    <div class="mb-6">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h6 class="fw-bold text-gray-800 mb-0">Favorite Articles</h6>
        <span class="badge badge-light-danger fs-8">
          {{ favoriteArticles.length }}
        </span>
      </div>

      <div v-if="favoriteArticles.length > 0" class="space-y-2">
        <div
          v-for="article in displayedFavoriteArticles"
          :key="article.id"
          class="d-flex align-items-start p-2 rounded hover-bg-light-primary cursor-pointer"
          @click="openArticle(article)"
        >
          <div class="flex-grow-1 min-w-0">
            <div
              class="fw-semibold text-gray-900 fs-8 text-truncate"
              :title="article.title"
            >
              {{ article.title }}
            </div>
            <div class="text-gray-500 fs-9 text-truncate">
              {{ getAppNameByArticle(article) }}
            </div>
          </div>
        </div>

        <div v-if="favoriteArticles.length > 5" class="text-center pt-2">
          <button
            class="btn btn-sm btn-light-primary fs-8"
            @click="showAllFavorites = !showAllFavorites"
          >
            {{
              showAllFavorites
                ? "Show Less"
                : `Show ${favoriteArticles.length - 5} More`
            }}
          </button>
        </div>
      </div>

      <div v-else class="text-center py-4">
        <p class="text-gray-500 fs-8 mb-0">No favorite articles yet</p>
      </div>
    </div>

    <!-- Recent Articles -->
    <div class="mb-6">
      <div class="d-flex align-items-center justify-content-between mb-3">
        <h6 class="fw-bold text-gray-800 mb-0">Recent Articles</h6>
      </div>

      <div class="space-y-2">
        <div
          v-for="article in recentArticles.slice(0, 3)"
          :key="article.id"
          class="d-flex align-items-start p-2 rounded hover-bg-light-success cursor-pointer"
          @click="openArticle(article)"
        >
          <div class="flex-grow-1 min-w-0">
            <div
              class="fw-semibold text-gray-900 fs-8 text-truncate"
              :title="article.title"
            >
              {{ article.title }}
            </div>
            <div class="text-gray-500 fs-9 text-truncate">
              {{ formatDate(article.updated_at) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-6">
      <h6 class="fw-bold text-gray-800 mb-3">Quick Actions</h6>

      <div class="d-grid gap-2">
        <button
          v-if="!selectedApp"
          class="btn btn-sm btn-light-primary text-start"
          @click="showFavoriteApps"
        >
          View Favorite Apps
        </button>

        <button
          v-if="selectedApp"
          class="btn btn-sm btn-light-success text-start"
          @click="showAllCategories"
        >
          Browse Categories
        </button>

        <button
          class="btn btn-sm btn-light-warning text-start"
          @click="exportData"
        >
          Export Data
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useKnowledgebaseStore } from "@/stores/knowledgebase";
import type {
  KnowledgebaseApplication,
  KnowledgebaseArticle,
  KnowledgebaseCategory,
} from "@/types/knowledgebase";

export default defineComponent({
  name: "KnowledgebaseOverview",
  setup() {
    const store = useKnowledgebaseStore();
    const showAllFavorites = ref(false);

    const applications = computed(() => store.applications);
    const selectedApp = computed(() => store.selectedApp);
    const favoriteArticles = computed(() => store.getFavoriteArticles);
    const recentArticles = computed(() => store.getRecentArticles);

    const displayedFavoriteArticles = computed(() => {
      if (showAllFavorites.value) {
        return favoriteArticles.value;
      }
      return favoriteArticles.value.slice(0, 5);
    });

    const totalArticles = computed(() => {
      return applications.value.reduce(
        (total, app) => total + app.article_list.length,
        0,
      );
    });

    const isAppFavorite = (appId: number) => {
      return store.favorites.applications.includes(appId);
    };

    const toggleAppFavorite = (appId: number) => {
      store.toggleAppFavorite(appId);
    };

    const getTotalCategories = (app: KnowledgebaseApplication) => {
      const countCategories = (categories: KnowledgebaseCategory[]): number => {
        let count = categories.length;
        for (const category of categories) {
          if (category.children) {
            count += countCategories(category.children);
          }
        }
        return count;
      };
      return countCategories(app.category_list);
    };

    const openArticle = (article: KnowledgebaseArticle) => {
      // Find the app that contains this article
      const app = applications.value.find((app) =>
        app.article_list.some((a) => a.id === article.id),
      );
      if (app) {
        store.selectApplication(app);
        // Find the category
        const category = store.getCategoryById(article.category_id);
        if (category) {
          store.selectCategory(category);
        }
        store.selectArticle(article);
      }
    };

    const getAppNameByArticle = (article: KnowledgebaseArticle) => {
      return store.getAppNameByArticle(article);
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    };

    const showFavoriteApps = () => {
      // Navigate to home and highlight favorite apps
      store.navigateHome();
    };

    const showAllCategories = () => {
      // Clear current selection to show all categories
      store.selectCategory(undefined as any);
      store.selectArticle(undefined as any);
    };

    const exportData = () => {
      const data = selectedApp.value ? selectedApp.value : applications.value;
      const dataStr = JSON.stringify(data, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `kb-export-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    return {
      applications,
      selectedApp,
      favoriteArticles,
      recentArticles,
      displayedFavoriteArticles,
      totalArticles,
      showAllFavorites,
      isAppFavorite,
      toggleAppFavorite,
      getTotalCategories,
      openArticle,
      getAppNameByArticle,
      formatDate,
      showFavoriteApps,
      showAllCategories,
      exportData,
    };
  },
});
</script>

<style scoped>
.kb-overview {
  padding: 1rem;
}

.space-y-2 > * + * {
  margin-top: 0.5rem;
}

.hover-bg-light-primary:hover {
  background-color: #f8f9fa !important;
  transition: background-color 0.2s ease;
}

.hover-bg-light-success:hover {
  background-color: #f8f9fa !important;
  transition: background-color 0.2s ease;
}

.cursor-pointer {
  cursor: pointer;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.min-w-0 {
  min-width: 0;
}

.flex-shrink-0 {
  flex-shrink: 0;
}

/* Better spacing for small elements */
.fs-9 {
  font-size: 0.7rem;
}

.symbol-25px {
  width: 25px;
  height: 25px;
}

.symbol-25px .symbol-label {
  font-size: 0.65rem;
}

.symbol-35px {
  width: 35px;
  height: 35px;
}

/* Button improvements */
.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.d-grid {
  display: grid;
}

.gap-2 {
  gap: 0.5rem;
}

/* Badge improvements */
.badge {
  font-weight: 500;
  font-size: 0.7rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .kb-overview {
    padding: 0.75rem;
  }
}
</style>
