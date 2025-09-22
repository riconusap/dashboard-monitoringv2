<template>
  <div class="kb-app-home p-6">
    <!-- Header Section -->
    <div class="mb-10">
      <div class="text-center mb-8">
        <h1 class="fw-bold text-gray-900 mb-3">Knowledge Base</h1>
        <p class="text-gray-600 fs-4 mb-0 mx-auto" style="max-width: 600px">
          Choose an application to explore comprehensive documentation and
          guides
        </p>
      </div>

      <!-- Quick Stats -->
      <div class="row g-6 mb-8">
        <div class="col-md-3">
          <div class="bg-light-info rounded-3 p-5 text-center h-100">
            <h3 class="fw-bold text-info mb-2">{{ applications.length }}</h3>
            <span class="text-gray-700 fw-semibold fs-6">Applications</span>
          </div>
        </div>
        <div class="col-md-3">
          <div class="bg-light-success rounded-3 p-5 text-center h-100">
            <h3 class="fw-bold text-success mb-2">{{ totalArticles }}</h3>
            <span class="text-gray-700 fw-semibold fs-6">Total Articles</span>
          </div>
        </div>
        <div class="col-md-3">
          <div class="bg-light-warning rounded-3 p-5 text-center h-100">
            <h3 class="fw-bold text-warning mb-2">{{ favoriteApps.length }}</h3>
            <span class="text-gray-700 fw-semibold fs-6">Favorite Apps</span>
          </div>
        </div>
        <div class="col-md-3">
          <div class="bg-light-danger rounded-3 p-5 text-center h-100">
            <h3 class="fw-bold text-danger mb-2">{{ favoriteArticles.length }}</h3>
            <span class="text-gray-700 fw-semibold fs-6">Favorite Articles</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Applications Grid -->
    <div class="mb-8">
      <h2 class="fw-bold text-gray-900 mb-6">Applications</h2>
      <div class="row g-6">
        <div
          v-for="app in applications"
          :key="app.app_id"
          class="col-lg-4 col-md-6"
        >
          <div
            class="card card-hover-shadow cursor-pointer h-100 border-0 shadow-sm"
            @click="selectApplication(app)"
          >
            <div class="card-body p-7">
              <!-- App Header -->
              <div
                class="d-flex align-items-center justify-content-between mb-5"
              >
                <div class="symbol symbol-60px bg-light-primary rounded-3">
                  <span class="symbol-label">
                    <span class="fs-1 fw-bold text-primary">{{
                      app.name.charAt(0).toUpperCase()
                    }}</span>
                  </span>
                </div>
                <button
                  class="btn btn-sm"
                  :class="
                    isAppFavorite(app.app_id)
                      ? 'btn-light-danger'
                      : 'btn-light-gray-200'
                  "
                  @click.stop="toggleAppFavorite(app.app_id)"
                  :title="
                    isAppFavorite(app.app_id)
                      ? 'Remove from favorites'
                      : 'Add to favorites'
                  "
                >
                  {{ isAppFavorite(app.app_id) ? "♥" : "♡" }}
                </button>
              </div>

              <!-- App Info -->
              <div class="mb-5">
                <h3 class="card-title fw-bold text-gray-900 mb-3 fs-4">
                  {{ app.name }}
                </h3>
                <p class="text-gray-600 fs-6 mb-0 lh-lg">
                  Comprehensive documentation and guides for {{ app.name }}
                </p>
              </div>

              <!-- App Stats -->
              <div class="mb-5">
                <div class="row g-4">
                  <div class="col-6">
                    <div class="bg-light-primary rounded-2 p-4 text-center">
                      <div class="fw-bold text-primary fs-4 mb-1">
                        {{ app.article_list.length }}
                      </div>
                      <div class="text-gray-700 fs-7 fw-semibold">Articles</div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="bg-light-success rounded-2 p-4 text-center">
                      <div class="fw-bold text-success fs-4 mb-1">
                        {{ getTotalCategories(app) }}
                      </div>
                      <div class="text-gray-700 fs-7 fw-semibold">Categories</div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- App Actions -->
              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <span
                    v-if="isAppFavorite(app.app_id)"
                    class="badge badge-light-danger fs-8"
                  >
                    ★ Favorite
                  </span>
                  <span
                    v-if="getAppFavoriteArticles(app).length > 0"
                    class="badge badge-light-warning fs-8 ms-2"
                  >
                    {{ getAppFavoriteArticles(app).length }} saved
                  </span>
                </div>
                <button class="btn btn-sm btn-primary px-4">Explore →</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div v-if="favoriteArticles.length > 0" class="mb-8">
      <h2 class="fw-bold text-gray-900 mb-6">Your Favorite Articles</h2>
      <div class="card border-0 shadow-sm">
        <div class="card-body p-6">
          <div class="row g-5">
            <div
              v-for="article in favoriteArticles.slice(0, 6)"
              :key="article.id"
              class="col-lg-4 col-md-6"
            >
              <div
                class="bg-light-primary rounded-3 p-5 cursor-pointer h-100 hover-shadow-sm transition-all"
                @click="openArticle(article)"
              >
                <div class="mb-4">
                  <span class="badge badge-primary mb-3">{{
                    getAppNameByArticle(article)
                  }}</span>
                  <h6 class="fw-bold mb-2 fs-6 text-gray-900">
                    {{ article.title }}
                  </h6>
                  <span class="text-gray-600 fs-7">
                    Updated {{ formatDate(article.updated_at) }}
                  </span>
                </div>
                <div class="text-end">
                  <button class="btn btn-sm btn-primary">Read →</button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="favoriteArticles.length > 6" class="text-center mt-6">
            <button class="btn btn-light-primary">
              View All {{ favoriteArticles.length }} Favorite Articles
            </button>
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
  KnowledgebaseCategory,
} from "@/types/knowledgebase";

