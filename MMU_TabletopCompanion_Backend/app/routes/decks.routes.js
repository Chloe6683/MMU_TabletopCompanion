const decks = require('../controllers/decks.controllers');
const auth = require("../lib/authentication");

module.exports = function(app){
    app.route("/decks")
        .get(decks.getAllDecks)
        .post(auth.isAuthenticated, decks.addNewDeck);

    app.route("/decks/:deck_id")
        .get(decks.getOneDeck)
        .patch(auth.isAuthenticated, decks.updateDeck)
        .delete(auth.isAuthenticated, decks.deleteDeck);
}