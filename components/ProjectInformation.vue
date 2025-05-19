<template>
  <div class="project-information">
    <div class="project-information-header">
      <prismic-rich-text :field="project?.header_paragraph" />
    </div>
    <div class="project-information-content">
      <div class="project-information-content-left">
        <div v-for="(item, index) in project.client" :key="index">
          {{ clientNames[item.client.uid] || "Loading client..." }}
        </div>
      </div>
      <div class="project-information-content-right">
        <div class="project-information-content-right-left">
          <button class="more-button">More info</button>
          <prismic-rich-text :field="project?.scope" />
          <p class="year">{{ project?.year }}</p>
          <prismic-link :field="project?.link"></prismic-link>
        </div>
        <div class="project-information-content-right-right">
          <prismic-rich-text :field="project?.information" />
          <blockquote>
            <prismic-rich-text :field="project?.quote" />
            <cite>
              <prismic-rich-text :field="project?.quote_cite" />
            </cite>
          </blockquote>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from "vue";
import { usePrismic } from "@prismicio/vue";

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
});

const { client: prismicClient } = usePrismic();
const clientNames = ref({});

watchEffect(async () => {
  if (
    props.project &&
    props.project.client &&
    props.project.client.length > 0
  ) {
    for (const groupItem of props.project.client) {
      const clientLink = groupItem.client;
      if (clientLink && clientLink.uid && !clientNames.value[clientLink.uid]) {
        try {
          // Initialize with a loading state or skip if already fetching
          if (!clientNames.value[clientLink.uid]) {
            clientNames.value[clientLink.uid] = "Fetching..."; // Placeholder
          }

          const fetchedClient = await prismicClient.getByUID(
            "client",
            clientLink.uid
          );
          if (
            fetchedClient &&
            fetchedClient.data &&
            fetchedClient.data.client_name
          ) {
            clientNames.value[clientLink.uid] = fetchedClient.data.client_name;
          } else {
            clientNames.value[clientLink.uid] = "Client name not found";
          }
        } catch (error) {
          console.error(`Error fetching client ${clientLink.uid}:`, error);
          clientNames.value[clientLink.uid] = "Error fetching name";
        }
      }
    }
  }
});
</script>

<style lang="scss" scoped>
@import "@/assets/scss/global.scss";

.project-information {
  margin-top: 80vh;
  position: relative;
  z-index: 10;
  background-color: var(--color-background);
}

.project-information-header {
  padding: var(--gutter);
  :deep(h2) {
    @include heldaneSubheading;
    padding-bottom: var(--gutter-5);
  }
  border-bottom: 1px solid var(--color-border);
}

.project-information-content {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: var(--gutter);
  padding: var(--gutterPadding);
  padding-bottom: 25vh;
  display: grid;
}

.project-information-content-left {
  grid-column: 1 / span 4;
  :deep(div) {
    @include foundersMedium;
  }
}

.project-information-content-right {
  grid-column: 5 / span 8;
}
.more-button {
  @include noButton;
  color: var(--color-text);
  @include foundersMedium;
  position: absolute;
  top: 0;
  left: 0;
}

.project-information-content-right {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-gap: var(--gutter);
}

.project-information-content-right-left {
  position: relative;
  padding-top: var(--gutter-8);
  grid-column: 1 / span 2;
  :deep(p) {
    @include foundersMedium;
  }
  :deep(a) {
    @include foundersMedium;
  }
}

.project-information-content-right-right {
  padding-top: var(--gutter-8);
  grid-column: 3 / span 6;
  :deep(p) {
    @include largeBodyType;
    margin-bottom: var(--gutter);
    max-width: 460px;
  }
  blockquote {
    margin-top: var(--gutter-5);
    position: relative;
    cite {
      :deep(p) {
        @include smallType;
        @include foundersMedium;
        text-transform: uppercase;
        letter-spacing: 0.05rem;
      }
    }
    &:before {
      content: "“";
      font-size: 2rem;
      color: var(--color-text);
      @include largeBodyType;
      position: absolute;
      top: 0;
      left: 0;
      transform: translateX(calc(-100% - 1px));
    }
  }
}
</style>
