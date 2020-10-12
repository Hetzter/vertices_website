const userManager = require("../usermanager/manager");
const pagesManager = require("../projects/manager");
const AdminManager = require("./manager");
const AdminController = require("./controller");

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
    const um = new userManager(database);
    const pm = new pagesManager(database);
    const manager = new AdminManager(database);
    const controller = new AdminController(manager, um, pm);

    server.get("/admin", verifyUser, asyncHandler(controller.adminPanel.bind(controller)));

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