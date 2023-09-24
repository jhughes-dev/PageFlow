<script setup lang="ts">
import {type PageFlowOptions, type Flow} from "@/composables/usePageFlow";

const uuid = useUUID();

const props = withDefaults(defineProps<PageFlowOptions>(), {
    ...DefaultOptions,
    templateNode: null,
});

const content = ref(null);

const flow = computed<Flow>(() => pageFlow(content?.value, props));

// Cannot use this in v-bin in css directly from 'flow'
const scaledMargin = computed(() => flow.value.margin);
const scaledHeight = computed(() => flow.value.height);
const scaledWidth = computed(() => flow.value.width);
const interiorGap = computed(() => `${0.5 * flow.value.scale}in`);

const lineHeight = computed(() => flow.value.lineHeight);
const fontPixels = computed(() => flow.value.fontSize);
</script>

<template>
    <div class="flow-box">
        <div
            :id="`page-${idx}:${uuid}`"
            class="frame"
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
        <div ref="content" class="invisible"><slot /></div>
    </div>
</template>

<style scoped lang="scss">
$adjusted-height: calc(v-bind(scaledHeight) - calc(2 * v-bind(scaledMargin)));
$adjusted-width: calc(v-bind(scaledWidth) - calc(2 * v-bind(scaledMargin)));
.flow-box {
    display: flex;
    flex-wrap: wrap;
}
.frame {
    box-sizing: content-box;
    text-rendering: geometricPrecision;

    min-height: $adjusted-height;
    max-height: $adjusted-height;

    min-width: $adjusted-width;
    max-width: $adjusted-width;

    padding: v-bind(scaledMargin);
    margin: v-bind(interiorGap);
    box-shadow: 0px 0px 20px 10px grey;
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
