const users = require("../models/users.models");
const Joi = require("joi");

const getAllUsers = (req, res) => {
    users.getAllUsers((err, num_rows, results) => {
        if(err) return res.sendStatus(500);

        return res.status(200).send(results);
    });
}

const addNewUser = (req, res) => {
    const schema = Joi.object({
        "username": Joi.string().required(),
        "password": Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[ !\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,37}$/)).required()
    });

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    let user = Object.assign({}, req.body);

    users.addNewUser(user, (err, id) => {
        if(err) return res.sendStatus(500);

        return res.status(201).send({user_id: id});
    });
}

const updateUser = (req, res) => {
    let user_id = parseInt(req.params.user_id);
    users.getIDFromToken(req.get('X-Authorization'), (err, id) => {
        if(err || id === null){
            return res.sendStatus(401);
        }

        users.getPrivilege(user_id, (err, privilege) => {
            
            if(err === 404) return res.sendStatus(404);
            if(err) return res.sendStatus(500)
            if(req.privilegeLevel <= privilege && id != user_id) return res.sendStatus(401);
        
            users.getOneUser(user_id, (err, result) => {
                if(err === 404) return res.sendStatus(404);
                if(err) return res.sendStatus(500);
                
                const schema = Joi.object({
                    "username": Joi.string(),
                    "password": Joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[ !\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]).{8,37}$/))
                });
                
                const { error } = schema.validate(req.body);
                if(error) return res.status(400).send(error.details[0].message);
                
                if(req.body.hasOwnProperty("username")){
                    result.username = req.body.username;
                }
                if(req.body.hasOwnProperty("password")){
                    result.password = req.body.password;
                }
                
                users.updateUser(user_id, result, (err, id) => {
                    if(err){
                        console.log(err);
                        return res.sendStatus(500);
                    }
                
                    return res.sendStatus(200);
                });
            });
        })
    });
}

const deleteUser = (req, res) => {
    let user_id = parseInt(req.params.user_id);
    users.getIDFromToken(req.get('X-Authorization'), (err, id) => {
        if(err || id === null){
            return res.sendStatus(401);
        }

        users.getPrivilege(user_id, (err, privilege) => {

            if(err === 404) return res.sendStatus(404);
            if(err) return res.sendStatus(500)
            if(req.privilegeLevel <= privilege && id != user_id) return res.sendStatus(401);
        
            users.getOneUser(user_id, (err, result) => {
                if(err === 404) return res.sendStatus(404);
                if(err) return res.sendStatus(500);
                users.deleteUser(user_id, (err) => {
                    if(err){
                        console.log(err);
                        return res.sendStatus(500);
                    }
        
                    return res.status(200).send("User Deleted");
                });
            });
        })
    });
}

const login = (req, res) => {

    const schema = Joi.object({
        "username": Joi.string().required(),
        "password": Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    users.authenticateUser(req.body.username, req.body.password, (err, id) => {
        if(err === 404) return res.status(400).send("Invalid email/password supplied");
        if(err) return res.sendStatus(500);

        users.getToken(id, (err, token) => {
            if(err) return res.sendStatus(500);

            if(token){
                return res.status(200).send({user_id: id, session_token: token});
            }else{
                users.setToken(id, (err, token) => {
                    if(err) return res.sendStatus(500);
                    return res.status(200).send({user_id: id, session_token: token});
                });
            }
        });
    });
}

const logout = (req, res) => {
    users.removeToken(req.body.session_token, (err) => {
        if(err) return res.sendStatus(500);
        return res.status(200).send("Token deleted: " + req.body.session_token);
    });
}

module.exports = {
    getAllUsers: getAllUsers,
    addNewUser: addNewUser,
    updateUser: updateUser,
    deleteUser: deleteUser,
    login: login,
    logout:logout
}