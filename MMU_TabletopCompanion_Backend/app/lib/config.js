// config.js
require('dotenv').config();

module.exports = {
  API_KEY: process.env.POKEMON_API_KEY,
  ADMIN_USERNAME: process.env.ADMIN_USERNAME,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  SERVER_ADDRESS: process.env.SERVER_ADDRESS,
  HTTP_PORT: process.env.HTTP_PORT
};