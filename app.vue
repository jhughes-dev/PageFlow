<template>
    <div class="columns">
        <div class="info" >
            <h1>Page Flow</h1>
            <span>
                The goal is to break up the contents of the page into new pages
                to make the disply look like printable pages.
                I.e. the content flows across the pages.
            </span>
            <br/>
            <br/>
            <span>
            This is just an example.
            </span>
        </div>
        <div class="page-content">
            <PageFlow aspect="8.5/11" height="6in" margin="1in">
                <p v-for="i in 20" :key="i">
                    {{i}}. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Nihil deserunt repudiandae veritatis, suscipit officia quia
                    exercitationem eaque ducimus. Nisi, asperiores! Lorem, ipsum
                    dolor sit amet consectetur adipisicing elit. Repudiandae
                    minima adipisci doloribus optio ipsa totam voluptatibus
                    maxime, molestiae quae tenetur illum esse vero. Qui ratione
                    voluptatem ipsam delectus, quasi dolorem. Voluptate quam,
                    mollitia, tempore animi maiores incidunt fugit nam, corrupti
                    distinctio quo maxime. Eveniet, saepe ipsa autem at totam
                    vero ab esse ipsam distinctio odio ratione amet aliquid quam
                    nisi quos repudiandae culpa exercitationem praesentium unde
                    earum debitis minima cum. Labore minus rerum aspernatur ad?
                    Sequi, ad maxime quaerat libero dicta ipsam vero accusantium
                    at ut nobis ab culpa assumenda consequuntur voluptates quas
                    praesentium repellendus exercitationem totam, impedit veniam
                    eligendi.
                </p>
            </PageFlow>
        </div>
    </div>
</template>

<style lang="scss">
body {
    background-color: black;
    color: white;
    min-width: 100vw;
}
.columns {
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: center;
    & > * {
        align-self: center;

    }
}
.info {
  margin: 1rem;
  width: 200px;

}
.page-content{
  margin: 1rem;
  overflow-y: hidden;
}

p {
    margin: 0;
    padding: 0;
}

</style>
