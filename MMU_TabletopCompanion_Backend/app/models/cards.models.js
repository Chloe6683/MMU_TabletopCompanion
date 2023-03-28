const {API_KEY} = require('../lib/config');
const db = require('../../database');

const pokemonSDK = require('pokemontcgsdk');
pokemonSDK.configure({apiKey: API_KEY});

const searchForCards = (filters, nestedFilters, flags, done) => {
    let sql = "SELECT id FROM Cards";
    let values = [];

    console.log(filters)
    console.log(nestedFilters)
    console.log(flags)

    if(nestedFilters.hasOwnProperty('types')){
        if(flags.typesExclusive){
            for(let i = 0; i < nestedFilters.types.length; i++){       
                sql += ' INNER JOIN Card_Types as type' + i
                sql += ' ON Cards.id = type' + i + '.cardID'
                sql += ' AND type' + i + '.name = ?'
                values.push(nestedFilters.types[i]);
            }
        }else{
            sql += ' INNER JOIN Card_Types as types'
            sql += ' ON Cards.id = types.cardID'
            sql += ' AND (types.name = ?'
            values.push(nestedFilters.types[0]);
            if(nestedFilters.types.length > 1){
                for(let i = 1; i < nestedFilters.types.length; i++){
                    sql += ' OR types.name = ?'
                    values.push(nestedFilters.types[i]);
                }
            }
            sql += ')'
        }
    }

    if(nestedFilters.hasOwnProperty('negatedTypes')){
        if(flags.negatedSubtypesExclusive){
            for(let i = 0; i < nestedFilters.negatedTypes.length; i++){       
                sql += ' INNER JOIN Card_Types as negatedType' + i
                sql += ' ON Cards.id = negatedType' + i + '.cardID'
                sql += ' AND NOT negatedType' + i + '.name = ?'
                values.push(nestedFilters.negatedTypes[i]);
            }
        }else{
            sql += ' INNER JOIN Card_Types as negatedTypes'
            sql += ' ON Cards.id = negatedTypes.cardID'
            sql += ' AND NOT (negatedTypes.name = ?'
            values.push(nestedFilters.negatedTypes[0]);
            if(nestedFilters.negatedTypes.length > 1){
                for(let i = 1; i < nestedFilters.negatedTypes.length; i++){
                    sql += ' OR negatedTypes.name = ?'
                    values.push(nestedFilters.negatedTypes[i]);
                }
            }
            sql += ')'
        }
    }


    if(nestedFilters.hasOwnProperty('subtypes')){
        if(flags.subtypesExclusive){
            for(let i = 0; i < nestedFilters.subtypes.length; i++){       
                sql += ' INNER JOIN Card_Subtypes as subtypes' + i
                sql += ' ON Cards.id = subtypes' + i + '.cardID'
                sql += ' AND subtypes' + i + '.name = ?'
                values.push(nestedFilters.subtypes[i]);
            }
        }else{
            sql += ' INNER JOIN Card_Subtypes as subtypes'
            sql += ' ON Cards.id = subtypes.cardID'
            sql += ' AND (subtypes.name = ?'
            values.push(nestedFilters.subtypes[0]);
            if(nestedFilters.subtypes.length > 1){
                for(let i = 1; i < nestedFilters.subtypes.length; i++){
                    sql += ' OR subtypes.name = ?'
                    values.push(nestedFilters.subtypes[i]);
                }
            }
            sql += ')'
        }
    }
    if(nestedFilters.hasOwnProperty('negatedSubtypes')){
        if(flags.negatedSubtypesExclusive){
            for(let i = 0; i < nestedFilters.negatedSubtypes.length; i++){       
                sql += ' INNER JOIN Card_Subtypes as negatedSubtypes' + i
                sql += ' ON Cards.id = negatedSubtypes' + i + '.cardID'
                sql += ' AND NOT negatedSubtypes' + i + '.name = ?'
                values.push(nestedFilters.negatedSubtypes[i]);
            }
        }else{
            sql += ' INNER JOIN Card_Subtypes as negatedSubtypes'
            sql += ' ON Cards.id = negatedSubtypes.cardID'
            sql += ' AND NOT (negatedSubtypes.name = ?'
            values.push(nestedFilters.negatedSubtypes[0]);
            if(nestedFilters.negatedSubtypes.length > 1){
                for(let i = 1; i < nestedFilters.negatedSubtypes.length; i++){
                    sql += ' OR negatedSubtypes.name = ?'
                    values.push(nestedFilters.negatedSubtypes[i]);
                }
            }
            sql += ')'
        }
    }

    if(nestedFilters.hasOwnProperty('legality')){
        sql += ' INNER JOIN Card_Legalities'
        sql += ' ON Cards.id = Card_Legalities.cardID'
        sql += ' AND Card_Legalities.' + nestedFilters.legality.name + ' = ?'
        values.push(nestedFilters.legality.level);
    }

    if(filters.hasOwnProperty('name')){
        sql += ' WHERE Cards.name LIKE ?';
        values.push(filters.name.replaceAll('*', '%'));
    }

    if(filters.hasOwnProperty('supertype')){
        sql += ' AND supertype = ?'
        values.push(filters.supertype);
    }

    console.log(sql)
    console.log(values)

    let ids = [];
    let results = [];
    db.each(
        sql,
        values,
        (err, row) => {
            if(err){
                console.log("Something went wrong: " + err);
                return done(err, null);
            }
            ids.push(row.id);
        },
        (err, num_rows) => {
            //Remove any potential duplicate card values due to multiple matching nested filters and update result count
            ids = [...new Set(ids)];
            num_rows = ids.length
            console.log(num_rows)
            //Calculate total pages, return error if invalid page number in filters
            let pageCount = Math.ceil(num_rows/250);
            if(filters.page > pageCount || filters.page < 1){
                console.log("Invalid Page Number");
                return done(null, [], num_rows);
            }

            //Offset for search based on page number
            let i = (filters.page - 1) * 250;
            if(filters.page > 1) i--;

            //Logic to handle cases where less than 250 results would be returned
            let iLim;
            if(num_rows - ((filters.page - 1) * 250) < 250) iLim = i + (num_rows - ((filters.page - 1) * 250));
            else iLim = i + 250;
            let targetResults = iLim - i;

            let counter = 0;
            for(i; i < iLim; i++){
                getCardByID(ids[i], (err, data) => {
                    if(err){
                        console.log("Something went wrong:" + err);
                        return done(err, null, null);
                    }
                    results.push(data);
                    counter++;
                    if(counter == targetResults) return done(null, results, num_rows);
                })
            }

        }
    );
}

const getCardByID = (id, done) => {
    const sql = 'SELECT data FROM Cards_Cached WHERE id=?';

    db.get(sql, [id], (err, row) => {
        if(err) return done(err);
        if(!row) return done(404);

        return done(null, JSON.parse(row.data));
    });
}

module.exports = {
    searchForCards: searchForCards,
    getCardByID: getCardByID
}