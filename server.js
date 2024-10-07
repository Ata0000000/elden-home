/* eslint-env node */

// 导入依赖
import express from 'express';
import cors from 'cors'; // 导入 cors

// 创建 Express 应用
const app = express();
const port = process.env.PORT || 3000;

// 使用 CORS 中间件
app.use(cors()); // 允许所有域名的跨源请求
app.use(express.json()); // 解析 JSON 请求体

// 测试路由
app.get('/', (req, res) => {
    res.send('Hello from Node.js!');
});

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
