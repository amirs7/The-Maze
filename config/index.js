const config = {};

config.serverPort = process.env.SERVER_PORT;
config.dbUsername = process.env.DB_USERNAME;
config.dbPassword = process.env.DB_PASSWORD;
config.hostname = process.env.HOST_NAME;
config.jwtSecret = process.env.JWT_SECRET;

module.exports = config;
