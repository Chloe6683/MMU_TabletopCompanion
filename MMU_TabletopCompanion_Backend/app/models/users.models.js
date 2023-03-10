const db = require('../../database');
const crypto = require('crypto');

const getHash = function(password, salt){
    return crypto.pbkdf2Sync(password, salt, 100000, 256, 'sha256').toString('hex');
}

const getAllUsers = (done) => {
    const results = [];

    db.each(
        "SELECT * FROM users",
        [],
        (err, row) => {
            if(err) console.log("Something went wrong: " + err);

            results.push({
                user_id: row.user_id,
                username: row.username,
                privilege_level: row.privilege_level
            });
        },
        (err, num_rows) => {
            return done(err, num_rows, results);
        }
    );
}

const getOneUser = (user_id, done) => {
    const sql = 'SELECT * FROM users WHERE user_id=?';

    db.get(sql, [user_id], (err, row) => {
        if(err) return done(err);
        if(!row) return done(404);

        return done(null, {
            username: row.username,
            password: row.password
        });
    })
}

const addNewUser = (user, done) => {
    const salt = crypto.randomBytes(64);
    const hash = getHash(user.password, salt);
    const sql = 'INSERT INTO users (username, password, salt, privilege_level) VALUES (?,?,?,?)';
    let values = [user.username, hash, salt.toString('hex'), 0];

    db.run(sql, values, function(err){
        if(err) return done(err);

        return done(null, this.lastID);
    });
}

const updateUser = (id, user, done) => {
    const sql = 'UPDATE users SET username=?, password=?, salt=? WHERE user_id=?';

    const salt = crypto.randomBytes(64);
    const hash = getHash(user.password, salt);

    let values = [user.username, hash, salt.toString('hex'), id];
    db.run(sql, values, (err) => {
        return done(err);
    });
}

const deleteUser = (id, done) => {
    const sql = 'DELETE FROM users WHERE user_id=?';

    db.run(sql, [id], (err) => {
        if(err) return done(err);
        else return done(null);
    });
}


const authenticateUser = (username, password, done) => {
    const sql = 'SELECT user_id, password, salt FROM users WHERE username=?';

    db.get(sql, [username], (err, row) => {
        if(err) return done(err);
        if(!row) return done(404); //Invalid Username

        if(row.salt === null) row.salt = '';
        let salt = Buffer.from(row.salt, 'hex');

        if(row.password === getHash(password, salt)){
            return done(null, row.user_id);
        }else{
            return done(404); //Wrong Password
        }
    });
}

const getToken = (id, done) => {
    const sql = 'SELECT session_token FROM users WHERE user_id=?';

    db.get(sql, [id], (err, row) => {
        if(err) return done(err);
        if(!row) return done(404);

        return done(null, row.session_token);
    });
}

const setToken = (id, done) => {
    let token = crypto.randomBytes(16).toString('hex');

    const sql = 'UPDATE users SET session_token=? WHERE user_id=?';

    db.run(sql, [token, id], (err) => {
        return done(err, token);
    });
}

const removeToken = (token, done) => {
    const sql = 'UPDATE users SET session_token=null WHERE session_token=?';

    db.run(sql, [token], (err) => {
        return done(err);
    });
}

const getIDFromToken = (token, done) => {
    const sql = 'SELECT user_id FROM users WHERE session_token=?';

    db.get(sql, [token], (err, row) => {
        if(err) return done(err);
        if(!row) return done(404);

        return done(null, row.user_id);
    })
}

const getPrivilege = (id, done) => {
    const sql = 'SELECT privilege_level FROM users WHERE user_id=?';

    db.get(sql, [id], (err, row) => {
        if(err) return done(err);
        if(!row) return done(404);

        return done(null, row.privilege_level);
    });
}

module.exports = {
    getHash: getHash,
    getAllUsers: getAllUsers,
    getOneUser: getOneUser,
    addNewUser: addNewUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    authenticateUser: authenticateUser,
    getToken: getToken,
    setToken: setToken,
    removeToken: removeToken,
    getIDFromToken: getIDFromToken,
    getPrivilege: getPrivilege
}
