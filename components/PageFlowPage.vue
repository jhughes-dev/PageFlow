<script setup lang="ts">
const props = defineProps<{content: HTMLElement}>();
const mountPoint = ref<HTMLElement | null>(null);
onMounted(() => {
    mountPoint.value?.replaceWith(props.content);
});
</script>

<template>
    <div ref="mountPoint" />
</template>
