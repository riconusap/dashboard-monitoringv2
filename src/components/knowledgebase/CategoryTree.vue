<template>
  <div class="category-tree">
    <div
      v-for="category in filteredCategories"
      :key="category.id"
      class="category-item mb-1"
    >
      <!-- Category Button -->
      <div
        class="d-flex align-items-center justify-content-between category-header"
        :class="{ 'has-children': category.children.length > 0 }"
      >
        <button
          class="btn btn-sm btn-link text-start p-2 flex-grow-1 text-decoration-none"
          :class="{
            'fw-bold text-primary': selectedCategory?.id === category.id,
            'text-gray-700': selectedCategory?.id !== category.id,
          }"
          @click="handleCategoryClick(category)"
        >
          <span v-if="hasContent(category)" class="me-2">
            {{ isExpanded(category.id) ? "▼" : "▶" }}
          </span>
          <span v-else class="me-3"></span>
          {{ category.name }}
          <span
            v-if="getDirectArticlesForCategory(category.id).length > 0"
            class="badge badge-light-secondary ms-2 fs-9"
          >
            {{ getDirectArticlesForCategory(category.id).length }}
          </span>
        </button>

        <!-- Toggle Expand/Collapse for categories with content -->
        <button
          v-if="hasContent(category)"
          class="btn btn-sm btn-light-secondary"
          @click="toggleExpanded(category.id)"
        >
          {{ isExpanded(category.id) ? "−" : "+" }}
        </button>
      </div>

      <!-- Expanded content: subcategories and articles -->
      <div v-if="isExpanded(category.id)" class="ms-3 mt-1">
        <!-- Children Categories (recursive) -->
        <div v-if="category.children.length > 0">
          <CategoryTree
            :categories="category.children"
            :selected-category="selectedCategory"
            :expanded-items="expandedItems"
            @select-category="$emit('select-category', $event)"
            @toggle-expanded="handleToggleExpanded"
          />
        </div>

        <!-- Articles directly in this category (not in subcategories) -->
        <div
          v-if="getDirectArticlesForCategory(category.id).length > 0"
          class="category-articles"
        >
          <div
            v-for="article in getDirectArticlesForCategory(category.id)"
            :key="article.id"
            class="article-item mb-1"
          >
            <button
              class="btn btn-sm btn-link text-start py-1 px-2 w-100 text-decoration-none article-link"
              :class="{
                'text-primary fw-semibold':
                  store.selectedArticle?.id === article.id,
                'text-gray-600': store.selectedArticle?.id !== article.id,
              }"
              @click="selectArticle(article)"
            >
              <span class="text-muted me-2 fs-8">📄</span>
              <span class="fs-8">{{ article.title }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, type PropType } from "vue";
import type {
  KnowledgebaseCategory,
  KnowledgebaseArticle,
} from "@/types/knowledgebase";
import { useKnowledgebaseStore } from "@/stores/knowledgebase";

export default defineComponent({
  name: "CategoryTree",
  emits: ["select-category", "toggle-expanded"],
  props: {
    categories: {
      type: Array as PropType<KnowledgebaseCategory[]>,
      required: true,
    },
    selectedCategory: {
      type: Object as PropType<KnowledgebaseCategory | null>,
      default: null,
    },
    expandedItems: {
      type: Array as PropType<number[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const store = useKnowledgebaseStore();
    const localExpandedItems = ref<number[]>([...props.expandedItems]);

    const getDirectArticlesForCategory = (categoryId: number) => {
      if (!store.selectedApp) return [];
      // Only get articles that belong directly to this category (not subcategories)
      return store.selectedApp.article_list.filter(
        (article) => article.category_id === categoryId,
      );
    };

    const hasAnyArticles = (category: KnowledgebaseCategory): boolean => {
      // Check if this category has direct articles
      if (getDirectArticlesForCategory(category.id).length > 0) {
        return true;
      }
      
      // Recursively check if any child category has articles
      return category.children.some((child) => hasAnyArticles(child));
    };

    const filteredCategories = computed(() => {
      return props.categories.filter((category) => hasAnyArticles(category));
    });

    const hasContent = (category: KnowledgebaseCategory) => {
      return (
        category.children.length > 0 ||
        getDirectArticlesForCategory(category.id).length > 0
      );
    };

    const selectArticle = (article: KnowledgebaseArticle) => {
      store.selectArticle(article);
    };

    const isExpanded = (categoryId: number) => {
      return localExpandedItems.value.includes(categoryId);
    };

    const toggleExpanded = (categoryId: number) => {
      const index = localExpandedItems.value.indexOf(categoryId);
      if (index > -1) {
        localExpandedItems.value.splice(index, 1);
      } else {
        localExpandedItems.value.push(categoryId);
      }
      emit("toggle-expanded", categoryId);
    };

    const handleToggleExpanded = (categoryId: number) => {
      toggleExpanded(categoryId);
    };

    const handleCategoryClick = (category: KnowledgebaseCategory) => {
      // Always select the category for viewing its articles
      emit("select-category", category);
      
      // If category has content (children or articles), also expand/collapse it
      if (hasContent(category)) {
        toggleExpanded(category.id);
      }
    };

    return {
      localExpandedItems,
      filteredCategories,
      isExpanded,
      toggleExpanded,
      handleToggleExpanded,
      handleCategoryClick,
      getDirectArticlesForCategory,
      hasContent,
      selectArticle,
      store,
    };
  },
});
</script>

<style scoped>
.category-tree {
  position: relative;
}

.category-item {
  position: relative;
}

.category-header {
  border-radius: 0.375rem;
  transition: all 0.2s ease;
}

.category-header:hover {
  background-color: #f8f9fa;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.2s ease;
}

.btn-link {
  border: none !important;
  box-shadow: none !important;
}

.btn-link:hover {
  background-color: transparent !important;
}

.article-item {
  position: relative;
}

.article-link {
  border: none !important;
  box-shadow: none !important;
  color: #6c757d !important;
}

.article-link:hover {
  background-color: #f8f9fa !important;
  color: #495057 !important;
}
</style>
