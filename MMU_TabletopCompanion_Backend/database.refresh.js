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
        cards.forEach((card => {
                let sql = 'INSERT INTO Cards_Cached (id, data) VALUES (?,?)';
                values = [card.id, JSON.stringify(card)];
                db.run(sql, values, (err) => {
                        if(err) console.log("Failed to add " + card.name + "'s cache data.");
                });

                addCard(card);
                addEvolutions(card);
                addSubtypes(card);

                addTypes(card);
                addWeaknesses(card);
                addResistances(card);

                addAncientTrait(card);
                addAbilities(card);
                addAttacks(card);

                addRules(card);
                addLegality(card);
                addPrices(card);
        }))
}

const addCard = (card) => {
        let sql = 'INSERT INTO Cards (id, setName, number, name, supertype, level, hp, evolvesFrom, retreatCost, convertedRetreatCost, artist, rarity, flavourText, pokedexNumbers, regulationMark, smallImage, largeImage) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        let values = [card.id, card.set.name, card.number, card.name, card.supertype, card.level, card.hp, card.evolvesFrom, card.retreatCost, card.convertedRetreatCost, card.artist, card.rarity, card.flavorText, JSON.stringify(card.nationalPokedexNumbers), card.regulationMark, card.images.small, card.images.large];
        db.run(sql, values, (err) => {
                if(err) console.log("Failed to add " + card.name + "'s data.");
        });
}
const addEvolutions = (card) => {
        if(!(card.evolvesTo === undefined)){
                card.evolvesTo.forEach(evolution => {
                        sql = 'INSERT INTO Card_Evolutions (cardID, name) VALUES (?, ?)';
                        values = [card.id, evolution];
                        db.run(sql, values, (err) => {
                                if(err) console.log("Failed to add " + card.name + "'s evolutions.");
                        });
                });
        }
}
const addSubtypes = (card) => {
        if(!(card.subtypes === undefined)){
                card.subtypes.forEach(subtype => {
                        sql = 'INSERT INTO Card_Subtypes (cardID, name) VALUES (?, ?)';
                        values = [card.id, subtype];
                        db.run(sql, values, (err) => {
                                if(err) console.log("Failed to add " + card.name + "'s subtypes.");
                        });
                });
        }
}

const addTypes = (card) => {
        if(!(card.types === undefined)){
                card.types.forEach(type => {
                        sql = 'INSERT INTO Card_Types (cardID, name) VALUES (?, ?)';
                        values = [card.id, type];
                        db.run(sql, values, (err) => {
                                if(err) console.log("Failed to add " + card.name + "'s types.");
                        });
                });
        }
}
const addWeaknesses = (card) => {
        if(!(card.weaknesses === undefined)){
                card.weaknesses.forEach(weakness => {
                        sql = 'INSERT INTO Card_Weaknesses (cardID, name, value) VALUES (?, ?, ?)';
                        values = [card.id, weakness.type, weakness.value];
                        db.run(sql, values, (err) => {
                                if(err) console.log("Failed to add " + card.name + "'s weaknesses.");
                        });
                });
        }
}
const addResistances = (card) => {
        if(!(card.resistances === undefined)){
                card.resistances.forEach(resistance => {
                        sql = 'INSERT INTO Card_Resistances (cardID, name, value) VALUES (?, ?, ?)';
                        values = [card.id, resistance.type, resistance.value];
                        db.run(sql, values, (err) => {
                                if(err) console.log("Failed to add " + card.name + "'s resistances.");
                        });
                });
        }
}

