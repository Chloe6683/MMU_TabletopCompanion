const users = require('../controllers/users.controllers');
const auth = require("../lib/authentication");

module.exports = function(app){
    app.route("/users")
        .post(users.addNewUser)
        .get(auth.isAuthenticated, auth.minimumPrivilege(1), users.getAllUsers);

    app.route("/users/:user_id")
        .patch(auth.isAuthenticated, users.updateUser)
        .delete(auth.isAuthenticated, users.deleteUser);

    app.route("/login")
        .post(users.login);

    app.route("/logout")
        .post(auth.isAuthenticated, users.logout);
}