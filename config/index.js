const configs = require("./config.json");

module.exports.getDatabaseConfig = function () {
    return configs.database;
}
module.exports.getServerConfig = function () {
    return configs.server;
}