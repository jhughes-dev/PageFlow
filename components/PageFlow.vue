<script setup lang="ts">
const aspectRatio = "8.5/11";
const height = "80vh";
const margins = "1in";
</script>

<template>
    <div class="page">
        <slot />
    </div>
</template>

<style scoped lang="scss">
.page {
    aspect-ratio: v-bind(aspectRatio);
    height: v-bind(height);
    padding: v-bind(margins);
    margin: 0.5in auto;
    overflow-y: hidden;
    box-shadow: 0px 0px 20px 10px grey;
    color: black;
    background-color: white;
}
</style>
