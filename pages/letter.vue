<script setup lang="ts">
const size = ref(12);
const lineHeight = ref(1);
const scale = ref(1);
</script>

<template>
    <v-container class="page-panel">
        <v-app-bar extended>
            <v-app-bar-title>
                The goal is to break up the contents of the page into new pages
                to make the disply look like printable pages. I.e. the content
                flows across the pages.
            </v-app-bar-title>
        </v-app-bar>
        <v-navigation-drawer permanent extended>
            <v-container>
                <p class="slider-label">Font Size: {{ size }} pt</p>
                <v-slider
                    :min="8"
                    :max="32"
                    step="0.5"
                    v-model="size"
                ></v-slider>
                <p class="slider-label">Line Height: x {{ lineHeight }}</p>
                <v-slider
                    :min="0.1"
                    :max="5"
                    step="0.1"
                    v-model="lineHeight"
                ></v-slider>
                <p class="slider-label">
                    Scale: {{ Math.floor(100 * scale) }}%
                </p>
                <v-slider
                    :min="0.1"
                    :max="5"
                    :step="0.01"
                    v-model="scale"
                ></v-slider>
            </v-container>
        </v-navigation-drawer>

        <PageFlow
            aspect="8.5/11"
            height="8.5in"
            margin="1in"
            :line-height="lineHeight"
            :font-size="`${size}pt`"
            :scale="scale"
        >
            <p v-for="i in 20" :key="i" style="font-size: 10pt">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil
                deserunt repudiandae veritatis, suscipit officia quia
                exercitationem eaque ducimus. Nisi, asperiores! Lorem, ipsum
                dolor sit amet consectetur adipisicing elit. Repudiandae minima
                adipisci doloribus optio ipsa totam voluptatibus maxime,
                molestiae quae tenetur illum esse vero. Qui ratione voluptatem
                ipsam delectus, quasi dolorem. Voluptate quam, mollitia, tempore
                animi maiores incidunt fugit nam, corrupti distinctio quo
                maxime. Eveniet, saepe ipsa autem at totam vero ab esse ipsam
                distinctio odio ratione amet aliquid quam nisi quos repudiandae
                culpa exercitationem praesentium unde earum debitis minima cum.
                Labore minus rerum aspernatur ad? Sequi, ad maxime quaerat
                libero dicta ipsam vero accusantium at ut nobis ab culpa
                assumenda consequuntur voluptates quas praesentium repellendus
                exercitationem totam, impedit veniam eligendi.
            </p>
        </PageFlow>
    </v-container>
</template>

<style lang="scss" scoped>
.page-panel {
    margin: 0;
    padding: 0;
    min-width: 100%;
}
.slider-label {
    min-width: 16ch;
    max-width: 16ch;
}
</style>
