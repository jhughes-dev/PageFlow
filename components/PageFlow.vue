<script setup lang="ts">
import {v4 as uuid} from "uuid";
import {type PageFlowOptions} from "@/composables/usePageFlow";

const props = withDefaults(
    defineProps<Partial<PageFlowOptions>>(),
    DefaultOptions
);

const content = ref(null);

const flow = computed(() => pageFlow(content.value, props));
const lineHeight = computed(() => flow.value.lineHeight);
const fontPixels = computed(() => flow.value.fontSize);

const scaledHeight = computed(() => flow.value.height);
const scaledMargin = computed(() => flow.value.margin);
const interiorGap = computed(() => `${0.5 * flow.value.scale}in`);
const uid = ref("");
onMounted(() => (uid.value = uuid()));
</script>

<template>
    <div class="flow-box">
        <div
            :id="`page-${idx}:${uid}`"
            class="frame"
            v-for="(page, idx) in flow.content"
            :key="idx"
        >
            <div
                v-for="elem in page"
                class="content"
                :id="`content-${idx}-${uid}`"
            >
               <p>{{ elem.innerHTML }}</p>
            </div>
        </div>
        <div ref="content" class="invisible"><slot /></div>
    </div>
</template>

<style scoped lang="scss">
.flow-box {
    display: flex;
    flex-wrap: wrap;
}
.frame {
    box-sizing: content-box;
    text-rendering: geometricPrecision;
    aspect-ratio: v-bind(aspect);
    height: v-bind(scaledHeight);
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
.content {
    margin: 0;
}
.invisible {
    display: none;
}
</style>
