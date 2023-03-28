const db = require('./database');

db.run(`CREATE TABLE IF NOT EXISTS Cards_Cached (
            id TEXT PRIMARY KEY,
            data TEXT
        )`,
    (err) => {
        if(err) console.log("Failed to make Cards_Cached Table")
    }
);

db.run(`CREATE TABLE IF NOT EXISTS Cards (
            id TEXT PRIMARY KEY,
            setName TEXT,
            number TEXT,
            name TEXT,
            supertype TEXT,
            level TEXT,
            hp INTEGER,
            evolvesFrom TEXT,
            retreatCost TEXT,
            convertedRetreatCost INTEGER,
            artist TEXT,
            rarity TEXT,
            flavourText TEXT,
            pokedexNumbers TEXT,
            regulationMark TEXT,
            smallImage TEXT,
            largeImage TEXT,
            FOREIGN KEY(setName) references Sets(name),
            FOREIGN KEY(supertype) references Supertypes(name),
            FOREIGN KEY(rarity) references Rarities(name)
        )`,
    (err) => {
        if(err) console.log("Failed to make Cards Table")
    }
); 

db.run(`CREATE TABLE IF NOT EXISTS Supertypes (
    name TEXT PRIMARY KEY
        )`,
    (err) => {
        if(err) console.log("Failed to make Supertypes Table")
    }
);
db.run(`CREATE TABLE IF NOT EXISTS Rarities (
    name TEXT PRIMARY KEY
        )`,
    (err) => {
        if(err) console.log("Failed to make Rarities Table")
    }
);

db.run(`CREATE TABLE IF NOT EXISTS Card_Evolutions (
            cardID TEXT,
            name TEXT,
            PRIMARY KEY(cardID, name),
            FOREIGN KEY(cardID) references Cards(id)
        )`,
    (err) => {
        if(err) console.log("Failed to make Card_Evolutions Table")
    }
);

db.run(`CREATE TABLE IF NOT EXISTS Types (
            name TEXT PRIMARY KEY
        )`,
        (err) => {
            if(err) console.log("Failed to make Types Table")
        }
);
db.run(`CREATE TABLE IF NOT EXISTS Card_Types (
            cardID TEXT,
            name TEXT,
            PRIMARY KEY(cardID, name),
            FOREIGN KEY(cardID) references Cards(id),
            FOREIGN KEY(name) references Types(name)
        )`,
    (err) => {
        if(err) console.log("Failed to make Card_Types Table")
    }
);
db.run(`CREATE TABLE IF NOT EXISTS Card_Weaknesses (
            cardID TEXT,
            name TEXT,
            value TEXT,
            PRIMARY KEY(cardID, name),
            FOREIGN KEY(cardID) references Cards(id),
            FOREIGN KEY(name) references Types(name)
        )`,
    (err) => {
        if(err) console.log("Failed to make Card_Weaknesses Table")
    }
);
db.run(`CREATE TABLE IF NOT EXISTS Card_Resistances (
            cardID TEXT,
            name TEXT,
            value TEXT,
            PRIMARY KEY(cardID, name),
            FOREIGN KEY(cardID) references Cards(id),
            FOREIGN KEY(name) references Types(name)
        )`,
    (err) => {
        if(err) console.log("Failed to make Card_Resistances Table")
    }
);


db.run(`CREATE TABLE IF NOT EXISTS Subtypes (
        name TEXT PRIMARY KEY
        )`,
    (err) => {
        if(err) console.log("Failed to make Subtypes Table")
    }
);
db.run(`CREATE TABLE IF NOT EXISTS Card_Subtypes (
            cardID TEXT,
            name TEXT,
            PRIMARY KEY(cardID, name),
            FOREIGN KEY(cardID) references Cards(id),
            FOREIGN KEY(name) references Subtypes(name)
        )`,
    (err) => {
        if(err) console.log("Failed to make Card_Subtypes Table")
    }
);

db.run(`CREATE TABLE IF NOT EXISTS Rules (
        text TEXT PRIMARY KEY
        )`,
    (err) => {
        if(err) console.log("Failed to make Rules Table")
    }
);
db.run(`CREATE TABLE IF NOT EXISTS Card_Rules (
            cardID TEXT,
            text TEXT,
            PRIMARY KEY(cardID, text),
            FOREIGN KEY(cardID) references Cards(id),
            FOREIGN KEY(text) references Rules(text)
        )`,
    (err) => {
        if(err) console.log("Failed to make Card_Rules Table")
    }
);

