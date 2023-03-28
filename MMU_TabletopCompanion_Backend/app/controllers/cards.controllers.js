const cards = require('../models/cards.models');

const searchForCards = (req, res) => {
    let filters = {};
    let nestedFilters = {};
    let flags = {};

    if(req.body.hasOwnProperty("name")){
        filters["name"] = req.body.name;
    }else{
        filters["name"] = '%';
    }

    if(req.body.hasOwnProperty("supertype")){
        filters["supertype"] = req.body.supertype;
    }

    if(req.body.hasOwnProperty("types")){
        let types = [];
        req.body.types.forEach(element => {
            types.push(element);
        });
        nestedFilters.types = types;
    }
    if(req.body.hasOwnProperty("typesExclusive")){
        flags.typesExclusive = req.body.typesExclusive
    }else{ flags.typesExclusive = false; }


    if(req.body.hasOwnProperty("negatedTypes")){
        let negatedTypes = [];
        req.body.negatedTypes.forEach(element => {
            negatedTypes.push(element);
        });
        nestedFilters.negatedTypes = negatedTypes;
    }
    if(req.body.hasOwnProperty("negatedTypesExclusive")){
        flags.negatedTypesExclusive = req.body.negatedTypesExclusive
    }else{ flags.negatedTypesExclusive = false; }

    if(req.body.hasOwnProperty("subtypes")){
        let subtypes = [];
        req.body.subtypes.forEach(element => {
            subtypes.push(element);
        });
        nestedFilters.subtypes = subtypes;
    }
    if(req.body.hasOwnProperty("subtypesExclusive")){
        flags.subtypesExclusive = req.body.subtypesExclusive
    }else{ flags.subtypesExclusive = false; }

    if(req.body.hasOwnProperty("negatedSubtypes")){
        let negatedSubtypes = [];
        req.body.negatedSubtypes.forEach(element => {
            negatedSubtypes.push(element);
        });
        nestedFilters.negatedSubtypes = negatedSubtypes;
    }
    if(req.body.hasOwnProperty("negatedSubtypesExclusive")){
        flags.negatedSubtypesExclusive = req.body.negatedSubtypesExclusive
    }else{ flags.negatedSubtypesExclusive = false; }

    if(req.body.hasOwnProperty("legality")){
        nestedFilters["legality"] = {
            name: req.body.legality.name,
            level: req.body.legality.level
        }
    }


    let page = 1;
    if(req.body.hasOwnProperty("page")){
        page = req.body.page;
    }
    filters.page = page;

    cards.searchForCards(filters, nestedFilters, flags, (err, results, resultCount) => {
        if(err){
            console.log(err);
        }else{
            //console.log(results);
            console.log(results.length + " of " + resultCount + " Results")
        }
        
        return res.send(results);
    });
}

const getCardByID = (req, res) => {
    let card_id = req.params.card_id;

    cards.getCardByID(card_id, (err, result) => {
        if(err === 404) return res.sendStatus(404);
        if(err) return res.sendStatus(500);

        return res.status(200).send(result);
    });
}

module.exports = {
    searchForCards: searchForCards,
    getCardByID: getCardByID
}