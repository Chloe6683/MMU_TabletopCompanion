<template>
    <body>
    <div class="wrap">
    <div class="jumbotron jumbotron-fluid">
        <h1 class="display-1">PokémonTCG Deck Builder</h1>
        <br /> <br /> <br /> <br /><br /> 
<HomeCardList :cards="cards"  />  
        <br /> <br /> <br /> <br />
      
</div>

<br />
<div class="row row-cols-2">
<div class="col col-lg-6 col-auto">    
    <div class="menubox" v-if="token">
        <MenuOption :title="'Create New Deck'"
        :description="'Start creating a new deck using our built-in tool'"
        :imgSrc="'/src/assets/CreateDeckIcon.png'"
        :linkTo="'/create'" />
        <MenuOption :title="'Browse my Decks'"
        :description="'View your previously saved decks'"
        :imgSrc="'/src/assets/BrowseDecksIcon.png'"
        :linkTo="'/decks'" />
        <MenuOption :title="'Browse Community Decks'"
        :description="'View popular decks created by our community'"
        :imgSrc="'/src/assets/BrowseCommunityIcon.png'"
        :linkTo="'/decks'" />
        <MenuOption :title="'Import Deck'"
        :description="'Import locally saved deck data from a JSON file'"
        :imgSrc="'/src/assets/ImportIcon.png'"
        :linkTo="'/login'" />
    </div>
    <div class="menubox" v-if="!token">
        <MenuOption :title="'Create account'"
        :description="'First time here? Get started by clicking here'"
        :linkTo="'/create/user'"
        :imgSrc="'/src/assets/ImportIcon.png'" />
        <MenuOption :title="'Login'"
        :description="'Returning user? We missed you too! Click here to login.'"
        :linkTo="'/login'"
        :imgSrc="'/src/assets/BrowseCommunityIcon.png'" />
    </div>
    </div>

    <div class="col-md-5  d-none d-lg-block img-col">
        <img src="/src/assets/PokemonTCGLogo.png"  />
        <img src="/src/assets/LandingPageMenus.png" />
    </div>
</div>
<br />
</div>

    

</body>
    </template>
    
    
    <script>
import HomeCardList from '../components/HomeCardList.vue';
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