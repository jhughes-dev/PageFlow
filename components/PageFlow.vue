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
const parent = ref(null);

onMounted(() => {
    pageFlow(parent.value, props);
});
</script>

<template>
    <div ref="parent" class="page">
        <slot />
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
</style>
