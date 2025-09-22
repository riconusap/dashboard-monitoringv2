<template>
  <div class="kb-app-overview p-6">
    <!-- App Overview Header -->
    <div class="mb-8">
      <div class="text-center mb-6">
        <h1 class="fw-bold text-gray-900 mb-3">{{ selectedApp.name }}</h1>
        <p class="text-gray-600 fs-4 mb-4">
          Overview and quick access to documentation
        </p>
        <button
          class="btn btn-sm"
          :class="
            isAppFavorite(selectedApp.app_id)
              ? 'btn-light-danger'
              : 'btn-light-primary'
          "
          @click="toggleAppFavorite(selectedApp.app_id)"
        >
          {{
            isAppFavorite(selectedApp.app_id)
              ? "♥ Remove from favorites"
              : "♡ Add to favorites"
          }}
        </button>
      </div>

      <!-- App Stats -->
      <div class="row g-6 mb-8">
        <div class="col-md-3">
          <div class="bg-light-info rounded-3 p-5 text-center h-100">
            <h3 class="fw-bold text-info mb-2">
              {{ selectedApp.article_list.length }}
            </h3>
            <span class="text-gray-700 fw-semibold fs-6">Total Articles</span>
          </div>
        </div>
        <div class="col-md-3">
          <div class="bg-light-success rounded-3 p-5 text-center h-100">
            <h3 class="fw-bold text-success mb-2">
              {{ getTotalCategories(selectedApp) }}
            </h3>
            <span class="text-gray-700 fw-semibold fs-6">Categories</span>
          </div>
        </div>
        <div class="col-md-3">
          <div class="bg-light-warning rounded-3 p-5 text-center h-100">
            <h3 class="fw-bold text-warning mb-2">
              {{ getAppFavoriteArticles(selectedApp).length }}
            </h3>
            <span class="text-gray-700 fw-semibold fs-6">Favorite Articles</span>
          </div>
        </div>
        <div class="col-md-3">
          <div class="bg-light-danger rounded-3 p-5 text-center h-100">
            <h3 class="fw-bold text-danger mb-2">{{ getTotalViews }}</h3>
            <span class="text-gray-700 fw-semibold fs-6">Total Views</span>
          </div>
        </div>
      </div>
    </div>
    <!-- Quick Actions -->
    <div class="row g-6 mb-8">
      <!-- Categories -->
      <div class="col-md-6">
        <div class="card h-100 border-0 shadow-sm">
          <div class="card-header border-0 pt-6 pb-0">
            <h3 class="card-title fw-bold text-gray-900 fs-4">Categories</h3>
            <div class="card-toolbar">
              <span class="badge badge-light-success">{{
                getTotalCategories(selectedApp)
              }}</span>
            </div>
          </div>
          <div class="card-body pt-4">
            <div
              v-for="category in selectedApp.category_list.slice(0, 5)"
              :key="category.id"
              class="d-flex align-items-center justify-content-between p-3 rounded hover-bg-light-success cursor-pointer mb-2"
              @click="selectCategory(category)"
            >
              <div class="d-flex align-items-center">
                <div class="symbol symbol-40px me-3 bg-light-success">
                  <span class="symbol-label">
                    <i class="ki-duotone ki-folder text-success fs-2">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </span>
                </div>
                <div>
                  <h6 class="mb-1 text-gray-800">{{ category.name }}</h6>
                  <span class="text-gray-500 fs-7">
                    {{ getArticlesByCategory(category.id).length }} articles
                  </span>
                </div>
              </div>
              <i class="ki-duotone ki-arrow-right text-gray-400 fs-4">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </div>

            <div v-if="selectedApp.category_list.length > 5" class="text-center pt-3">
              <button class="btn btn-sm btn-light-success">
                View All {{ selectedApp.category_list.length }} Categories
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Articles -->
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title">
              <i class="ki-duotone ki-time fs-2 me-2 text-primary">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              Recent Articles
            </h3>
          </div>
          <div class="card-body">
            <div
              v-for="article in getRecentAppArticles(selectedApp).slice(0, 5)"
              :key="article.id"
              class="d-flex align-items-start p-3 rounded hover-bg-light-primary cursor-pointer mb-2"
              @click="openArticle(article)"
            >
              <div class="symbol symbol-40px me-3 bg-light-primary">
                <span class="symbol-label">
                  <i class="ki-duotone ki-document text-primary fs-2">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </span>
              </div>
              <div class="flex-grow-1">
                <h6 class="mb-1 text-gray-800">{{ article.title }}</h6>
                <div class="d-flex align-items-center mb-1">
                  <span class="text-gray-500 fs-7 me-3">{{ article.author }}</span>
                  <span class="badge badge-light-primary fs-8">{{ article.read_time }} min</span>
                </div>
                <span class="text-gray-400 fs-8">
                  {{ formatDate(article.updated_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Favorite Articles -->
    <div v-if="getAppFavoriteArticles(selectedApp).length > 0" class="mb-6">
      <div class="card">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title">
            <i class="ki-duotone ki-heart fs-2 me-2 text-danger">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Your Favorite Articles
          </h3>
          <div class="card-toolbar">
            <span class="badge badge-light-danger">{{ getAppFavoriteArticles(selectedApp).length }}</span>
          </div>
        </div>
        <div class="card-body">
          <div class="row g-4">
            <div
              v-for="article in getAppFavoriteArticles(selectedApp).slice(0, 6)"
              :key="article.id"
              class="col-lg-4 col-md-6"
            >
              <div
                class="d-flex align-items-start p-3 rounded bg-light-danger cursor-pointer hover-bg-danger hover-text-white transition-all"
                @click="openArticle(article)"
              >
                <div class="symbol symbol-35px me-3">
                  <span class="symbol-label bg-danger">
                    <i class="ki-duotone ki-heart text-white fs-6">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </span>
                </div>
                <div class="flex-grow-1">
                  <h6 class="fw-bold mb-1 fs-7">{{ article.title }}</h6>
                  <p class="text-gray-600 fs-8 mb-1">{{ article.author }}</p>
                  <span class="text-gray-500 fs-8">
                    {{ formatDate(article.updated_at) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Popular Articles -->
    <div class="mb-6">
      <div class="card">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title">
            <i class="ki-duotone ki-star fs-2 me-2 text-warning">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Popular Articles
          </h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            <div
              v-for="article in getPopularAppArticles(selectedApp).slice(0, 6)"
              :key="article.id"
              class="col-lg-4 col-md-6"
            >
              <div
                class="d-flex align-items-start p-3 rounded bg-light-warning cursor-pointer hover-bg-warning hover-text-white transition-all"
                @click="openArticle(article)"
              >
                <div class="symbol symbol-35px me-3">
                  <span class="symbol-label bg-warning">
                    <i class="ki-duotone ki-eye text-white fs-6">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                  </span>
                </div>
                <div class="flex-grow-1">
                  <h6 class="fw-bold mb-1 fs-7">{{ article.title }}</h6>
                  <div class="d-flex align-items-center">
                    <span class="text-gray-600 fs-8 me-2">{{ article.views }} views</span>
                    <span class="badge badge-light-warning fs-8">{{ article.read_time }} min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useKnowledgebaseStore } from "@/stores/knowledgebase";
import type { 
  KnowledgebaseApplication, 
  KnowledgebaseArticle, 
  KnowledgebaseCategory 
} from "@/types/knowledgebase";

export default defineComponent({
  name: "KnowledgebaseAppOverview",
  setup() {
    const store = useKnowledgebaseStore();

    const selectedApp = computed(() => store.selectedApp!);

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

    const getAppFavoriteArticles = (app: KnowledgebaseApplication) => {
      return app.article_list.filter((article) =>
        store.favorites.articles.includes(article.id),
      );
    };

    const getTotalViews = computed(() => {
      if (!selectedApp.value) return 0;
      return selectedApp.value.article_list.reduce(
        (total, article) => total + article.views,
        0,
      );
    });

    const getArticlesByCategory = (categoryId: number) => {
      return store.getArticlesByCategory(categoryId);
    };

    const getRecentAppArticles = (app: KnowledgebaseApplication) => {
      return app.article_list
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
        )
        .slice(0, 10);
    };

    const getPopularAppArticles = (app: KnowledgebaseApplication) => {
      return app.article_list.sort((a, b) => b.views - a.views).slice(0, 10);
    };

    const selectCategory = (category: KnowledgebaseCategory) => {
      store.selectCategory(category);
    };

    const openArticle = (article: KnowledgebaseArticle) => {
      // Find the category
      const category = store.getCategoryById(article.category_id);
      if (category) {
        store.selectCategory(category);
      }
      store.selectArticle(article);
    };

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    return {
      selectedApp,
      isAppFavorite,
      toggleAppFavorite,
      getTotalCategories,
      getAppFavoriteArticles,
      getTotalViews,
      getArticlesByCategory,
      getRecentAppArticles,
      getPopularAppArticles,
      selectCategory,
      openArticle,
      formatDate,
    };
  },
});
</script>

<style scoped>
.kb-app-overview {
  padding: 2rem;
}

.cursor-pointer {
  cursor: pointer;
}

.transition-all {
  transition: all 0.3s ease;
}

.hover-bg-light-primary:hover {
  background-color: #f8f9fa !important;
}

.hover-bg-light-success:hover {
  background-color: #f8f9fa !important;
}

.hover-bg-danger:hover {
  background-color: var(--bs-danger) !important;
}

.hover-bg-warning:hover {
  background-color: var(--bs-warning) !important;
}

.hover-text-white:hover {
  color: white !important;
}

.hover-text-white:hover * {
  color: white !important;
}

/* Card hover effects */
.card {
  transition: all 0.3s ease;
  border: 1px solid #e7e9ed;
}

.card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Button improvements */
.btn-icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  transform: scale(1.05);
}

/* Badge improvements */
.badge {
  font-weight: 500;
}

/* Symbol improvements */
.symbol {
  flex-shrink: 0;
}

/* Responsive spacing */
@media (max-width: 768px) {
  .kb-app-overview {
    padding: 1rem;
  }
  
  .mb-6 {
    margin-bottom: 1.5rem !important;
  }
}

/* Better spacing for stats section */
.row.g-4 > * {
  padding: 0.75rem;
}

.row.g-6 > * {
  padding: 1rem;
}

/* Typography improvements */
.fs-7 {
  font-size: 0.85rem;
}

.fs-8 {
  font-size: 0.75rem;
}

.text-gray-600 {
  color: #7e8299;
}

.text-gray-500 {
  color: #a1a5b7;
}

.text-gray-400 {
  color: #b5b5c3;
}
</style>
