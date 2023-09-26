<template>
    <v-app class="main">
        <v-app-bar class="centered">
            <v-app-bar-title>Page Flow</v-app-bar-title>
            <NuxtLink class="bar-entry" to="/" title="Home">
                <v-icon size="large">mdi-home</v-icon>
            </NuxtLink>

            <NuxtLink to="/letter" title="8.5 by 11 inch Lorem Ipsum text">
                <span>Live Example</span>
                <v-icon>mdi-file-outline</v-icon>
            </NuxtLink>

            <NuxtLink
                class="bar-entry"
                to="https://github.com/jhughes-dev/PageFlow"
                target="_blank"
                rel="noopener noreferrer"
            >
                <v-icon size="large" class="icon" title="View on GitHub">
                    mdi-github
                </v-icon>
            </NuxtLink>
        </v-app-bar>
        <v-main>
            <NuxtPage class="main" />
        </v-main>
    </v-app>
</template>

<style lang="scss" scoped>
.main {
    margin: 1em;
}
.nav-entry {
    font-size: larger;
    width: 100%;
    margin: 1ch;
    word-wrap: b;
}
.bar-entry {
    padding: 1em;
    margin: 1ch;
}

.centered {
    display: flex;
    align-items: center;
    margin: 0 auto;
}
</style>
