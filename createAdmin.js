const database = require("./database");
const configs = require("./config");
const userManager = require("./usermanager/manager");
const readline = require("readline");
const argon2 = require("argon2");

const db = database.init(configs.getDatabaseConfig());
const um = new userManager(db);

const passwd = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

passwd.question("Admin password: ", (pw) => {
    pw = argon2.hash(pw);
    pw.then((res) => {
        let userRes = um.createUser(["test", res]);
        userRes.then(() => {
            passwd.close();
        });
    });
});

passwd.on("close", () => {
    console.log("User created!");
    process.exit(0);
});