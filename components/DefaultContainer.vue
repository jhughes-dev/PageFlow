<script setup lang="ts">
import {type PageFlowProps} from "@/composables/usePageFlow";
defineProps<PageFlowProps>();
</script>

<template>
    <div class="page" />
</template>

<style lang="scss">
.page {
    box-sizing: content-box;
    color: black;
    background-color: white;
    min-height: v-bind(height);
    max-height: v-bind(height);

    min-width: v-bind(width);
    max-width: v-bind(width);

    padding: v-bind(margin);

    line-height: v-bind(lineHeight);
    .content {
        font-size: v-bind(fontSize);
        line-height: v-bind(lineHeight);
    }
}
</style>
