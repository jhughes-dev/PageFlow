<script setup lang="ts">
const size = ref(12);
</script>

<template>
    <v-container>
        <v-app-bar>
            <v-col>
                The goal is to break up the contents of the page into new pages
                to make the disply look like printable pages. I.e. the content
                flows across the pages.
            </v-col>
        </v-app-bar>
        <v-container>
            <v-slider :min="6" :max="32" v-model="size"></v-slider>
            <PageFlow
                class="centered"
                aspect="8.5/11"
                height="8in"
                margin="1in"
                :font-size="`${size}pt`"
            >
                <p v-for="i in 20" :key="i" style="font-size: 10pt">
                    {{ i }}. Lorem ipsum dolor sit amet consectetur adipisicing
                    elit. Nihil deserunt repudiandae veritatis, suscipit officia
                    quia exercitationem eaque ducimus. Nisi, asperiores! Lorem,
                    ipsum dolor sit amet consectetur adipisicing elit.
                    Repudiandae minima adipisci doloribus optio ipsa totam
                    voluptatibus maxime, molestiae quae tenetur illum esse vero.
                    Qui ratione voluptatem ipsam delectus, quasi dolorem.
                    Voluptate quam, mollitia, tempore animi maiores incidunt
                    fugit nam, corrupti distinctio quo maxime. Eveniet, saepe
                    ipsa autem at totam vero ab esse ipsam distinctio odio
                    ratione amet aliquid quam nisi quos repudiandae culpa
                    exercitationem praesentium unde earum debitis minima cum.
                    Labore minus rerum aspernatur ad? Sequi, ad maxime quaerat
                    libero dicta ipsam vero accusantium at ut nobis ab culpa
                    assumenda consequuntur voluptates quas praesentium
                    repellendus exercitationem totam, impedit veniam eligendi.
                </p>
            </PageFlow>
        </v-container>
    </v-container>
</template>

<style lang="scss" scoped>
.centered {
    margin: 3rem auto;
}
</style>
