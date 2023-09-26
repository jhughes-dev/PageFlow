<template>
    <v-card class="page-flow">
        <v-img src="@/assets/images/page_wall.jpg"></v-img>
        <v-card-title class="title">Page Flow</v-card-title>
        <v-card-text class="text">
            The goal of PageFlow is to enable web developers to distribute text
            over fixed size "Pages". This could be for a focused screen reader,
            or a print preview. Or any time you have a fixed size to fill text
            in.
        </v-card-text>
    </v-card>
</template>

<style scoped lang="scss">
.page-flow {
    text-shadow: 0px 4px 6px rgba(0, 0, 0, 0.9), 0px 4px 12px rgba(0, 0, 0, 0.9);
    max-width: 500px;
    margin: 3rem auto;
    border-radius: 10pt;
    background-image: url(~~/assets/images/page_wall.jpg);
    background-size: 200%;
}

.title {
    padding: 1em;
    font-size: 32pt;
    font-weight: 700;
}

.text {
    margin: 1em;
    padding: 1em;
    font-size: 14pt;
    box-shadow: 0 0 10pt rgba(0, 0, 0, 1);
    border-radius: 10pt;
    background: rgba(0, 0, 0, 0.8);
}
</style>
