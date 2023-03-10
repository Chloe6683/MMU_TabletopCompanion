const db = require('../../database');

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

module.exports = {
    getAllDecks: getAllDecks,
    addNewDeck: addNewDeck,
    getOneDeck: getOneDeck,
    updateDeck: updateDeck,
    deleteDeck: deleteDeck
}