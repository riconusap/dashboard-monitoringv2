<template>
  <div class="card h-100">
    <div class="card-body p-0">
      <KnowledgebaseMain />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import KnowledgebaseMain from "@/components/knowledgebase/KnowledgebaseMain.vue";

export default defineComponent({
  name: "KnowledgebaseTab",
  components: {
    KnowledgebaseMain,
  },
});
</script>

<style scoped>
.card {
  border: none;
  box-shadow: none;
}

.card-body {
  height: 100%;
}
</style>