const addAncientTrait = (card) => {
        if(!(card.ancientTrait === undefined)){
                sql = 'INSERT or IGNORE INTO Ancient_Traits (name, text) VALUES (?, ?)';
                        values = [card.ancientTrait.name, card.ancientTrait.text];

                        db.run(sql, values, (err) => {
                                //Will ignore failures related to the unique constraint (multiple cards reference the same trait)
                                if(err) console.log("Failed to add " + card.ancientTrait.name);


                                sql = 'INSERT INTO Card_Ancient_Traits (cardID, name) VALUES (?, ?)';
                                values = [card.id, card.ancientTrait.name];

                                db.run(sql, values, (err) => {
                                        if(err) console.log("Failed to add " + card.name + "'s ancient trait");
                                })
                        })
        }
}
const addAbilities = (card) => {
        if(!(card.abilities === undefined)){
                card.abilities.forEach(ability => {

                        sql = 'INSERT or IGNORE INTO Abilities (name, text, type) VALUES (?, ?, ?)';
                        values = [ability.name, ability.text, ability.type];

                        db.run(sql, values, (err) => {
                                //Will ignore failures related to the unique constraint (multiple cards reference the same ability)
                                if(err) console.log("Failed to add " + ability.name);


                                sql = 'INSERT INTO Card_Abilities (cardID, name) VALUES (?, ?)';
                                values = [card.id, ability.name];

                                db.run(sql, values, (err) => {
                                        if(err) console.log("Failed to add " + card.name + "'s ability");
                                })
                        })
                });
        }
}
const addAttacks = (card) => {
        if(!(card.attacks === undefined)){
                card.attacks.forEach(attack => {

                        sql = 'INSERT or IGNORE INTO Attacks (name, cost, convertedEnergyCost, damage, text) VALUES (?, ?, ?, ?, ?)';
                        values = [attack.name, attack.cost, attack.convertedEnergyCost, attack.damage, attack.text];

                        db.run(sql, values, (err) => {
                                //Will ignore failures related to the unique constraint (multiple cards reference the same attack)
                                if(err) console.log("Failed to add " + attack.name);

                                db.get('SELECT rowid FROM Attacks WHERE name = ? AND cost = ?', [attack.name, attack.cost], (err, attack) => {
                                        sql = 'INSERT INTO Card_Attacks (cardID, attackID) VALUES (?, ?)';
                                        values = [card.id, attack.rowid];

                                        db.run(sql, values, (err) => {
                                                if(err) console.log("Failed to add " + card.name + "'s attack");
                                        })
                                })
                        })
                });
        }
}

const addRules = (card) => {
        if(!(card.rules === undefined)){
                card.rules.forEach(rule => {
                        sql = 'INSERT or IGNORE INTO Rules (text) VALUES (?)';
                        values = [rule];

                        db.run(sql, values, (err) => {
                                //Card swshp-SWSH296 contains 2 instances of the same rule (presumably unintended)
                                //Will also ignore failures related to the unique constraint (multiple cards reference the same rule)
                                if(err && card.id != "swshp-SWSH296") console.log("Failed to add " + rule);


                                        sql = 'INSERT INTO Card_Rules (cardID, text) VALUES (?, ?)';
                                        values = [card.id, rule];

                                        db.run(sql, values, (err) => {
                                                if(err && card.id != "swshp-SWSH296") console.log("Failed to add " + card.name + "'s rule");
                                        })
                        })
                });
        }
}
const addLegality = (card) => {
        sql = 'INSERT INTO Card_Legalities (cardID, standard, expanded, unlimited) VALUES (?, ?, ?, ?)';
        values = [card.id, card.legalities.standard, card.legalities.expanded, card.legalities.unlimited];
        db.run(sql, values, (err) => {
                if(err) console.log("Failed to add " + card.name + "'s legalities.");
        });
}
const addPrices = (card) => {
        if(!(card.tcgplayer === undefined)){
                sql = 'INSERT INTO Card_TCGPlayer_Data (id, URL, normal, holofoil, reverseHolofoil, firstEditionHolofoil, firstEditionNormal, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
                values = [card.id, card.tcgplayer.url, JSON.stringify(card.tcgplayer.prices.normal), JSON.stringify(card.tcgplayer.prices.holofoil), JSON.stringify(card.tcgplayer.prices.reverseHolofoil), JSON.stringify(card.tcgplayer.prices.firstEditionHolofoil), JSON.stringify(card.tcgplayer.prices.firstEditionNormal), card.tcgplayer.updatedAt];
                db.run(sql, values, (err) => {
                        if(err) console.log("Failed to add " + card.name + "'s TCGPlayer data.");
                });
        }

        if(!(card.cardmarket === undefined)){
                sql = 'INSERT INTO Cardmarket_Data (id, URL, data, updatedAt) VALUES (?, ?, ?, ?)';
                values = [card.id, card.cardmarket.url, JSON.stringify(card.cardmarket.prices), card.cardmarket.updatedAt];
                db.run(sql, values, (err) => {
                        if(err) console.log("Failed to add " + card.name + "'s Cardmarket data.");
                });
        }
}

