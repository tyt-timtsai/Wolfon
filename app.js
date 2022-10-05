require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

const { SERVER_PORT, API_VERSION } = process.env;

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/**
 * API routes
 */

const liveRoute = require('./routes/live');
const codeRoute = require('./routes/code');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');
const communityRoute = require('./routes/community');

app.use(`/api/${API_VERSION}/live`, liveRoute);
app.use(`/api/${API_VERSION}/code`, codeRoute);
app.use(`/api/${API_VERSION}/user`, userRoute);
app.use(`/api/${API_VERSION}/post`, postRoute);
app.use(`/api/${API_VERSION}/community`, communityRoute);

// Page not found
app.use((req, res, next) => {
  res.status(404).sendFile(`${__dirname}/public/404.html`);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Internal Server Error : ', err);
  res.status(500).json({ message: 'Internal Server Error' });
});

const httpServer = app.listen(SERVER_PORT, () => {
  console.log('Server listening on port : ', SERVER_PORT);
});

module.exports = { httpServer };
