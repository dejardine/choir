<template>
  <div class="archive-grid">
    <template
      v-for="(projectGroup, index) in page?.archive?.data?.projects"
      :key="projectGroup.case_study?.id || `archive-grid-item-${index}`"
    >
      <prismic-link
        v-if="projectGroup.case_study && projectGroup.case_study.data"
        :field="projectGroup.case_study"
        class="archive-grid-item animate-in"
      >
        <div class="item-content">
          <div class="project-info">
            <!-- Client Column -->
            <div class="client-column">
              <div class="label">Client</div>
              <div class="value">
                <template
                  v-if="
                    projectGroup.case_study.data.client &&
                    projectGroup.case_study.data.client.length > 0
                  "
                >
                  <span
                    v-for="(clientItem, clientIndex) in projectGroup.case_study
                      .data.client"
                    :key="clientIndex"
                  >
                    {{
                      clientItem.client?.data?.client_name || "Unknown Client"
                    }}
                    <span
                      v-if="
                        clientIndex <
                        projectGroup.case_study.data.client.length - 1
                      "
                      >,
                    </span>
                  </span>
                </template>
                <span v-else>No client specified</span>
              </div>
            </div>

            <!-- Industry Column -->
            <div class="industry-column">
              <div class="label">Industry</div>
              <div class="value">
                <template
                  v-if="
                    projectGroup.case_study.data.industry &&
                    projectGroup.case_study.data.industry.length > 0
                  "
                >
                  <span
                    v-for="(industryItem, industryIndex) in projectGroup
                      .case_study.data.industry"
                    :key="industryIndex"
                  >
                    {{
                      industryItem.industry?.data?.industry_name ||
                      "Unknown Industry"
                    }}
                    <span
                      v-if="
                        industryIndex <
                        projectGroup.case_study.data.industry.length - 1
                      "
                      >,
                    </span>
                  </span>
                </template>
                <span v-else>No industry specified</span>
              </div>
            </div>
          </div>
        </div>
      </prismic-link>
    </template>
  </div>
</template>

<script setup>
import { defineProps } from "vue";

const props = defineProps({
  page: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.archive-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter);
  padding: 0 var(--gutterPadding);
  padding-top: 50vh;
}

.archive-grid-item {
  grid-column: auto / span 12;

  .item-content {
  }

  .project-info {
    display: grid;
    grid-template-columns: 4fr 8fr;
    gap: var(--gutter);
  }

  .client-column,
  .industry-column {
  }

  &:nth-last-child(-n + 2) {
    .item-content {
      margin-bottom: 0;
    }
  }
}
</style>
