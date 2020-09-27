class UserManager {
    constructor(database) {
        this.database = database;
    }

    async getUserByName(name) {
        const query = `SELECT uname, passwd FROM users WHERE uname = ?`;
        let conn = await this.database.getConnection((err) => {
            if (err) {
                console.log("Database Error", err);
            }
        });
        let res = await conn.execute(query, [name]);
        conn.release();
        return(JSON.parse(JSON.stringify(res[0])));
    }

    async getUsers() {
        const query = `SELECT uname FROM users ORDER BY uname`;
        let conn = await this.database.getConnection((err) => {
            if (err) {
                console.log("Database Error", err);
            }
        });
        let res = await conn.execute(query);
        conn.release();
        return(JSON.parse(JSON.stringify(res[0])));
    }

    async createUser(credentials) {
        const query = `INSERT INTO users (uname, passwd) VALUES (?, ?)`;
        let conn = await this.database.getConnection((err) => {
            if (err) {
                console.log("Database Error", err);
            }
        });
        try {
            let res = await conn.execute(query, credentials);
            return(res);
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                console.log("User already exists");
                return(null);
            }
        }    
        conn.release();
    }

    async deleteUserByName(name) {
        const query = `DELETE FROM users WHERE uname = ?`;
        let conn = await this.database.getConnection((err) => {
            if (err) {
                console.log("Database Error", err);
            }
        });
        let res = await conn.execute(query, [name]);
        conn.release();
        return(res);
    }
}

module.exports = UserManager;