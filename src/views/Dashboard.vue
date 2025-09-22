<template>
  <DashboardTabs>
    <template #monitoring>
      <AppMonitoringCards />
    </template>
    <template #knowledge>
      <KnowledgebaseTab />
    </template>
  </DashboardTabs>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import DashboardTabs from "@/components/dashboard/DashboardTabs.vue";
import AppMonitoringCards from "@/components/dashboard/AppMonitoringCards.vue";
import KnowledgebaseTab from "@/components/knowledgebase/KnowledgebaseTab.vue";

export default defineComponent({
  name: "main-dashboard",
  components: {
    DashboardTabs,
    AppMonitoringCards,
    KnowledgebaseTab,
  },
});
</script>
