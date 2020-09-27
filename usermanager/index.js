const UserManager = require("./manager");
const projectManager = require("../projects/manager");
const UserController = require("./controller");

function asyncHandler(routeHandler) {
    return async function (req, res, next) {
    try {
        await routeHandler(req, res, next);
        } catch (err) {
            next(err);
        }
    }
}

const verifyUser = function(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        let err = "noLogin";
        next(err);
    }
}

module.exports.init = function(server, database, url) {
    const pm = new projectManager(database);
    const manager = new UserManager(database);
    const controller = new UserController(manager, pm);


    server.post("/admin/logout", (req, res) => {      // log user out and redirect to /
        req.session.destroy();
        res.redirect("/");
    });


    server.get("/login", asyncHandler(controller.getLogin.bind(controller)));
    server.post("/login", asyncHandler(controller.doLogin.bind(controller)));

    server.post("/admin/register", verifyUser, asyncHandler(controller.createUser.bind(controller)));
    server.post("/admin/user/delete/:uname", verifyUser, asyncHandler(controller.deleteUser.bind(controller)));

    server.use("/admin", (err, req, res, next) => { // redirecting if not logged in with error message
        console.log("user not logged in: ", err);
        res.redirect(url.format({
            pathname: "/login",
            query: {
                error: err
            }
        }));
    });
}
