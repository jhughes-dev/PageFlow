<script setup lang="ts">
interface PageFlowOptions {
    aspect?: string;
    height?: string;
    margin?: string;
}

const props = withDefaults(defineProps<PageFlowOptions>(), {
    aspect: "8.5/11",
    height: "11in",
    margin: "1in",
});

const pageFlow = usePageFlow();
const source = ref(null);
const dest = ref(null);

const update = () => {
    console.log("Loaded");
    if (source.value && dest.value) {
        dest.value.innerHTML = "";
        pageFlow(source.value, dest.value, props);
    }
};
onMounted(update);
onUpdated(update);
</script>

<template>
    <div class="page"  ref="dest">
        <div ref="source" class="invisible"><slot /></div>
    </div>
</template>

<style scoped lang="scss">
.page {
    aspect-ratio: v-bind(aspect);
    height: v-bind(height);
    padding: v-bind(margin);
    margin: 0.5in;
    overflow-y: hidden;
    box-shadow: 0px 0px 20px 10px grey;
    color: black;
    background-color: white;
}
.invisible {
    display: none;
}
</style>
