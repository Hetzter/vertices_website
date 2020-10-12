class AdminController {
    constructor(manager, userManager, projectManager) {
        this.manager = manager;
        this.userManager = userManager;
        this.projectManager = projectManager;
    }

    async adminPanel(req, res, next) {                           // verify session either redirect to /login or /admin
        let users = await this.userManager.getUsers();
        let projects = await this.projectManager.getAllProjects();
        res.render("admin", {
            action: null,
            msg: "",
            users: users,
            projects: projects
        });
    }
}

module.exports = AdminController;