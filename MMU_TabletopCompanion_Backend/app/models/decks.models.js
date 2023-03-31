const db = require('../../database');
const cards = require('../models/cards.models');

const getAllDecks = (done) => {
    const results = [];

    db.each(
        'SELECT * FROM decks',
        [],
        (err, row) => {
            if(err) console.log("Something went wrong: " + err);

            results.push({
                deck_id: row.deck_id,
                deck_name: row.deck_name,
                card_ids: JSON.parse(row.card_ids),
                created_by: row.created_by,
                created_by_id: row.created_by_id
            });
        },
        (err, num_rows) => {
            return done(err, num_rows, results);
        }
    );
}

const addNewDeck = (deck, done) => {
    const sql = 'INSERT INTO decks (deck_name, card_ids, created_by, created_by_id) VALUES (?,?,?,?)';
    let values = [deck.deck_name, JSON.stringify(deck.card_ids), deck.created_by, deck.created_by_id];

    db.run(
        sql,
        values,
        function(err){
            if(err) return done(err, null);
            return done(null, this.lastID);
        }
    );
}

const getOneDeck = (id, done) => {
    const sql = 'SELECT * FROM decks WHERE deck_id=?';

    db.get(sql, [id], (err, row) => {
        if(err) return done(err);
        if(!row) return done(404);

        return done(null, {
            deck_id: row.deck_id,
            deck_name: row.deck_name,
            card_ids: JSON.parse(row.card_ids),
            created_by: row.created_by,
            created_by_id: row.created_by_id
        });
    });
}

const updateDeck = (id, deck, done) => {
    const sql = 'UPDATE decks SET deck_name=?, card_ids=?, created_by=?, created_by_id=? WHERE deck_id=?';
    let values = [deck.deck_name, JSON.stringify(deck.card_ids), deck.created_by, deck.created_by_id, id];

    db.run(sql, values, (err) => {
        return done(err);
    });
}

const deleteDeck = (id, done) => {
    const sql = 'DELETE FROM decks WHERE deck_id=?';
    let values = [id];

    db.run(sql, values, (err) => {
        return done(err);
    });
}

const validateDeck = (card_ids, done) => {
    const cardArray = JSON.parse(JSON.stringify(card_ids));
    var cardCheckArray = {};
    var cardDetails = {};
    var i = 0;
    //console.log(cardArray);
    //For each card_id in cardArray, The for loop checks for the existance of an object with the name of the card_id. If no such object is found then
    //  an object in cardCheckArray is created with the name of the object as the card id and assigns the object the value of 1.
    //  if an object is found with the name of the card_id then the integer assigned to th object is iterated by 1.
    for (var x in cardArray){ 
        cards.getCardByID(cardArray[x], (err, result) => {
            //console.log("Card Aquired: " + JSON.stringify(result));
            i++
            console.log(i);
            cardDetails = JSON.parse(JSON.stringify(result));
            //console.log("Card name found: " + cardDetails["name"]);
            if (cardDetails["supertype"] == "Energy") {
                //Filter out energies
            } else if (cardCheckArray[cardDetails["name"]] === undefined) {
                cardCheckArray[cardDetails["name"]] = 1;
            } else if (cardCheckArray[cardDetails["name"]] == 3) {
                i = -60;
                return done(400);
            } else if (i == 60) {
                return done();
            } else {
                cardCheckArray[cardDetails["name"]] += 1;
                console.log("Iterated: " + cardCheckArray[cardDetails["name"]] + " = " + cardDetails["name"] + " X:" + x);
            }
        })  
    }
}

module.exports = {
    getAllDecks: getAllDecks,
    addNewDeck: addNewDeck,
    getOneDeck: getOneDeck,
    updateDeck: updateDeck,
    deleteDeck: deleteDeck,
    validateDeck: validateDeck
}