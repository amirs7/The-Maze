const config = {};

config.serverPort = 8080;
config.dbUsername = process.env.DB_USERNAME;
config.dbPassword = process.env.DB_PASSWORD;
config.hostname = process.env.HOST_NAME;
config.jwtSecret = process.env.JWT_SECRET;

module.exports = config;