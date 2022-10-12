<template>
    <div class="center">
        <h1 class="center">Page Flow</h1>
        <span class="center">
            The goal is to break up the contents of the page into new pages to
            make the disply look like printable pages.
        </span>
        <PageFlow>
            <p v-for="i in 20" :key="i">
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
    </div>
</template>

<style>
body {
    background-color: black;
    color: white;
    min-width: 100vw;
    height: 100vh;
}
.center {
    margin: 0 auto;
}
</style>
