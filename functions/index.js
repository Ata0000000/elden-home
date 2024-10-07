// index.js

const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

// 使用 CORS 中间件，允许特定来源
app.use(cors({
  origin: "http://localhost:5174", // 开发环境
  // origin: 'https://your-production-domain.com', // 生产环境时使用实际域名
}));

app.use(express.json());

// 发送邮件的路由
app.post("/sendEmail", async (req, res) => {
  const {recipientEmail, emailSubject, emailMessage, attachment} = req.body;

  // 配置邮件传输器（请使用环境变量管理敏感信息）
  const transporter = nodemailer.createTransport({
    service: "Gmail", // 或其他邮件服务
    auth: {
      user: "your-email@gmail.com",
      pass: "your-email-password",
    },
  });

  // 配置邮件选项
  const mailOptions = {
    from: "taoxiansheng805@gmail.com",
    to: recipientEmail,
    subject: emailSubject,
    text: emailMessage,
    attachments: attachment?
     [{filename: attachment.filename,
       content: Buffer.from(attachment.content, "base64"),
       contentType: attachment.type}]: [],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).json({message: "Email sent successfully!"});
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({error: "Failed to send email."});
  }
});

// 导出 Cloud Function
exports.sendEmail = functions.https.onRequest(app);
