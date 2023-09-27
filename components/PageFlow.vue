<script setup lang="ts">
import {type PageFlowProps, type Flow} from "@/composables/usePageFlow";
const uuid = useUUID();
const {$logger} = useNuxtApp();
const props = withDefaults(defineProps<Partial<PageFlowProps>>(), {
    ...DefaultOptions,
});

const content = ref(null);
const page_template = ref<Ref<HTMLElement>>({});
const content_template = ref<Ref<HTMLElement>>({});

const flow = computed<Flow>(() => {
    const pageTemplate =
        (page_template.value?.firstChild as HTMLElement) ?? undefined;
    const contentTemplate =
        (content_template.value?.firstChild as HTMLElement) ?? undefined;

    return pageFlow(content?.value, {...props, pageTemplate, contentTemplate});
});

// Cannot use this in v-bind in css directly from 'flow'
const scaledMargin = computed(() => flow.value.margin);
const scaledHeight = computed(() => flow.value.height);
const scaledWidth = computed(() => flow.value.width);
const interiorGap = computed(() => `${0.5 * flow.value.scale}in`);

const lineHeight = computed(() => flow.value.lineHeight);
const fontPixels = computed(() => flow.value.fontSize);

onUpdated(() =>
    flow.value.content.forEach((page, pidx) =>
        page.forEach((block, bidx) =>
            $logger(
                "site",
                `Page ${pidx} Block ${bidx} : content: "${block.innerText}"`
            )
        )
    )
);
</script>

<template>
    <div v-bind="$attrs" class="flow-box">
        <div
            :id="`page-${idx}:${uuid}`"
            class="page"
            v-for="(page, idx) in flow.content"
            :key="idx"
        >
            <p
                v-for="elem in page"
                class="content"
                :id="`content-${idx}-${uuid}`"
            >
                {{ elem.innerHTML }}
            </p>
        </div>
    </div>
    <!-- Content is stored here -->
    <div ref="content" class="invisible"><slot /></div>
    <!-- Pass a custom page via template -->
    <div class="invisible">
        <slot name="page_template" />
    </div>
    <!-- Pass a template for the content, props passed have precedence -->
    <!-- If multiples are passed in, should look over them-->
    <div class="invisible">
        <slot name="content_template" />
    </div>
</template>

<style scoped lang="scss">
$adjusted-height: calc(v-bind(scaledHeight) - calc(2 * v-bind(scaledMargin)));
$adjusted-width: calc(v-bind(scaledWidth) - calc(2 * v-bind(scaledMargin)));
.flow-box {
    display: flex;
    flex-wrap: wrap;
}
.page {
    box-sizing: content-box;
    text-rendering: geometricPrecision;

    min-height: $adjusted-height;
    max-height: $adjusted-height;

    min-width: $adjusted-width;
    max-width: $adjusted-width;

    padding: v-bind(scaledMargin);
    margin: v-bind(interiorGap);
    color: black;
    background-color: white;
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