export default defineComponent({
  name: "KnowledgebaseHome",
  setup() {
    const store = useKnowledgebaseStore();

    const applications = computed(() => store.applications);
    const favoriteApps = computed(() => store.getFavoriteApps);
    const favoriteArticles = computed(() => store.getFavoriteArticles);

    const totalArticles = computed(() => {
      return applications.value.reduce(
        (total, app) => total + app.article_list.length,
        0,
      );
    });

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

    const selectApplication = (app: KnowledgebaseApplication) => {
      store.selectApplication(app);
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
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    return {
      applications,
      favoriteApps,
      favoriteArticles,
      totalArticles,
      isAppFavorite,
      toggleAppFavorite,
      getTotalCategories,
      getAppFavoriteArticles,
      selectApplication,
      openArticle,
      getAppNameByArticle,
      formatDate,
    };
  },
});
</script>

<style scoped>
.kb-app-home {
  padding: 2rem;
}

.card-hover-shadow {
  transition: all 0.3s ease;
  border: 1px solid #e7e9ed;
}

.card-hover-shadow:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #5d87ff;
}

.cursor-pointer {
  cursor: pointer;
}

.transition-all {
  transition: all 0.3s ease;
}

.hover-bg-primary:hover {
  background-color: var(--bs-primary) !important;
}

.hover-text-white:hover {
  color: white !important;
}

.hover-text-white:hover * {
  color: white !important;
}

/* Responsive spacing */
@media (max-width: 768px) {
  .kb-app-home {
    padding: 1rem;
  }
  
  .mb-8 {
    margin-bottom: 2rem !important;
  }
  
  .mb-6 {
    margin-bottom: 1.5rem !important;
  }
}

/* Animation for favorite button */
.btn-icon {
  transition: all 0.2s ease;
}

.btn-icon:hover {
  transform: scale(1.1);
}

.badge {
  font-weight: 500;
}

/* Card body spacing improvements */
.card-body {
  padding: 1.5rem !important;
}

.card-body .symbol {
  flex-shrink: 0;
}

/* Better spacing for stats section */
.row.g-3 > * {
  padding: 0.5rem;
}

.row.g-4 > * {
  padding: 0.75rem;
}

.row.g-6 > * {
  padding: 1rem;
}
</style>
