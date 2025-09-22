<template>
  <div class="card">
    <div class="card-body">
      <!-- Tab Navigation -->
      <ul class="nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-5 fs-6">
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'monitoring' }"
            @click="setActiveTab('monitoring')"
            href="#"
          >
            <i class="ki-duotone ki-chart-line-up fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            Monitoring App
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link"
            :class="{ active: activeTab === 'knowledge' }"
            @click="setActiveTab('knowledge')"
            href="#"
          >
            <i class="ki-duotone ki-book fs-2 me-2">
              <span class="path1"></span>
              <span class="path2"></span>
              <span class="path3"></span>
              <span class="path4"></span>
            </i>
            Knowledge Base
          </a>
        </li>
      </ul>

      <!-- Tab Content -->
      <div class="tab-content">
        <!-- Monitoring Tab -->
        <div
          v-if="activeTab === 'monitoring'"
          class="tab-pane fade show active"
        >
          <slot name="monitoring"></slot>
        </div>

        <!-- Knowledge Base Tab -->
        <div v-if="activeTab === 'knowledge'" class="tab-pane fade show active">
          <slot name="knowledge"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "DashboardTabs",
  setup() {
    const activeTab = ref("monitoring");

    const setActiveTab = (tab: string) => {
      activeTab.value = tab;
    };

    return {
      activeTab,
      setActiveTab,
    };
  },
});
</script>

<style scoped>
.nav-link {
  cursor: pointer;
}
</style>