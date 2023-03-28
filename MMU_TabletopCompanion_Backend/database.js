const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

const DBSOURCE = 'db.sqlite';
const {ADMIN_USERNAME, ADMIN_PASSWORD} = require('./app/lib/config');

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if(err){
        //Opening database failed
        console.log(err.message);
        throw err;
    }else{
        console.log('Connected to SQLite database...');

        db.run(`CREATE TABLE IF NOT EXISTS Users (
                    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username text UNIQUE,
                    password text,
                    salt text,
                    privilege_level INTEGER,
                    session_token text
                )`,
            (err) => {
                if(err) console.log("Failed to make Users table");

                const getHash = function(password, salt){
                    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
                };

                const INSERT = 'INSERT INTO users (username, password, salt, privilege_level) VALUES (?,?,?,?)';
                const salt = crypto.randomBytes(64);
                const hash = getHash(ADMIN_PASSWORD, salt);

                db.run(INSERT, [ADMIN_USERNAME, hash, salt.toString('hex'), 1], (err) => {
                    if(err) console.log("Admin account already exists");
                });
            }
        );

        db.run(`CREATE TABLE IF NOT EXISTS Decks (
                    deck_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    deck_name text,
                    card_ids text,
                    created_by text,
                    created_by_id INTEGER,
                    FOREIGN KEY(created_by) references users(username),
                    FOREIGN KEY(created_by_id) references users(user_id)
                )`,
            (err) => {
                if(err) console.log("Failed to make Decks table");
            }
        );
    }

    console.log("Users & Decks tables initialised");
});

module.exports = db;