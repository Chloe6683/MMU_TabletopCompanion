const decks = require('../models/decks.models');
const users = require('../models/users.models');
const Joi = require('joi');

const getAllDecks = (req, res) => {
    decks.getAllDecks((err, num_rows, results) => {
        if(err) return res.sendStatus(500);
        return res.status(200).send(results);
    });
}

const addNewDeck = (req, res) => {
    users.getIDFromToken(req.get('X-Authorization'), (err, id) => {
        if(err) return res.sendStatus(401);

        users.getOneUser(id, (err, user) => {
            if(err) return res.sendStatus(500)

            const schema = Joi.object({
                'deck_name': Joi.string().required(),
                'card_ids': Joi.array().length(60).required(),
            });

            const { error } = schema.validate(req.body);
            if(error) return res.status(400).send(error.details[0].message);

            let deck = Object.assign({}, req.body);
            deck['created_by'] = user.username;
            deck['created_by_id'] = id;

            decks.addNewDeck(deck, (err, id) => {
                if(err) return res.sendStatus(500);
                return res.status(201).send({deck_id: id});
            });
        });
    });
}

const getOneDeck = (req, res) => {
    let deck_id = parseInt(req.params.deck_id);

    decks.getOneDeck(deck_id, (err, result) => {
        if(err === 404) return res.sendStatus(404);
        if(err) return res.sendStatus(500);

        return res.status(200).send(result);
    });
}

const updateDeck = (req, res) => {
    let deck_id = parseInt(req.params.deck_id);

    users.getIDFromToken(req.get('X-Authorization'), (err, id) => {
            if(err || id === null){
                return res.sendStatus(401);
            }

            decks.getOneDeck(deck_id, (err, result) => {
                if(err === 404) return res.sendStatus(404);
                if(err) return res.sendStatus(500);
            
                if(id != result.created_by_id) return res.sendStatus(401);

                const schema = Joi.object({
                    'deck_name': Joi.string(),
                    'card_ids': Joi.array(),
                });
        
                const { error } = schema.validate(req.body);
                if(error) return res.status(400).send(error.details[0].message);

                if(req.body.hasOwnProperty("deck_name")){
                    result.deck_name = req.body.deck_name;
                }
                if(req.body.hasOwnProperty("card_ids")){
                    result.card_ids = req.body.card_ids;
                }

                decks.updateDeck(deck_id, (err) => {
                    if(err) return res.sendStatus(500);
                    return res.sendStatus(200);
                })
            });
    });
}

const deleteDeck = (req, res) => {
    let deck_id = parseInt(req.params.deck_id);

    users.getIDFromToken(req.get('X-Authorization'), (err, request_id) => {
        if(err || request_id === null){
            return res.sendStatus(401);
        }

        decks.getOneDeck(deck_id, (err, result) => {
            if(err === 404) return res.sendStatus(404);
            if(err) return res.sendStatus(500);

            users.getPrivilege(result.created_by_id, (err, owner_privilege) => {
                if(err === 404) return res.sendStatus(404);
                if(err) return res.sendStatus(500);
                if(req.privilegeLevel <= owner_privilege && request_id != result.created_by_id) return res.sendStatus(401);

                decks.deleteDeck(deck_id, (err) => {
                    if(err) return res.sendStatus(500);
                    return res.sendStatus(200);
                });
            });
        });
    });
}

module.exports = {
    getAllDecks: getAllDecks,
    addNewDeck: addNewDeck,
    getOneDeck: getOneDeck,
    updateDeck: updateDeck,
    deleteDeck: deleteDeck
}

