<script setup lang="ts">
const size = ref(12);
const lineHeight = ref(1.15);
const scale = ref(1);
</script>

<template>
    <v-container class="page-panel">
        <v-navigation-drawer permanent extended>
            <v-container>
                <p class="slider-label">Font Size: {{ size }} pt</p>
                <v-slider
                    :min="8"
                    :max="32"
                    step="0.5"
                    v-model="size"
                />
                <p class="slider-label">Line Height: x {{ lineHeight }}</p>
                <v-slider
                    :min="1"
                    :max="5"
                    step="0.1"
                    v-model="lineHeight"
                />
                <p class="slider-label">
                    Scale: {{ Math.floor(100 * scale) }}%
                </p>
                <v-slider
                    :min="0.1"
                    :max="5"
                    :step="0.01"
                    v-model="scale"
                />
            </v-container>
        </v-navigation-drawer>
        <div class="reference_page">
            <div class="reference_content">
                This is what the page should look like.
            </div>
        </div>
        <PageFlow
            width="8.5in"
            height="11in"
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
$interior-width: calc(8.5in - 2in);
$interior-height: calc(11in - 2in);
.reference_page {
    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid red;

    min-height: 11in;
    max-height: 11in;
    height: 11in;
    width: 8.5in;
    min-width: 8.5in;
    max-width: 8.5in;
    padding: 1in;
    .reference_content {
        border: 1px solid yellow;
        min-height: $interior-height;
        max-height: $interior-height;
        height: $interior-height;
        width: $interior-width;
        min-width: $interior-width;
        max-width: $interior-width;
        font-size: v-bind(size);
    }
    margin: 16px;
}
</style>
