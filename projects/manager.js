class ProjectManager {
    constructor(database) {
        this.database = database;
    }

    async getProjectByName(name) {
        const query = `SELECT projectName, projectSubtitle, projectMediaLink, projectText FROM pages WHERE projectLocation = ?`;
        let conn = await this.database.getConnection((err) => {
            if (err) {
                console.log("Database Error", err);
            }
        });
        let res = await conn.execute(query, [name]);
        conn.release();
        return(JSON.parse(JSON.stringify(res[0][0])));
    }

    async getProjects(skip, pageSize) {
        const query = `SELECT projectName, projectImage, projectLocation FROM pages ORDER BY id LIMIT ?, ?`;
        let conn = await this.database.getConnection((err) => {
            if (err) {
                console.log("Database Error", err);
            }
        });
        let res = await conn.execute(query, [skip, pageSize]);
        conn.release();
        return(JSON.parse(JSON.stringify(res[0])));
    }

    async getAllProjects() {
        const query = `SELECT projectName, projectImage, projectLocation FROM pages ORDER BY id`;
        let conn = await this.database.getConnection((err) => {
            if (err) {
                console.log("Database Error", err);
            }
        });
        let res = await conn.execute(query);
        conn.release();
        return(JSON.parse(JSON.stringify(res[0])));
    }

    async createProject(data) {
        const query = `INSERT INTO pages (projectName, projectSubtitle, projectImage, projectMediaLink, projectLocation, projectText) VALUES (?, ?, ?, ?, ?, ?)`;
        let conn = await this.database.getConnection((err) => {
            if (err) {
                console.log("Database Error", err);
            }
        });
        try {
            let res = await conn.execute(query, data);
            return(res);
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return(null);
            }
        }    
        conn.release()
    }

    async deleteProjectByName(projectLocation) {
        const query = `DELETE FROM pages WHERE projectLocation = ?`;
        let conn = await this.database.getConnection((err) => {
            if (err) {
                console.log("Database Error", err);
            }
        });
        let res = await conn.execute(query, [projectLocation]);
        conn.release();
        return(res)
    }
}

module.exports = ProjectManager;