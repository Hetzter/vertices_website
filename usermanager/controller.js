const { urlencoded } = require("body-parser");
const argon2 = require("argon2");

class UserController {
    constructor(manager, projectManager) {
        this.manager = manager;
        this.projectManager = projectManager;
    }

    async getLogin(req, res, next) {
        let error = "";
        if (req.query.error == "noLogin") {
            error += "Not logged in";
        }
        res.render("login", {
            error: error
        });
    }

    async getUsers(skip, end) {
        let result = await this.manager.getUsers(skip, end);
        return(result);
    }

    async doLogin(req, res, next) {
        let error = "";
        if (!req.body.uname || !req.body.passwd) {          // invalid credentials provided
            error += "Invalid Username or Password";
        } else {                                            // credentials ok, check password
            let result = await this.manager.getUserByName(req.body.uname);
            if (result.length < 1) {                        // username does not exist
                error += "Username does not exist"
            } else {                                        // username exists
                try {                                       // try password comparison
                    if (await argon2.verify(result[0].passwd, req.body.passwd)) { // password ok
                        req.session.user = {
                            uname: result[0].uname,
                            passwd: result[0].passwd
                        };
                    } else {                                // wrong password
                        error += "Invalid Password";
                    }
                } catch (err) {                             // password comparion failed
                    console.log("Failed to compare password: ", err);
                    error += "Invalid Password";
                }
            }
        }
        if (error) {
            res.render("login", {                           // display error
                error: error
            });
        } else {
            res.redirect("/admin");                         // authentication passed, redirect to admin pannel
        }
    }

    async deleteUser(req, res, next) {
        let options = {
            status: null,
            msg: "",
            users: null,
            projects: null
        };
        let result = await this.manager.deleteUserByName(req.params.uname);
        options.status = "deleteUser";
        options.msg += "deleted user " + req.params.uname;
        options.users = await this.manager.getUsers();
        options.projects = await this.projectManager.getAllProjects();
        res.render("admin", options);
    }

    async createUser(req, res, next) {
        let options = {
            status: null,
            msg: "",
            users: null,
            projects: null
        };
        if (req.body.uname == "" || req.body.passwd == "") {
            options.status = "credentialsError";
            options.msg += " Invalid Credentials"
        } else {
            try { // try hasing password
                let hash = await argon2.hash(req.body.passwd); // hash password
                let result = await this.manager.createUser([req.body.uname, hash]);
                if (result) {
                    options.status = "userAdd";
                    options.msg += " Added user " + req.body.uname;
                } else {
                    options.status = "userExists";
                    options.msg += 'User "' + req.body.uname + '" already exists';
                }
            } catch (err) { // hash error
                console.log("Argon2 Hash error: " , err);
                options.status = "hashError";
                options.msg += 'Error hashing password';
            }
        }

        options.users = await this.manager.getUsers();
        options.projects = await this.projectManager.getAllProjects();
        res.render("admin", options);
    }
}

module.exports = UserController;