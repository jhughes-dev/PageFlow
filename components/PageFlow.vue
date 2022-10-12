<script setup lang="ts">
type props = {
    aspect: string,
    height: string,
    margin: string,
};
withDefaults(defineProps<props>(), {
    aspect: "8.5/11",
    height: "11in",
    margin: "1in",
});
</script>

<template>
    <div class="page">
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
