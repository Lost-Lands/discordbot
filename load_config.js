const config = require('./config.json');

exports.token = process.env.BOT_TOKEN || config.token;
exports.prefix = process.env.BOT_PREFIX || config.prefix;
exports.suggestion_channel = process.env.BOT_SUGGESTION_CHANNEL || config.suggestion_channel;
exports.joins_channel = process.env.BOT_JOINS_CHANNEL || config.joins_channel;
exports.vip_channel = process.env.BOT_VIP_CHANNEL || config.vip_channel;
exports.admin_guild = process.env.BOT_ADMIN_GUILD || config.admin_guild;
exports.vip_role = process.env.BOT_VIP_ROLE || config.vip_role;
exports.vip_plus_role = process.env.BOT_VIP_PLUS_ROLE || config.vip_plus_role;
exports.admin_role = process.env.BOT_ADMIN_ROLE || config.admin_role;
exports.mysql_host = process.env.MYSQL_HOST || config.mysql_host;
exports.mysql_user = process.env.MYSQL_USER || config.mysql_user;
exports.mysql_pass = process.env.MYSQL_PASS || config.mysql_pass;
exports.mysql_database = process.env.MYSQL_DATABASE || config.mysql_database;
exports.ftp_host = process.env.FTP_HOST || config.ftp_host;
exports.ftp_user = process.env.FTP_USER || config.ftp_user;
exports.ftp_pass = process.env.FTP_PASS || config.ftp_pass;
exports.uptimerobot_api_key = process.env.UPTIMEROBOT_API_KEY || config.uptimerobot_api_key;
exports.mongodb = process.env.MONGODB || config.mongodb;
exports.ticketsCategory = process.env.TICKETS_CATEGORY || config.tickets_category;


