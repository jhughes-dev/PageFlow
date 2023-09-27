export default defineNuxtPlugin(nuxtApp => {
    const ids = new Set(useRuntimeConfig().public.loggerIds);

    return {
        provide: {
            logger: (id: string, content: string) => {
                if (ids?.has(id) ?? false) {
                    console.log(`${id}: ${content}`)
                }
            }
        }
    }
})
