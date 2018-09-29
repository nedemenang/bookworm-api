import dotenv from 'dotenv';

dotenv.load();

module.exports = {
    database: process.env.DATABASE_URI,
    secret: process.env.SECRET_KEY
}