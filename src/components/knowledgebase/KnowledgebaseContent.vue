<template>
  <div class="kb-content">
    <!-- Breadcrumbs -->
    <div v-if="breadcrumbs.length > 1" class="kb-breadcrumbs mb-4">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb mb-0">
          <li
            v-for="(crumb, index) in breadcrumbs"
            :key="index"
            class="breadcrumb-item"
            :class="{ active: crumb.active }"
          >
            <a
              v-if="!crumb.active"
              href="#"
              class="text-decoration-none"
              @click.prevent="navigateToCrumb(crumb)"
            >
              {{ crumb.name }}
            </a>
            <span v-else>{{ crumb.name }}</span>
          </li>
        </ol>
      </nav>
    </div>

    <!-- Search Results -->
    <div
      v-if="searchQuery && searchResults.length > 0"
      class="kb-search-results"
    >
      <div class="card">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title">
            <i class="ki-duotone ki-magnifier fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Search Results
          </h3>
          <div class="card-toolbar">
            <span class="badge badge-light-primary">
              {{ searchResults.length }} results for "{{ searchQuery }}"
            </span>
          </div>
        </div>
        <div class="card-body">
          <div
            v-for="result in searchResults"
            :key="`${result.type}-${result.item.id || result.item.app_id}`"
            class="search-result-item mb-4 p-3 border rounded hover-elevate-up cursor-pointer"
            @click="handleSearchResultClick(result)"
          >
            <div class="d-flex align-items-start">
              <div class="symbol symbol-40px me-3">
                <span
                  class="symbol-label"
                  :class="{
                    'bg-light-primary': result.type === 'application',
                    'bg-light-success': result.type === 'category',
                    'bg-light-info': result.type === 'article',
                  }"
                >
                  <i :class="`ki-duotone fs-2 ${getResultIcon(result.type)}`">
                    <span class="path1"></span>
                    <span class="path2"></span>
                    <span
                      v-if="result.type === 'application'"
                      class="path3"
                    ></span>
                    <span
                      v-if="result.type === 'application'"
                      class="path4"
                    ></span>
                  </i>
                </span>
              </div>
              <div class="flex-grow-1">
                <h6 class="mb-1 text-gray-800">{{ result.highlight }}</h6>
                <div class="d-flex align-items-center mb-2">
                  <span
                    class="badge fs-8 me-2"
                    :class="{
                      'badge-light-primary': result.type === 'application',
                      'badge-light-success': result.type === 'category',
                      'badge-light-info': result.type === 'article',
                    }"
                  >
                    {{ result.type }}
                  </span>
                  <span v-if="result.app" class="text-muted fs-7">
                    in {{ result.app.name }}
                  </span>
                </div>
                <p
                  v-if="result.type === 'article'"
                  class="text-muted fs-7 mb-0"
                >
                  {{ getArticleExcerpt(result.item) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Article Content -->
    <div v-else-if="selectedArticle" class="kb-article">
      <div class="card">
        <div class="card-header border-0 pt-5">
          <div class="card-title flex-column align-items-start">
            <h1 class="card-label fw-bold fs-2 mb-3">
              {{ selectedArticle.title }}
            </h1>
            <div class="d-flex align-items-center text-muted fs-7">
              <div class="me-5">
                <i class="ki-duotone ki-profile-user fs-6 me-1">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                  <span class="path4"></span>
                </i>
                {{ selectedArticle.author }}
              </div>
              <div class="me-5">
                <i class="ki-duotone ki-calendar fs-6 me-1">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ formatDate(selectedArticle.updated_at) }}
              </div>
              <div class="me-5">
                <i class="ki-duotone ki-time fs-6 me-1">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                {{ selectedArticle.read_time }} min read
              </div>
              <div>
                <i class="ki-duotone ki-eye fs-6 me-1">
                  <span class="path1"></span>
                  <span class="path2"></span>
                  <span class="path3"></span>
                </i>
                {{ selectedArticle.views }} views
              </div>
            </div>
          </div>
          <div class="card-toolbar">
            <button
              class="btn btn-sm btn-icon btn-light-primary"
              :title="
                isArticleFavorite(selectedArticle.id)
                  ? 'Remove from favorites'
                  : 'Add to favorites'
              "
              @click="toggleArticleFavorite(selectedArticle.id)"
            >
              <i
                :class="`ki-duotone fs-2 ${
                  isArticleFavorite(selectedArticle.id)
                    ? 'ki-heart text-danger'
                    : 'ki-heart-half'
                }`"
              >
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
            </button>
          </div>
        </div>
        <div class="card-body">
          <!-- Tags -->
          <div class="mb-5">
            <span
              v-for="tag in selectedArticle.tags"
              :key="tag"
              class="badge badge-light-secondary fs-8 me-2 mb-2"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Content -->
          <div
            class="kb-article-content"
            v-html="selectedArticle.content"
          ></div>

          <!-- Article Footer -->
          <div class="mt-8 pt-5 border-top">
            <div class="row">
              <div class="col-md-6">
                <div class="text-muted fs-7">
                  <strong>Last updated:</strong>
                  {{ formatDate(selectedArticle.updated_at) }}
                  by {{ selectedArticle.updated_by }}
                </div>
              </div>
              <div class="col-md-6 text-end">
                <div class="text-muted fs-7">
                  <strong>Created:</strong>
                  {{ formatDate(selectedArticle.created_at) }}
                  by {{ selectedArticle.created_by }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category View (when category selected but no article) -->
    <div
      v-else-if="selectedApp && selectedCategory && !selectedArticle"
      class="kb-category-view"
    >
      <div class="card">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title fw-bold">
            {{ selectedCategory.name }}
          </h3>
          <div class="card-toolbar">
            <span class="badge badge-light-primary">
              {{ getArticlesByCategory(selectedCategory.id).length }} articles
            </span>
          </div>
        </div>
        <div class="card-body">
          <!-- Category Description -->
          <div v-if="selectedCategory.description" class="mb-6">
            <p class="text-gray-600 fs-5">{{ selectedCategory.description }}</p>
          </div>

          <!-- Articles List -->
          <div v-if="getArticlesByCategory(selectedCategory.id).length > 0">
            <div class="row g-4">
              <div
                v-for="article in getArticlesByCategory(selectedCategory.id)"
                :key="article.id"
                class="col-md-6"
              >
                <div
                  class="card card-hover-shadow cursor-pointer h-100"
                  @click="selectArticleDirectly(article)"
                >
                  <div class="card-body p-5">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <h5 class="card-title fw-bold mb-2">{{ article.title }}</h5>
                      <button
                        class="btn btn-sm btn-icon"
                        :class="
                          isArticleFavorite(article.id)
                            ? 'btn-light-danger'
                            : 'btn-light-gray-200'
                        "
                        @click.stop="toggleArticleFavorite(article.id)"
                      >
                        {{ isArticleFavorite(article.id) ? "♥" : "♡" }}
                      </button>
                    </div>
                    
                    <p class="text-gray-600 fs-6 mb-4">
                      {{ getArticleExcerpt(article) }}
                    </p>

                    <div class="d-flex justify-content-between align-items-center">
                      <div class="text-muted fs-7">
                        <div>By {{ article.author }}</div>
                        <div>{{ formatDate(article.updated_at) }}</div>
                      </div>
                      <div class="d-flex align-items-center">
                        <span class="badge badge-light-primary me-2">
                          {{ article.views }} views
                        </span>
                        <span class="badge badge-light-success">
                          {{ article.read_time }} min
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <div class="mb-4">
              <div class="symbol symbol-circle symbol-100px bg-light-primary mx-auto mb-4">
                <span class="symbol-label fs-2 text-primary">📝</span>
              </div>
            </div>
            <h4 class="fw-bold text-gray-800 mb-3">No Articles Found</h4>
            <p class="text-gray-600 fs-5 mb-0">
              This category doesn't have any articles yet.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- App Overview (when app selected but no category/article) -->
    <div
      v-else-if="selectedApp && !selectedCategory && !selectedArticle"
      class="kb-app-overview"
    >
      <KnowledgebaseAppOverview />
    </div>

    <!-- Dashboard/Home View -->
    <div v-else class="kb-dashboard">
      <KnowledgebaseHome />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useKnowledgebaseStore } from "@/stores/knowledgebase";
import type { KnowledgebaseArticle } from "@/types/knowledgebase";
import KnowledgebaseHome from "./KnowledgebaseHome.vue";
import KnowledgebaseAppOverview from "./KnowledgebaseAppOverview.vue";

export default defineComponent({
  name: "KnowledgebaseContent",
  components: {
    KnowledgebaseHome,
    KnowledgebaseAppOverview,
  },
  setup() {
    const store = useKnowledgebaseStore();

    const applications = computed(() => store.applications);
    const selectedApp = computed(() => store.selectedApp);
    const selectedCategory = computed(() => store.selectedCategory);
    const selectedArticle = computed(() => store.selectedArticle);
    const searchQuery = computed(() => store.searchQuery);
    const searchResults = computed(() => store.searchResults);
    const breadcrumbs = computed(() => store.breadcrumbs);
    const recentArticles = computed(() => store.getRecentArticles);
    const popularArticles = computed(() => store.getPopularArticles);
    const favoriteArticles = computed(() => store.getFavoriteArticles);

    const totalArticles = computed(() => {
      return applications.value.reduce(
        (total, app) => total + app.article_list.length,
        0,
      );
    });

    const totalViews = computed(() => {
      return applications.value.reduce(
        (total, app) =>
          total +
          app.article_list.reduce(
            (appTotal, article) => appTotal + article.views,
            0,
          ),
        0,
      );
    });

    const isArticleFavorite = (articleId: number) => {
      return store.favorites.articles.includes(articleId);
    };

    const toggleArticleFavorite = (articleId: number) => {
      store.toggleArticleFavorite(articleId);
    };

    const getAppNameByArticle = (article: KnowledgebaseArticle) => {
      return store.getAppNameByArticle(article);
    };

    const selectArticleDirectly = (article: KnowledgebaseArticle) => {
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

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const getArticleExcerpt = (article: KnowledgebaseArticle) => {
      // Remove HTML tags and get first 150 characters
      const plainText = article.content.replace(/<[^>]*>/g, "").trim();
      return plainText.substring(0, 150) + "...";
    };

    const getResultIcon = (type: string) => {
      switch (type) {
        case "application":
          return "ki-book text-primary";
        case "category":
          return "ki-folder text-success";
        case "article":
          return "ki-document text-info";
        default:
          return "ki-search-list";
      }
    };

    const handleSearchResultClick = (result: any) => {
      if (result.type === "application") {
        store.selectApplication(result.item);
      } else if (result.type === "category") {
        store.selectApplication(result.app);
        store.selectCategory(result.item);
      } else if (result.type === "article") {
        selectArticleDirectly(result.item);
      }
      store.clearSearch();
    };

    const navigateToCrumb = (crumb: any) => {
      if (crumb.path === "home") {
        store.navigateHome();
      } else if (crumb.path?.startsWith("app/")) {
        const appId = parseInt(crumb.path.split("/")[1]);
        store.navigateToApp(appId);
      } else if (crumb.path?.startsWith("category/")) {
        const categoryId = parseInt(crumb.path.split("/")[1]);
        store.navigateToCategory(categoryId);
      }
    };

    return {
      applications,
      selectedApp,
      selectedCategory,
      selectedArticle,
      searchQuery,
      searchResults,
      breadcrumbs,
      recentArticles,
      popularArticles,
      favoriteArticles,
      totalArticles,
      totalViews,
      isArticleFavorite,
      toggleArticleFavorite,
      getAppNameByArticle,
      selectArticleDirectly,
      formatDate,
      getArticleExcerpt,
      getResultIcon,
      handleSearchResultClick,
      navigateToCrumb,
      getArticlesByCategory: store.getArticlesByCategory,
    };
  },
});
</script>

<style scoped>
.kb-content {
  height: 100%;
  overflow-y: auto;
}

.search-result-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.cursor-pointer {
  cursor: pointer;
}

.card-hover-shadow {
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.card-hover-shadow:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
  border-color: var(--bs-primary);
}

.hover-elevate-up:hover {
  transform: translateY(-2px);
  transition: all 0.2s ease;
}

.hover-bg-light-primary:hover {
  background-color: #f8f9fa !important;
}

.hover-bg-light-success:hover {
  background-color: #f8f9fa !important;
}

.kb-article-content {
  line-height: 1.8;
}

.kb-article-content h1,
.kb-article-content h2,
.kb-article-content h3,
.kb-article-content h4,
.kb-article-content h5,
.kb-article-content h6 {
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.kb-article-content p {
  margin-bottom: 1rem;
}

.kb-article-content ul,
.kb-article-content ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.kb-article-content pre {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.kb-article-content code {
  background-color: #f8f9fa;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.kb-article-content .alert {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 0.375rem;
  border: 1px solid transparent;
}

.kb-article-content .alert-info {
  color: #0c5460;
  background-color: #cff4fc;
  border-color: #bee5eb;
}

.kb-article-content .alert-warning {
  color: #664d03;
  background-color: #fff3cd;
  border-color: #ffecb5;
}

.kb-article-content .alert-danger {
  color: #842029;
  background-color: #f8d7da;
  border-color: #f5c2c7;
}

.kb-article-content .alert-success {
  color: #0f5132;
  background-color: #d1e7dd;
  border-color: #badbcc;
}
</style>
