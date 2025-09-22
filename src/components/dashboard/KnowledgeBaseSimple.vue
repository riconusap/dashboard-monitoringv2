<template>
  <div class="row">
    <!-- Sidebar Navigation -->
    <div class="col-md-3">
      <div class="card">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold fs-3 mb-1">Applications</span>
          </h3>
        </div>
        <div class="card-body">
          <!-- Search Input -->
          <div class="mb-5">
            <div class="position-relative">
              <input
                v-model="searchQuery"
                type="text"
                class="form-control form-control-sm"
                placeholder="Search knowledge base..."
                @input="handleSearch"
              />
            </div>
          </div>

          <!-- Applications List -->
          <div class="mb-5">
            <h5 class="text-gray-700 fw-bold mb-3">All Applications</h5>
            <div class="d-flex flex-column">
              <div
                v-for="app in applications"
                :key="app.id"
                class="d-flex align-items-center justify-content-between text-gray-800 mb-2"
              >
                <a
                  href="#"
                  class="d-flex align-items-center text-hover-primary"
                  @click="selectApplication(app)"
                >
                  <div>
                    <span class="fw-semibold d-block">{{ app.name }}</span>
                    <span class="text-muted fs-7"
                      >{{ app.topicsCount }} topics</span
                    >
                  </div>
                </a>
                <button
                  class="btn btn-sm btn-icon"
                  @click="toggleApplicationFavorite(app.id)"
                >
                  <i class="ki-duotone ki-heart fs-5"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="col-md-9">
      <!-- Search Results -->
      <div v-if="showSearchResults" class="card mb-5">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title">Search Results</h3>
        </div>
        <div class="card-body">
          <div
            v-for="result in searchResults"
            :key="`${result.type}-${result.id}`"
            class="mb-3"
          >
            <h6>{{ result.title }}</h6>
            <p class="text-muted">{{ result.excerpt }}</p>
          </div>
        </div>
      </div>

      <!-- Application Topics -->
      <div v-else-if="selectedApplication" class="card">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title">{{ selectedApplication.name }}</h3>
        </div>
        <div class="card-body">
          <!-- Topic Content -->
          <div v-if="selectedTopic" class="mb-8">
            <h2>{{ selectedTopic.title }}</h2>
            <div v-html="renderMarkdown(selectedTopic.content)"></div>
          </div>

          <!-- Topics List -->
          <div v-else class="row">
            <div
              v-for="topic in applicationTopics"
              :key="topic.id"
              class="col-md-6 mb-4"
            >
              <div class="card">
                <div class="card-body">
                  <h5>{{ topic.title }}</h5>
                  <p class="text-muted">{{ getTopicExcerpt(topic.content) }}</p>
                  <button
                    class="btn btn-sm btn-primary"
                    @click="selectTopic(topic)"
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Default Dashboard View -->
      <div v-else class="card">
        <div class="card-header border-0 pt-5">
          <h3 class="card-title">Welcome to Knowledge Base</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div
              v-for="app in applications.slice(0, 4)"
              :key="app.id"
              class="col-md-3 mb-4"
            >
              <div class="card cursor-pointer" @click="selectApplication(app)">
                <div class="card-body text-center">
                  <h5>{{ app.name }}</h5>
                  <p class="text-muted">{{ app.topicsCount }} topics</p>
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
import { defineComponent, ref, onMounted, computed } from "vue";
import {
  knowledgeBaseService,
  type KnowledgeBaseApplication,
  type KnowledgeBaseTopic,
  type SearchResult,
} from "@/services/knowledgeBaseService";

export default defineComponent({
  name: "KnowledgeBase",
  setup() {
    const applications = ref<KnowledgeBaseApplication[]>([]);
    const selectedApplication = ref<KnowledgeBaseApplication | null>(null);
    const selectedTopic = ref<KnowledgeBaseTopic | null>(null);
    const applicationTopics = ref<KnowledgeBaseTopic[]>([]);
    const searchQuery = ref("");
    const searchResults = ref<SearchResult[]>([]);

    const showSearchResults = computed(
      () => searchQuery.value.length > 0 && searchResults.value.length >= 0,
    );

    const loadApplications = async () => {
      applications.value = await knowledgeBaseService.getApplications();
    };

    const selectApplication = async (app: KnowledgeBaseApplication) => {
      selectedApplication.value = app;
      selectedTopic.value = null;
      applicationTopics.value = await knowledgeBaseService.getTopics(app.id);
      searchQuery.value = "";
      searchResults.value = [];
    };

    const selectTopic = (topic: KnowledgeBaseTopic) => {
      selectedTopic.value = topic;
    };

    const handleSearch = async () => {
      if (searchQuery.value.length > 2) {
        searchResults.value = await knowledgeBaseService.search(
          searchQuery.value,
        );
      } else {
        searchResults.value = [];
      }
    };

    const toggleApplicationFavorite = async (id: number) => {
      await knowledgeBaseService.toggleApplicationFavorite(id);
      await loadApplications();
    };

    const getTopicExcerpt = (content: string): string => {
      const plainText = content.replace(/[#*_`]/g, "").trim();
      return plainText.substring(0, 100) + "...";
    };

    const renderMarkdown = (content: string): string => {
      return content
        .replace(/^# (.*$)/gim, "<h1>$1</h1>")
        .replace(/^## (.*$)/gim, "<h2>$1</h2>")
        .replace(/^### (.*$)/gim, "<h3>$1</h3>")
        .replace(/\*\*(.*)\*\*/gim, "<strong>$1</strong>")
        .replace(/\*(.*)\*/gim, "<em>$1</em>")
        .replace(/```([\s\S]*?)```/gim, "<pre><code>$1</code></pre>")
        .replace(/`(.*?)`/gim, "<code>$1</code>")
        .replace(/\n/g, "<br>");
    };

    onMounted(() => {
      loadApplications();
    });

    return {
      applications,
      selectedApplication,
      selectedTopic,
      applicationTopics,
      searchQuery,
      searchResults,
      showSearchResults,
      selectApplication,
      selectTopic,
      handleSearch,
      toggleApplicationFavorite,
      getTopicExcerpt,
      renderMarkdown,
    };
  },
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

pre {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
}

code {
  background-color: #f8f9fa;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
</style>