db.run(`CREATE TABLE IF NOT EXISTS Ancient_Traits (
        name TEXT PRIMARY KEY,
        text TEXT
        )`,
    (err) => {
        if(err) console.log("Failed to make Ancient_Traits Table")
    }
);
db.run(`CREATE TABLE IF NOT EXISTS Card_Ancient_Traits (
            cardID TEXT PRIMARY KEY,
            name TEXT, 
            FOREIGN KEY(cardID) references Cards(id),
            FOREIGN KEY(name) references Ancient_Traits(name)
        )`,
    (err) => {
        if(err) console.log("Failed to make Card_Ancient_Traits Table")
    }
);

db.run(`CREATE TABLE IF NOT EXISTS Abilities (
        name TEXT PRIMARY KEY,
        text TEXT,
        type TEXT
        )`,
    (err) => {
        if(err) console.log("Failed to make Abilities Table")
    }
);
db.run(`CREATE TABLE IF NOT EXISTS Card_Abilities (
            cardID TEXT,
            name TEXT,
            PRIMARY KEY(cardID, name),
            FOREIGN KEY(cardID) references Cards(id),
            FOREIGN KEY(name) references Abilities(name)
        )`,
    (err) => {
        if(err) console.log("Failed to make Card_Abilities Table")
    }
);

db.run(`CREATE TABLE IF NOT EXISTS Attacks (
        name TEXT,
        cost TEXT,
        convertedEnergyCost INTEGER,
        damage TEXT,
        text TEXT,
        PRIMARY KEY(name, cost)
        )`,
    (err) => {
        if(err) console.log("Failed to make Attacks Table")
    }
);
db.run(`CREATE TABLE IF NOT EXISTS Card_Attacks (
            cardID TEXT,
            attackID INTEGER,
            PRIMARY KEY(cardID, attackID),
            FOREIGN KEY(cardID) references Cards(id),
            FOREIGN KEY(attackID) references Attacks(rowid)
        )`,
    (err) => {
        if(err) console.log("Failed to make Card_Attacks Table")
    }
);


db.run(`CREATE TABLE IF NOT EXISTS Card_Legalities (
            cardID TEXT PRIMARY KEY,
            standard TEXT,
            expanded TEXT,
            unlimited TEXT,
            FOREIGN KEY(cardID) references Cards(id)
        )`,
    (err) => {
        if(err) console.log("Failed to make Card_Legalities Table")
    }
);

db.run(`CREATE TABLE IF NOT EXISTS Sets (
            id TEXT PRIMARY KEY,
            name TEXT,
            series TEXT,
            printedTotal INTEGER,
            total INTEGER,
            ptcgoCode TEXT,
            releaseDate TEXT,
            updatedAt TEXT,
            symbol TEXT,
            logo TEXT
        )`,
    (err) => {
        if(err) console.log("Failed to make Sets Table")
    }
); 

db.run(`CREATE TABLE IF NOT EXISTS Set_Legalities (
            setID TEXT PRIMARY KEY,
            standard TEXT,
            expanded TEXT,
            unlimited TEXT,
            FOREIGN KEY(setID) references Sets(id)
        )`,
    (err) => {
        if(err) console.log("Failed to make Set_Legalities Table")
    }
);

db.run(`CREATE TABLE IF NOT EXISTS Card_TCGPlayer_Data (
            id TEXT PRIMARY KEY,
            URL TEXT,
            normal TEXT,
            holofoil TEXT,
            reverseHolofoil TEXT,
            firstEditionHolofoil TEXT,
            firstEditionNormal TEXT,
            updatedAt TEXT,
            FOREIGN KEY(id) references Cards(id)
        )`,
    (err) => {
        if(err) console.log("Failed to make Card_TCGPlayer_Data Table")
    }
);



db.run(`CREATE TABLE IF NOT EXISTS Cardmarket_Data (
            id TEXT PRIMARY KEY,
            URL TEXT,
            data TEXT,
            updatedAt TEXT,
            FOREIGN KEY(id) references Cards(id)
        )`,
    (err) => {
        if(err) console.log("Failed to make Cardmarket_Data Table")
    }
);

console.log("Card tables initialised");