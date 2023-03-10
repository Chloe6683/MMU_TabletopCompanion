const db = require('./database');

const {API_KEY, ADMIN_USERNAME} = require('./app/lib/config');

const pokemonSDK = require('pokemontcgsdk');
pokemonSDK.configure({apiKey: API_KEY});

let flags = {
        "-cards": false,
}

for(let i = 2; i < process.argv.length; i++){if(flags.hasOwnProperty(process.argv[i])) flags[process.argv[i]] = true;}

const addCards = (cards) => {
        console.log("Retrieved " + cards.length + " cards");
        cards.forEach(card => {
                const sql = 'INSERT INTO cards (card_id, card_info) VALUES (?,?)';
                db.run(sql, [card.id, JSON.stringify(card)], (err) => {
                        if(err) console.log("Failed to add " + card.name + "\nReason: " + err);
                });
        });
}

const getCards = (pageNumber, cards) => {
        pokemonSDK.card.where({q:'name:*', pageSize: 250, page: pageNumber})
        .then(result => {
                if(result.error) console.log(error);
                let length = result.data.length;
                result.data.forEach(card => {
                        cards.push(card);
                });

                console.log("Page " + pageNumber + " retrieved");
                pageNumber++;

                if(length >= 250){
                        getCards(pageNumber, cards);
                }else{
                        addCards(cards);
                }
        })
}

const sql = 'DELETE FROM decks';
db.run(sql, [], function(err){
        if(err) throw err;

        console.log("Decks table: All data deleted");
        const sql = 'DELETE FROM users WHERE username != ?';

        db.run(sql, [ADMIN_USERNAME], function(err){
                if(err) throw err;

                console.log("Users table: All data deleted except admin account");
        });
});

if(flags["-cards"]){
        const sql = 'DELETE FROM cards';
        db.run(sql, [], function(err){
                if(err) throw err;

                console.log("Cards table: All data deleted");
        });

        let cards = [];
        getCards(1, cards);
}