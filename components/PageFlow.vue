<script setup lang="ts">
import {type PageFlowProps, type Flow} from "@/composables/usePageFlow";
import useHTMLRef from "~/composables/useHTMLRef";

const uuid = useUUID();
const {$logger} = useNuxtApp();
const props = withDefaults(defineProps<Partial<PageFlowProps>>(), {
    ...DefaultOptions,
});

const slots = useHTMLRef();
const content = useHTMLRef();
const pageTemplate = useHTMLRef();
const contentTemplate = useHTMLRef();

const flow = computed<Flow>(() => {
    return pageFlow(content.value, {
        ...props,
        pageTemplate: pageTemplate.value,
        contentTemplate: contentTemplate.value,
    });
});

const scaledMargin = computed(() => flow.value.margin);
const scaledHeight = computed(() => flow.value.height);
const scaledWidth = computed(() => flow.value.width);
const interiorGap = computed(() => `${0.5 * flow.value.scale}in`);

const lineHeight = computed(() => flow.value.lineHeight);
const fontPixels = computed(() => flow.value.fontSize);

onMounted(() => {
    const instance = getCurrentInstance();
    const children = [...(slots?.value?.children ?? [])];
    const used_slots = new Set(Object.keys(instance?.slots ?? {}));

    if (used_slots.has("page_template")) {
        pageTemplate.value = children[0];
        slots?.value?.removeChild(children[0]);
        children.splice(0, 1);
    } else {
        pageTemplate.value = document.createElement("div");
    }

    if (used_slots.has("content_template")) {
        contentTemplate.value = children[0];
        slots?.value?.removeChild(children[0]);
        children.splice(0, 1);
    } else {
        contentTemplate.value = document.createElement("p");
    }

    content.value = slots.value;
});

onUpdated(() =>
    flow.value.pages.forEach((page, pidx) =>
        $logger("site", `Page ${pidx} content: "${page.innerText}"`)
    )
);
</script>

<template>
    <div v-bind="$attrs">
        <PageFlowPage
            v-for="(page, idx) in flow.pages"
            :id="`page-${idx}:${uuid}`"
            :key="idx"
            :content="page"
            class="page"
        />
    </div>

    <!-- Content is stored here -->
    <div ref="slots" class="invisible">
        <slot name="page_template" />
        <slot name="content_template" />
        <slot />
    </div>
    <!-- Pass a custom page via template -->
</template>

<style scoped lang="scss">
$adjusted-height: calc(v-bind(scaledHeight) - calc(2 * v-bind(scaledMargin)));
$adjusted-width: calc(v-bind(scaledWidth) - calc(2 * v-bind(scaledMargin)));

.page {
    color: black;
    background-color: white;
    min-height: $adjusted-height;
    max-height: $adjusted-height;

    min-width: $adjusted-width;
    max-width: $adjusted-width;

    padding: v-bind(scaledMargin);
    margin: v-bind(interiorGap);

    line-height: v-bind(lineHeight);
    .content {
        font-size: v-bind(fontPixels);
        line-height: v-bind(lineHeight);
    }
}
.invisible {
    display: none;
}
</style>
