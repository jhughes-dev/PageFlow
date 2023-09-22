<template>
    <v-app class="main">
        <v-app-bar>
            <MyLink class="bar-entry" to="/">
                <v-icon size="large">mdi-home</v-icon>
            </MyLink>
            <h1>Page Flow</h1>
        </v-app-bar>
        <v-navigation-drawer>
            <v-list>
                <v-list-subheader>
                    <p>Examples</p>
                </v-list-subheader>
                <v-list-item>
                    <MyLink to="/letter">8.5x11 Letter Lorem Ispum</MyLink>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
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
</style>
