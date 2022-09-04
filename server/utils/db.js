require('dotenv').config();
const { MongoClient } = require('mongodb');

const { DB_USER, DB_PASS } = process.env;

// mongodb 位置
const url = 'localhost:27017';
const uri = `mongodb://${DB_USER}:${DB_PASS}@${url}/admin?authSource=admin`;

// 資料庫名
const dbName = 'test';

// 連立一個 MongoClient
const client = new MongoClient(uri);

client.connect()
  .then((connectedClient) => {
    client.isConnected = connectedClient.topology.s.state;
    console.log('mongodb is connected');
  })
  .catch((error) => {
    client.isConnected = 'disconnected';
    console.error(error);
  });

const db = client.db(dbName);
const users = db.collection('users');
const codes = db.collection('codes');

module.exports = { client, users, codes };
