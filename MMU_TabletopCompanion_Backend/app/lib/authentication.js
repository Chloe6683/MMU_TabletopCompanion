const users = require("../models/users.models");

const isAuthenticated = function(req, res, next){
    let token = req.get('X-Authorization');
    users.getIDFromToken(token, (err, id) => {
        if(err || id === null){
            return res.sendStatus(401);
        }

        users.getPrivilege(id, (err, privilege) => {
            if(err || privilege === null){
                return res.sendStatus(401);
            }
            req.privilegeLevel = privilege;
            next();
        });
    });
}

const minimumPrivilege = (requiredPrivilege) => {
    return(req, res, next) => {
        let privilege = req.privilegeLevel;
        if(privilege < requiredPrivilege) return res.sendStatus(401);
        next();
    }
}

module.exports = {
    isAuthenticated: isAuthenticated,
    minimumPrivilege: minimumPrivilege
}