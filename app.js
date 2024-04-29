const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require("helmet");
const app = express();
// const mess_owner_db_connection = require('./src/connections/mess_owner_db.config');
const user = require("./src/routes/users")
const PORT = process.env.PORT

app.use(express.json({ limit: '200mb' }));
app.use(cors({ origin: '*' }))
app.use(express.urlencoded({ extended: true, limit: '200mb' }))
app.use(helmet());

// mess_owner_db_connection()
app.use('/', user)


const server = app.listen(PORT, (err) => {
    if (err) {
        throw err
    } else {
        console.log(`app is running on api url: http://localhost:${PORT}`)
    }
})
