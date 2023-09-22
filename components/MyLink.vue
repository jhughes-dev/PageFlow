<script setup>
defineProps(["to"]);
</script>

<template>
    <div class="clickable" @click="$router.push(to)">
        <slot></slot>
    </div>
</template>

<style scoped lang="scss">
.clickable {
    cursor: pointer;
}
</style>
