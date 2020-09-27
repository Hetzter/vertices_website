const ProjectManager = require("./manager");
const userManager = require("../usermanager/manager");
const ProjectController = require("./controller");

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
    const manager = new ProjectManager(database);
    const controller = new ProjectController(manager, um);

    server.get("/", asyncHandler(controller.getProjects.bind(controller)));
    server.post("/admin/project/delete/:projectLocation", verifyUser, asyncHandler(controller.deleteProject.bind(controller)));
    server.post("/admin/project/create", verifyUser, asyncHandler(controller.createProject.bind(controller)));
    server.get("/project/:name", asyncHandler(controller.getProjectByName.bind(controller)));

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