require('dotenv').config();

const { DB_URI, DB_NAME } = process.env;
// const { DB_USER, DB_PASS, DB_URL } = process.env;
const { MongoClient, ServerApiVersion } = require('mongodb');

// mongodb 位置
// const uri = `mongodb://${DB_USER}:${DB_PASS}@${DB_URL}/`;
const uri = DB_URI;

// 資料庫名

// 連立一個 MongoClient
// const client = new MongoClient(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

client.connect()
  .then((connectedClient) => {
    client.isConnected = connectedClient.topology.s.state;
    console.log('mongodb is connected');
  })
  .catch((error) => {
    client.isConnected = 'disconnected';
    console.error(error);
  });

const db = client.db(DB_NAME);
const users = db.collection('users');
const codes = db.collection('codes');
const posts = db.collection('posts');
const lives = db.collection('lives');
const community = db.collection('community');

module.exports = {
  client, users, codes, posts, lives, community,
};
