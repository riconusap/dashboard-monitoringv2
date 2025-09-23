import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type {
  KnowledgebaseApplication,
  KnowledgebaseCategory,
  KnowledgebaseArticle,
} from "@/types/knowledgebase";
import { mockKnowledgebaseApps } from "@/stores/knowledgebaseData";
import DashboardApiService from "@/services/DashboardApiService";

export const useKnowledgebaseStore = defineStore("knowledgebase", () => {
  // State
  const applications = ref<KnowledgebaseApplication[]>([]);
  const selectedApp = ref<KnowledgebaseApplication | null>(null);
  const selectedCategory = ref<KnowledgebaseCategory | null>(null);
  const selectedArticle = ref<KnowledgebaseArticle | null>(null);
  const searchQuery = ref("");
  const searchResults = ref<any[]>([]);
  const breadcrumbs = ref<any[]>([]);

  // API state
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  const useApiData = ref(true);

  const favorites = ref<{
    applications: number[];
    categories: number[];
    articles: number[];
  }>({
    applications: [],
    categories: [],
    articles: [],
  });

  // Load favorites from localStorage
  const savedFavorites = localStorage.getItem("kb-favorites");
  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites);
  }

  // Getters
  const getAppById = computed(() => {
    return (id: number) =>
      applications.value.find((app) => app.app_id === id) || null;
  });

  const getCategoryById = computed(() => {
    return (categoryId: number): KnowledgebaseCategory | null => {
      if (!selectedApp.value) return null;

      const findCategory = (
        categories: KnowledgebaseCategory[],
      ): KnowledgebaseCategory | null => {
        for (const category of categories) {
          if (category.id === categoryId) return category;
          const found = findCategory(category.children);
          if (found) return found;
        }
        return null;
      };

      return findCategory(selectedApp.value.category_list);
    };
  });

  const getArticlesByCategory = computed(() => {
    return (categoryId: number) => {
      if (!selectedApp.value) return [];

      const getAllCategoryIds = (targetId: number): number[] => {
        const findCategoryAndChildren = (
          categories: KnowledgebaseCategory[],
        ): number[] => {
          for (const category of categories) {
            if (category.id === targetId) {
              // Found the target category, return its ID and all children IDs
              const ids = [category.id];
              const getChildrenIds = (cat: KnowledgebaseCategory): number[] => {
                let result = [cat.id];
                if (cat.children) {
                  for (const child of cat.children) {
                    result = result.concat(getChildrenIds(child));
                  }
                }
                return result;
              };
              if (category.children) {
                for (const child of category.children) {
                  ids.push(...getChildrenIds(child));
                }
              }
              return ids;
            }
            const childResult = findCategoryAndChildren(category.children);
            if (childResult.length > 0) return childResult;
          }
          return [];
        };
        return findCategoryAndChildren(selectedApp.value!.category_list);
      };

      const categoryIds = getAllCategoryIds(categoryId);
      return selectedApp.value.article_list.filter((article) =>
        categoryIds.includes(article.category_id),
      );
    };
  });

  const getFavoriteApps = computed(() => {
    return applications.value.filter((app) =>
      favorites.value.applications.includes(app.app_id),
    );
  });

  const getFavoriteArticles = computed(() => {
    const allArticles: KnowledgebaseArticle[] = [];
    applications.value.forEach((app) => {
      allArticles.push(...app.article_list);
    });
    return allArticles.filter((article) =>
      favorites.value.articles.includes(article.id),
    );
  });

  const getRecentArticles = computed(() => {
    const allArticles: KnowledgebaseArticle[] = [];
    applications.value.forEach((app) => {
      allArticles.push(...app.article_list);
    });
    return allArticles
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )
      .slice(0, 5);
  });

  const getPopularArticles = computed(() => {
    const allArticles: KnowledgebaseArticle[] = [];
    applications.value.forEach((app) => {
      allArticles.push(...app.article_list);
    });
    return allArticles.sort((a, b) => b.views - a.views).slice(0, 5);
  });

  // Actions
  const selectApplication = (app: KnowledgebaseApplication) => {
    selectedApp.value = app;
    selectedCategory.value = null;
    selectedArticle.value = null;
    updateBreadcrumbs();
  };

  const selectCategory = (category: KnowledgebaseCategory) => {
    selectedCategory.value = category;
    selectedArticle.value = null;
    updateBreadcrumbs();
  };

  const selectArticle = (article: KnowledgebaseArticle) => {
    selectedArticle.value = article;
    updateBreadcrumbs();
  };

  const toggleAppFavorite = (appId: number) => {
    const index = favorites.value.applications.indexOf(appId);
    if (index > -1) {
      favorites.value.applications.splice(index, 1);
    } else {
      favorites.value.applications.push(appId);
    }
    localStorage.setItem("kb-favorites", JSON.stringify(favorites.value));
  };

  const toggleArticleFavorite = (articleId: number) => {
    const index = favorites.value.articles.indexOf(articleId);
    if (index > -1) {
      favorites.value.articles.splice(index, 1);
    } else {
      favorites.value.articles.push(articleId);
    }
    localStorage.setItem(
      "kb_favorite_articles",
      JSON.stringify(favorites.value.articles),
    );
  };

  // API Functions
  const loadKnowledgebaseFromApi = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      // Get the full dashboard data
      const dashboardData = await DashboardApiService.getDashboardData();

      // Try to extract knowledge base applications from dashboard data
      let apiApplications: any = [];

      if (dashboardData) {
        // If dashboard has specific article_list field
        apiApplications = dashboardData;
        console.log(apiApplications);
      } else if (Array.isArray(dashboardData)) {
        // If the data itself is an array of applications
        apiApplications = dashboardData as KnowledgebaseApplication[];
      } else {
        // Fallback: try to use getKnowledgebaseApps method
        apiApplications = await DashboardApiService.getKnowledgebaseApps();
      }

      if (apiApplications && apiApplications.length > 0) {
        applications.value = apiApplications;
      } else {
        console.warn("No knowledge base data found in dashboard response");
        // Don't fallback to mock data immediately, let user see empty state
        applications.value = [];
      }
    } catch (err: any) {
      error.value = err.message || "Failed to load knowledge base data";
      console.error("Error loading knowledge base from API:", err);
      // Keep applications empty on error instead of falling back to mock data
      applications.value = [];
    } finally {
      isLoading.value = false;
    }
  };

  const searchKnowledgebaseApi = async (query: string) => {
    try {
      const apiResults = await DashboardApiService.searchKnowledgebase(query);
      if (apiResults && apiResults.length > 0) {
        searchResults.value = apiResults;
      } else {
        // Fallback to local search if API returns no results
        search(query);
      }
    } catch (err) {
      console.error("Error searching knowledge base API:", err);
      // Fallback to local search on error
      search(query);
    }
  };

  const refreshKnowledgebaseData = async () => {
    await loadKnowledgebaseFromApi();
  };

  const replaceWithDashboardData = async () => {
    isLoading.value = true;
    error.value = null;

    try {
      const dashboardData = await DashboardApiService.getDashboardData();

      // Directly replace applications with dashboard data
      // This assumes the dashboard data structure matches KnowledgebaseApplication
      if (dashboardData.data) {
        // If the data is an array, use it directly
        if (Array.isArray(dashboardData.data)) {
          applications.value = dashboardData.data as KnowledgebaseApplication[];
        }
        // If there's a specific knowledge_base field
        else if (dashboardData.data.knowledge_base) {
          applications.value = dashboardData.data.knowledge_base;
        }
        // If the entire data object should be treated as application data
        else {
          applications.value = [dashboardData.data as any];
        }

        console.log(
          "Replaced knowledge base with dashboard data:",
          applications.value,
        );
      }
    } catch (err: any) {
      error.value = err.message || "Failed to replace with dashboard data";
      console.error("Error replacing with dashboard data:", err);
    } finally {
      isLoading.value = false;
    }
  };

  const toggleDataSource = () => {
    useApiData.value = !useApiData.value;
    if (useApiData.value) {
      // Load from API
      loadKnowledgebaseFromApi();
    } else {
      // Load mock data for testing/fallback
      applications.value = mockKnowledgebaseApps;
    }
  };

  const search = (query: string) => {
    searchQuery.value = query;
    if (query.length < 2) {
      searchResults.value = [];
      return;
    }

    const results: any[] = [];
    const searchLower = query.toLowerCase();

    // Search applications
    applications.value.forEach((app) => {
      if (app.name.toLowerCase().includes(searchLower)) {
        results.push({
          type: "application",
          item: app,
          highlight: app.name,
        });
      }

      // Search categories
      const searchCategories = (categories: KnowledgebaseCategory[]) => {
        categories.forEach((category) => {
          if (category.name.toLowerCase().includes(searchLower)) {
            results.push({
              type: "category",
              item: category,
              app: app,
              highlight: category.name,
            });
          }
          if (category.children) {
            searchCategories(category.children);
          }
        });
      };
      searchCategories(app.category_list);

      // Search articles
      app.article_list.forEach((article) => {
        if (
          article.title.toLowerCase().includes(searchLower) ||
          article.content.toLowerCase().includes(searchLower) ||
          article.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        ) {
          results.push({
            type: "article",
            item: article,
            app: app,
            highlight: article.title,
          });
        }
      });
    });

    searchResults.value = results;
  };

  const clearSearch = () => {
    searchQuery.value = "";
    searchResults.value = [];
  };

  const clearFavorites = () => {
    favorites.value = {
      applications: [],
      categories: [],
      articles: [],
    };
    localStorage.removeItem("kb-favorites");
  };

  const updateBreadcrumbs = () => {
    const crumbs: any[] = [{ name: "Knowledge Base", path: "home" }];

    if (selectedApp.value) {
      crumbs.push({
        name: selectedApp.value.name,
        path: `app/${selectedApp.value.app_id}`,
      });
    }

    if (selectedCategory.value) {
      crumbs.push({
        name: selectedCategory.value.name,
        path: `category/${selectedCategory.value.id}`,
      });
    }

    if (selectedArticle.value) {
      crumbs.push({
        name: selectedArticle.value.title,
        active: true,
      });
    }

    breadcrumbs.value = crumbs;
  };

  const navigateHome = () => {
    selectedApp.value = null;
    selectedCategory.value = null;
    selectedArticle.value = null;
    clearSearch();
    updateBreadcrumbs();
  };

  const navigateToApp = (appId: number) => {
    const app = getAppById.value(appId);
    if (app) {
      selectApplication(app);
    }
  };

  const navigateToCategory = (categoryId: number) => {
    const category = getCategoryById.value(categoryId);
    if (category) {
      selectCategory(category);
    }
  };

  const getAppNameByArticle = (article: KnowledgebaseArticle) => {
    const app = applications.value.find((app) =>
      app.article_list.some((a) => a.id === article.id),
    );
    return app?.name || "";
  };

  const getCategoryNameByArticle = (article: KnowledgebaseArticle) => {
    if (!selectedApp.value) return "";

    const findCategoryName = (categories: KnowledgebaseCategory[]): string => {
      for (const category of categories) {
        if (category.id === article.category_id) return category.name;
        const found = findCategoryName(category.children);
        if (found) return found;
      }
      return "";
    };

    return findCategoryName(selectedApp.value.category_list);
  };

  // Initialize
  updateBreadcrumbs();

  // Auto-load knowledge base data from API when store is created
  loadKnowledgebaseFromApi();

  return {
    // State
    applications,
    selectedApp,
    selectedCategory,
    selectedArticle,
    searchQuery,
    searchResults,
    favorites,
    breadcrumbs,
    isLoading,
    error,
    useApiData,

    // Getters
    getAppById,
    getCategoryById,
    getArticlesByCategory,
    getFavoriteApps,
    getFavoriteArticles,
    getRecentArticles,
    getPopularArticles,

    // Actions
    selectApplication,
    selectCategory,
    selectArticle,
    toggleAppFavorite,
    toggleArticleFavorite,
    search,
    clearSearch,
    clearFavorites,
    navigateHome,
    navigateToApp,
    navigateToCategory,
    getAppNameByArticle,
    getCategoryNameByArticle,

    // API Actions
    loadKnowledgebaseFromApi,
    searchKnowledgebaseApi,
    refreshKnowledgebaseData,
    replaceWithDashboardData,
    toggleDataSource,
  };
});
