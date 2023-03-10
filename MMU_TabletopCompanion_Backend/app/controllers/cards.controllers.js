const cards = require('../models/cards.models');

const searchForCards = (req, res) => {
    let filters = [];
    console.log(req);

    if(req.body.hasOwnProperty("name")){
        let name = "name:"
        name += req.body.name;
        filters.push(name);
    }else{
        filters.push("name:*")
    }

    if(req.body.hasOwnProperty("subtypes")){
        let subtypes = "(";
        req.body.subtypes.forEach(element => {
            subtypes += "subtypes:";
            subtypes += element;

            subtypes += " AND ";
            //subtypes += " OR ";
        });

        subtypes = subtypes.slice(0, -5);
        //subtypes = subtypes.slice(0, -4);
        subtypes += ")";
        filters.push(subtypes);
    }
    if(req.body.hasOwnProperty("negatedSubtypes")){
        let negatedSubtypes = "(";
        req.body.negatedSubtypes.forEach(element => {
            negatedSubtypes += "-subtypes:";
            negatedSubtypes += element;

            negatedSubtypes += " AND ";
            //subtypes += " OR ";
        });

        negatedSubtypes = negatedSubtypes.slice(0, -5);
        //negatedSubtypes = negatedSubtypes.slice(0, -4);
        negatedSubtypes += ")";
        filters.push(negatedSubtypes);
    }

    if(req.body.hasOwnProperty("types")){
        let types = "(";
        req.body.types.forEach(element => {
            types += "types:";
            types += element;

            //types += " AND ";
            types += " OR ";
        });

        //types = types.slice(0, -5);
        types = types.slice(0, -4);
        types += ")";
        filters.push(types);
    }
    if(req.body.hasOwnProperty("negatedTypes")){
        let negatedTypes = "(";
        req.body.negatedTypes.forEach(element => {
            negatedTypes += "-types:";
            negatedTypes += element;

            negatedTypes += " AND ";
            //types += " OR ";
        });

        negatedTypes = negatedTypes.slice(0, -5);
        //negatedTypes = negatedTypes.slice(0, -4);
        negatedTypes += ")";
        filters.push(negatedTypes);
    }

    if(req.body.hasOwnProperty("legality")){
        let legality = "legalities.";
        legality += req.body.legality;
        legality += ":legal";
        filters.push(legality);
    }

    let page = 1;
    if(req.body.hasOwnProperty("page")){
        page = req.body.page;
    }

    console.log(filters)
    console.log("Page: " + page);

    cards.searchForCards(filters, page, (err, result) => {
        if(err){
            console.log(err);
        }else{
            console.log(result.length + " Results")
        }
        
        return res.send(result);
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