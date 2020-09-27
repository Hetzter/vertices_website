class ProjectController {
    constructor(manager, userManager) {
        this.manager = manager;
        this.userManager = userManager;
    }

    async getProjectByName(req, res, next) {
        let result = await this.manager.getProjectByName(req.params.name);
        res.render("project", result);
    }

    async getProjects(req, res, next) {
        const page = 1;
        const pageSize = 9;
        const skip = page * pageSize;
        let result = await this.manager.getProjects(page - 1, skip);

        res.render("index", {
            projects: result
        });
    }

    async createProject(req, res, next) {
        let options = {
            status: null,
            msg: "",
            users: null,
            projects: null
        };
        if (req.body.projectName        == "" || // one of the given parameter is null
            req.body.projectSubtitle    == "" ||
            req.body.projectImage       == "" ||
            req.body.projectMediaLink   == "" ||
            req.body.projectLocation    == "" ||
            req.body.projectText        == "" ) {
                options.status = "projectDataError";
                options.msg += "Invalid project data";
        } else {
            let result = await this.manager.createProject([
                req.body.projectName,
                req.body.projectSubtitle,
                req.body.projectImage,
                req.body.projectMediaLink,
                req.body.projectLocation,
                req.body.projectText
            ]);
            if (result) {
                options.status = "projectAdd";
                options.msg += " Added project " + req.body.projectName;
            } else {
                options.status = "projectExists";
                options.msg += "A project the same data already exists"
            }
        }

        options.users = await this.userManager.getUsers();
        options.projects = await this.manager.getAllProjects();
        res.render("admin", options);
    }

    async deleteProject(req, res, next) {
        let options = {
            status: null,
            msg: "",
            users: null,
            projects: null
        }
        let result = await this.manager.deleteProjectByName(req.params.projectLocation);
        options.status = "deleteProject"
        options.msg += "deleted project " + req.params.projectLocation;
        options.projects = await this.manager.getAllProjects();
        options.users = await this.userManager.getUsers();
        res.render("admin", options);
    }
}

module.exports = ProjectController;

