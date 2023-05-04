import { createRouter, createWebHistory} from 'vue-router';

import LandingPage from "../views/pages/LandingPage.vue"
import Login from "../views/pages/Login.vue"
import CreateDeck from "../views/pages/CreateDeck.vue"
import DeckList from "../views/pages/DeckList.vue"

const routes = [
    { path: "/",  component: LandingPage},
    { path: "/login", component: Login},
    { path: "/create", component: CreateDeck},
    { path: "/decks", component: DeckList}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router;