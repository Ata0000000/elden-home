// index.js

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();

// 使用 CORS 中间件，允许特定来源
app.use(cors({
  origin: "http://localhost:5174", // 开发环境
  // origin: 'https://your-production-domain.com', // 生产环境时使用实际域名
}));

app.use(express.json());

// 示例的 Hello World 路由
exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase using Express!");
});

// 导出 Cloud Function
exports.app = functions.https.onRequest(app);
