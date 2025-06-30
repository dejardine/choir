<template>
  <div class="archive-grid">
    <div class="archive-grid-header">
      <div class="label">Client</div>
      <div class="label">Industry</div>
    </div>
    <div class="archive-grid-image">
      <prismic-image v-if="currentThumbnail" :field="currentThumbnail" />
    </div>
    <template
      v-for="(projectGroup, index) in page?.archive?.data?.projects"
      :key="`archive-item-${projectGroup.case_study?.id || index}`"
    >
      <div
        v-if="projectGroup.case_study && projectGroup.case_study.data"
        class="archive-grid-item animate-in"
        :class="{ 'is-open': openItemId === projectGroup.case_study.id }"
        @click="toggleItem(projectGroup.case_study.id)"
      >
        <div class="item-content">
          <div class="project-info">
            <div class="project-info-top">
              <div class="client-column">
                <div class="value">
                  <template
                    v-if="
                      projectGroup.case_study.data.client &&
                      projectGroup.case_study.data.client.length > 0
                    "
                  >
                    <span
                      v-for="(clientItem, clientIndex) in projectGroup
                        .case_study.data.client"
                      :key="`client-${projectGroup.case_study.id}-${clientIndex}`"
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
                      :key="`industry-${projectGroup.case_study.id}-${industryIndex}`"
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
            <div class="project-info-bottom">
              <p v-if="projectGroup.case_study.data.scope" class="scope">
                {{ processScopeText(projectGroup.case_study.data.scope) }}
              </p>
              <prismic-rich-text
                v-if="projectGroup.case_study.data.header_paragraph"
                :field="projectGroup.case_study.data.header_paragraph"
              />

              <p v-if="projectGroup.case_study.data.year" class="project-year">
                {{ projectGroup.case_study.data.year }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { defineProps, onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  page: {
    type: Object,
    required: true,
  },
});

// State to track which archive item is open
const openItemId = ref(null);

// State to track current thumbnail
const currentThumbnail = ref(null);

// Method to toggle accordion items
const toggleItem = (itemId) => {
  if (openItemId.value === itemId) {
    // Close the item if it's already open
    openItemId.value = null;
  } else {
    // Open the clicked item and close any other open item
    openItemId.value = itemId;
  }
};

// Method to process scope text and replace line breaks with commas
const processScopeText = (scopeField) => {
  if (!scopeField || !scopeField.length) return "";

  // Convert the rich text field to plain text and replace line breaks with commas
  return scopeField
    .map((item) => item.text || "")
    .join(", ")
    .replace(/\s*\n\s*/g, ", ") // Replace line breaks (with any surrounding spaces) with ", "
    .replace(/,\s*,/g, ",") // Remove double commas
    .replace(/^,\s*/, "") // Remove leading comma
    .replace(/,\s*$/, ""); // Remove trailing comma
};

// Method to handle scroll and update thumbnail
const handleScroll = () => {
  if (!process.client) return;

  const items = document.querySelectorAll(".archive-grid-item");
  const imageElement = document.querySelector(".archive-grid-image");

  if (!items.length || !imageElement) return;

  const imageRect = imageElement.getBoundingClientRect();
  const imageCenterY = imageRect.top + imageRect.height / 2;

  // Find which item is closest to the image center
  let closestItem = null;
  let closestDistance = Infinity;

  items.forEach((item) => {
    const itemRect = item.getBoundingClientRect();
    const itemCenterY = itemRect.top + itemRect.height / 2;
    const distance = Math.abs(imageCenterY - itemCenterY);

    if (distance < closestDistance) {
      closestDistance = distance;
      closestItem = item;
    }
  });

  // Update thumbnail if we found a close item
  if (closestItem) {
    const itemIndex = Array.from(items).indexOf(closestItem);
    const projectGroup = props.page?.archive?.data?.projects[itemIndex];
    if (projectGroup?.case_study?.data?.image_thumbnail) {
      currentThumbnail.value = projectGroup.case_study.data.image_thumbnail;
    }
  }
};

// Debug logging to understand the data structure
onMounted(() => {
  if (process.client) {
    console.log("Archive Grid Data:", props.page?.archive?.data?.projects);
    console.log(
      "Number of projects:",
      props.page?.archive?.data?.projects?.length
    );

    // Set initial thumbnail
    if (props.page?.archive?.data?.projects?.length > 0) {
      const firstProject = props.page.archive.data.projects[0];
      if (firstProject?.case_study?.data?.image_thumbnail) {
        currentThumbnail.value = firstProject.case_study.data.image_thumbnail;
      }
    }

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    // Initial call to set thumbnail
    handleScroll();
  }
});

onUnmounted(() => {
  if (process.client) {
    // Remove scroll event listener
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleScroll);
  }
});
</script>

<style lang="scss" scoped>
.archive-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--gutter);
  padding: 0;
  padding-top: calc(50vh + var(--gutter));
  position: relative;
  z-index: 20;
}

.archive-grid-image {
  position: fixed;
  top: 50vh;
  transform: translateY(-50%);
  left: 0;
  height: var(--gutter-2);
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  overflow: visible;
  width: 100%;
  :deep(img) {
    height: auto;
    aspect-ratio: 1/1;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: calc((7 / 12 * 100vw) + var(--gutterPadding) + (7 * var(--gutter)));
    transform: translateY(-50%);
    width: calc((2.5 / 12 * 100vw) + (1.5 * var(--gutter)));
  }

  &:after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    background: var(--color-border);
    position: absolute;
    top: 0;
    left: 0;
    transform: translateY(-50%);
  }
}

.archive-grid-header {
  display: grid;
  grid-template-columns: 4fr 8fr;
  grid-column: 1 / span 12;
  gap: var(--gutter);
  width: 100%;
  .label {
    @include smallType;
    @include foundersMedium;
    letter-spacing: 0.05rem;
    text-transform: uppercase;
    color: var(--color-text-secondary);
  }
  padding: 0 var(--gutterPadding);

  padding-bottom: calc(var(--gutter-2));
  position: absolute;
  top: 50vh;
  left: 0;
  transform: translateY(-50%);
}

.project-info-bottom {
  max-width: 480px;
  max-height: 0px;
  overflow: hidden;
  transition: max-height 0.6s ease-in-out;
  :deep(h2) {
    @include bodyType;
    color: var(--color-text-secondary);
    margin-bottom: var(--gutter);
    strong {
      @include foundersRegular;
    }
  }
  .project-year {
    @include bodyType;
    color: var(--color-text-secondary);
    display: block;
    padding-bottom: var(--gutter-4);
  }

  .scope {
    @include bodyType;
    color: var(--color-text-secondary);
    padding-top: var(--gutter-3);

    margin-bottom: var(--gutter);
  }
}

.archive-grid-item {
  grid-column: auto / span 12;
  padding: 0 var(--gutterPadding);

  .item-content {
  }

  .project-info-top {
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

  // Accordion functionality
  &.is-open {
    .project-info-bottom {
      max-height: 500px; // Adjust this value based on your content
    }
    border-bottom: 1px solid var(--color-border);
  }

  // Add cursor pointer to indicate clickable
  cursor: pointer;

  // Optional: Add hover effect
  &:hover {
    .project-info-top {
      opacity: 0.8;
    }
  }
  border-bottom: 1px solid transparent;
  border-top: 1px solid transparent;
}
</style>
