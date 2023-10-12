<script setup lang="ts">
import {type PageFlowProps, type Flow} from "@/composables/usePageFlow";
import useHTMLRef from "~/composables/useHTMLRef";

const uuid = useUUID();
const page_id = computed(() => `pf-page-template-${uuid.value}`);
const content_id = (idx: number) => `pf-page-${idx}-${uuid.value}`;
const slots_id = computed(() => `pf-slots-${uuid.value}`);

const {$logger} = useNuxtApp();
const props = withDefaults(defineProps<Partial<PageFlowProps>>(), {
    ...DefaultOptions,
});

let containerDefaultDisplay = "";

const slots = useHTMLRef();

const container = computed(() => {
    if (process.browser) {
        return document.getElementById(page_id.value);
    }
    return undefined;
});

const flow = computed<Flow>(() => {
    if (content.value && container.value) {
        container.value.style.display = containerDefaultDisplay;
        return pageFlow(content.value, {
            ...props,
            page: page_template.value,
            container: container.value,
            content: content_template.value,
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

const default_style = computed(() =>
    used_slots.value.has("page_template") ? "page" : ""
);

const used_slots = computed(() => {
    const instance = getCurrentInstance();
    return new Set(Object.keys(instance?.slots ?? {}));
});

const getSlots = () => {
    if (process.browser) {
        const parent = document.getElementById(slots_id.value);
        return parent?.children ?? undefined;
    }
    return undefined;
};

const content = computed(() => {
    const slots = getSlots();
    if (slots && used_slots.value.has("default")) {
        return slots.item(slots.length - 1) as HTMLElement;
    }
    return undefined;
});

const page_template = computed(() => {
    const slots = getSlots();
    if (slots) {
        return slots?.namedItem("page_template") as HTMLElement;
    }
    return defaultPageFromProps(props);
});

const content_template = computed(() => {
    const slots = getSlots();
    return slots?.namedItem("content_template") as HTMLElement;
});

const update = () => {
    containerDefaultDisplay = container.value?.style?.display ?? "unset";
    const pages = flow?.value?.pages ?? [];
    pages.forEach((page, pidx) =>
        $logger("site", `Page ${pidx} content: "${page.innerText}"`)
    );
};

onMounted(update);
</script>

<template>
    <div v-bind="$attrs">
        <PageFlowPage
            v-for="(page, idx) in flow.pages"
            :id="content_id(idx)"
            :key="idx"
            :content="page"
            :class="default_style"
        />
    </div>
    <DefaultContainer :id="page_id" v-bind="props" class="inner-container" />
    <div ref="slots" :id="slots_id" class="invisible">
        <slot name="page_template" />
        <slot name="content_template" />
        <div><slot /></div>
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
