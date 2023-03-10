const {API_KEY} = require('../lib/config');
const db = require('../../database');

const pokemonSDK = require('pokemontcgsdk');
pokemonSDK.configure({apiKey: API_KEY});

const searchForCards = (filters, pageNumber, done) => {
    let filterQuery = "";

    filters.forEach(filter => {
        filterQuery += filter;
        filterQuery += " ";
    });

    let results = [];

    pokemonSDK.card.where({q: filterQuery, pageSize: 250, page: pageNumber})
    .then(result => {
        if(result.error) return res.status(result.error).send(error);

        result.data.forEach(card => {
            results.push(card);
        });
        return done(null, results);
    });
}

const getCardByID = (id, done) => {
    const sql = 'SELECT * FROM cards WHERE card_id=?';

    db.get(sql, [id], (err, row) => {
        if(err) return done(err);
        if(!row) return done(404);

        return done(null, JSON.parse(row.card_info));
    });
}

module.exports = {
    searchForCards: searchForCards,
    getCardByID: getCardByID
}