const addSets = () => {
        pokemonSDK.set.all()
        .then(result => {
                if(result.error) console.log(error);
                console.log("Retrieved " + result.length + " sets");
                result.forEach(set => {
                        let sql = 'INSERT INTO Sets (id, name, series, printedTotal, total, ptcgoCode, releaseDate, updatedAt, symbol, logo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                        values = [set.id, set.name, set.series, set.printedTotal, set.total, set.ptcgoCode, set.releaseDate, set.updatedAt, set.images.symbol, set.images.logo];
                        db.run(sql, values, (err) => {
                                if(err) console.log("Failed to add " + set.name + "'s resistances.");
                        });

                        sql = 'INSERT INTO Set_Legalities (setID, standard, expanded, unlimited) VALUES (?, ?, ?, ?)';
                        values = [set.id, set.legalities.standard, set.legalities.expanded, set.legalities.unlimited];
                        db.run(sql, values, (err) => {
                                if(err) console.log("Failed to add " + set.name + "'s legalities.");
                        });
                });
        })
}

const addData = () => {
        pokemonSDK.type.all()
        .then(types => {
                types.forEach((type => {
                        let sql = 'INSERT INTO Types (name) VALUES (?)';
                        db.run(sql, [type], (err) => {
                                if(err) console.log("Failed to add " + type);
                        })
                }))
        });

        pokemonSDK.subtype.all()
        .then(subtypes => {
                subtypes.forEach((subtype => {
                        let sql = 'INSERT INTO Subtypes (name) VALUES (?)';
                        db.run(sql, [subtype], (err) => {
                                if(err) console.log("Failed to add " + subtype);
                        })
                }))
        });

        pokemonSDK.supertype.all()
        .then(supertypes => {
                supertypes.forEach((supertype => {
                        let sql = 'INSERT INTO Supertypes (name) VALUES (?)';
                        db.run(sql, [supertype], (err) => {
                                if(err) console.log("Failed to add " + supertype);
                        })
                }))
        });

        pokemonSDK.rarity.all()
        .then(rarities => {
                rarities.forEach((rarity => {
                        let sql = 'INSERT INTO Rarities (name) VALUES (?)';
                        db.run(sql, [rarity], (err) => {
                                if(err) console.log("Failed to add " + rarity);
                        })
                }))
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

                if(length < 250){
                        addCards(cards);
                }else{
                        getCards(pageNumber, cards);
                }
        })
}

let sql = 'DELETE FROM decks';
db.run(sql, [], function(err){
        if(err) throw err;

        console.log("Decks table: All data deleted");
        let sql = 'DELETE FROM users WHERE username != ?';

        db.run(sql, [ADMIN_USERNAME], function(err){
                if(err) throw err;

                console.log("Users table: All data deleted except admin account");
        });
});

if(flags["-cards"]){
        let tables = ["Cards_Cached", "Rarities", "Supertypes", "Subtypes", "Card_Subtypes", "Card_Evolutions", "Types", "Card_Types", "Card_Resistances", "Card_Weaknesses", "Rules", "Card_Rules", "Ancient_Traits", "Card_Ancient_Traits", "Abilities", "Card_Abilities", "Attacks", "Card_Attacks", "Card_Legalities", "Card_TCGPlayer_Data", "Cardmarket_Data", "Cards", "Sets", "Set_Legalities"]

        let counter = 0;
        tables.forEach((table => {
                let sql = 'DELETE FROM ' + table;

                db.run(sql, [], function(err){
                        if(err) throw err;
                }); 

                counter++;
                if(counter == tables.length){
                        console.log("All card data deleted");
                        let cards = [];
                        addSets();
                        addData();
                        getCards(1, cards);
                }
        }))
}