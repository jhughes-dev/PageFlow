<script setup>
const content = [
    "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
    "Incidunt beatae tempora eius veniam explicabo ad",
    "voluptatibus temporibus neque accusantium aperiam, earum",
    "provident molestiae ducimus distinctio voluptates modi",
    "dolores ullam placeat libero itaque, debitis asperiores?",
    "Labore maxime est unde officiis ratione soluta animi",
    "mollitia dolor quasi odio, sint numquam, harum commodi",
    "itaque dolorum laboriosam porro id ipsum dignissimos",
    "quibusdam cumque. Porro voluptate cupiditate tenetur vero",
    "enim a magnam, ipsam id odit odio inventore dolorem nam",
    "tempora! In voluptatum cupiditate atque dolor porro",
    "quibusdam sapiente laborum inventore maxime, id aliquam ab,",
    "consequatur quod at. Distinctio quaerat sunt, ullam quam",
    "reiciendis repellendus maxime?",
].join(" ");
</script>
<template>
    <v-card class="page-flow">
        <v-img
            height="300"
            src="images/page_wall.jpg"
            alt="Open books pinned to a wall."
            cover
        />
        <v-card-title class="title">Page Flow</v-card-title>

        <v-card-text class="text">
            <p>
                Have you ever wanted to fit some text in an HTML page where you
                really,
                <em>really,</em>
                just want it to fit in a fixed space no matter what? HTML
                doesn't make that easy. If you have to deal with dynamic text,
                you may want to handle the overflow by "paginating" it over
                different nodes, and that gets even harder.
            </p>
            <p>
                The goal of PageFlow is to enable web developers to do just
                this, to distribute text over fixed size "pages".
            </p>
            <p>For example, this text ...</p>
            <div class="full-content">
                <p>{{ content }}</p>
            </div>
            <p>... is split into these 3in by 2in pages.</p>
            <PageFlow
                height="3in"
                width="2in"
                margin="1rem"
                font-size="12pt"
                class="flex-row"
            >
                <p>{{ content }}</p>
                <template #page_template>
                    <div class="page_template"></div>
                </template>
            </PageFlow>
            <p>
                PageFlow splits text across distinct, disconnected Nodes instead
                of overflowing, and let's you define the size and margins of the
                "page" you want to work with, or pass in a template page and
                fill with some content.
            </p>
        </v-card-text>
    </v-card>
</template>

<style scoped lang="scss">
.flex-row {
    box-sizing: content-box;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
}
.page-flow {
    max-width: 75vw;
    margin: 1rem auto;
    border-radius: 10pt;
}

.title {
    text-align: center;
    padding: 1em;
    font-size: 64pt;
    font-weight: 700;
    margin: 0 auto;
}

.text {
    margin: 2rem;
    padding: 2rem;
    font-size: 16pt;
    line-height: 1.5;
    box-shadow: 0 0 10pt rgba(0, 0, 0, 1);
    border-radius: 10pt;
    background: rgba(0, 0, 0, 0.8);
}

.full-content {
    width: 80%;
    margin: 1rem auto;
    padding: 3em;
    background-color: white;
    color: black;
}

.page_template {
    background-color: white;
    color: black;
    margin: 1rem;
    box-sizing: border-box;
    padding: 1rem;
    max-width: 2in;
    min-width: 2in;
    max-height: 3in;
    min-height: 3in;
}
</style>
