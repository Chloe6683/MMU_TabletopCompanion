<template>
    <body>
        <div class="wrap">
            <div class="jumbotron jumbotron-fluid">
                 <h1 class="display-1">PokémonTCG Public Decks</h1>
            </div>

            <div class="container">

                <div class="alert alert-info">
                   <strong> Example Deck </strong> Deck Description
                </div> <br />

                <div class="alert alert-info">
                   <strong> Another Example Deck </strong> A Second Deck Description
                </div> <br />

                <!-- <DeckPreview title="Preview Deck" /> -->

            </div>

        </div>
    </body>
</template> 
    
    <script>
import HomeCardList from '../components/HomeCardList.vue';
import DeckPreview from '../components/DeckPreview.vue';
import MenuOption from '../components/MenuOption.vue';

    export default{
    data() {
        return {
            token: localStorage.getItem("session_token"),
            cards: [
                {title: "Welcome to our site!", text: "Welcome to the perfect place for all your Pokémon Trading Card Game deck building and sharing needs! We offer a comprehensive and intuitive tool to hone your concept decks, collaborate with friends decks and build on decks shared by the community."},
                {title: "Getting started", text: "Start building your custom Pokemon Trading Card deck or explore decks created by our community with ease! To begin, simply sign up for an account (or log in if you're already a member) using the menu below."}
            ]
        };
    },
    methods: {
        login() {
            this.$router.push("/login");
        }
    },
      
  


    components: { MenuOption, HomeCardList }
}
    </script>
    
    
    <style scoped>
   

    .jumbotron{

    background: 

url(../../assets/LandingPageJumbo.jpg);
color:black;
}

.menubox{
    margin-left:-0.5%;
}

.img-col img{
max-width: 100%;
max-height: auto;

}

.lead{
    margin-left:4%;
}






    </style>