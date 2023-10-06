<script setup lang="ts">
import {type PageFlowProps, type Flow} from "@/composables/usePageFlow";
import useHTMLRef from "~/composables/useHTMLRef";

const uuid = useUUID();
const {$logger} = useNuxtApp();
const props = withDefaults(defineProps<Partial<PageFlowProps>>(), {
    ...DefaultOptions,
});

let containerDefaultDisplay = "";

const slots = useHTMLRef();
const content = useHTMLRef();
const pageTemplate = useHTMLRef();
const contentTemplate = useHTMLRef();

const pageDefault = computed(() => defaultPageFromProps(props));
const container = computed(() => {
    const instance = getCurrentInstance();
    if (instance) {
        return instance.subTree.children[1].el;
    }
});

const flow = computed<Flow>(() => {
    if (content.value && container.value) {
        container.value.style.display = containerDefaultDisplay;
        return pageFlow(content.value, {
            ...props,
            page: pageTemplate.value ?? pageDefault.value,
            container: container.value,
            content: contentTemplate.value,
        });
    }
    return {} as Flow;
});

const scaledMargin = computed(() => flow.value?.margin ?? props.margin);
const scaledHeight = computed(() => flow.value?.height ?? props.height);
const scaledWidth = computed(() => flow.value.width ?? props.width);
const interiorGap = computed(
    () => `${0.5 * (flow.value?.scale ?? props.scale)}in`
);

const lineHeight = computed(() => flow.value?.lineHeight ?? props?.lineHeight);

const default_style = computed(() => (pageTemplate.value ? "" : "page"));
onMounted(() => {
    const instance = getCurrentInstance();
    const children = [...(slots?.value?.children ?? [])];
    const used_slots = new Set(Object.keys(instance?.slots ?? {}));
    containerDefaultDisplay = container.value?.style?.display ?? "unset";
    if (used_slots.has("page_template")) {
        pageTemplate.value = children[0];
        slots?.value?.removeChild(children[0]);
        children.splice(0, 1);
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
    flow?.value?.pages.forEach((page, pidx) =>
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
            v-class="default_style"
        />
    </div>
    <DefaultPage v-bind="props" class="inner-container" />
    <div ref="slots" class="invisible">
        <slot name="page_template" />
        <slot name="content_template" />
        <slot />
    </div>
</template>

<style scoped lang="scss">
$adjusted-height: calc(v-bind(scaledHeight) - calc(2 * v-bind(scaledMargin)));
$adjusted-width: calc(v-bind(scaledWidth) - calc(2 * v-bind(scaledMargin)));

.inner-container {
    min-height: v-bind(height);
    max-height: v-bind(height);

    min-width: v-bind(width);
    max-width: v-bind(width);
    margin: 0;
    padding: 0;
    display: flex;
}
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
        font-size: v-bind(fontSize);
        line-height: v-bind(lineHeight);
    }
}
.invisible {
    display: none;
}
</style>
