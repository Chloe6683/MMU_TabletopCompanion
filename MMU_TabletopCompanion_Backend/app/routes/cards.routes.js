const cards = require('../controllers/cards.controllers')

module.exports = function(app){
    app.route("/cards")
        .get(cards.searchForCards);

    app.route("/cards/:card_id")
        .get(cards.getCardByID)
}