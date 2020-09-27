const database = require('./database');
const server = require("./server");
const configs = require("./config");


const db = database.init(configs.getDatabaseConfig());
const appServer = server.init(db);

appServer.get("*", (req, res) => {
    res.sendFile("static/error.html", {root : __dirname});
});

appServer.listen(configs.getServerConfig().port, () => {
    console.log("Listening in port http://localhost.5000");
});