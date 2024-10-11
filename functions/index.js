const functions = require("firebase-functions");
const sgMail = require("@sendgrid/mail");

// 设置 SendGrid 的 API 密钥
sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendEmailWithAttachment = functions.https.onCall(
    async (data, context) => {
      const {
        recipientEmail,
        emailSubject,
        emailMessage,
        attachment,
      } = data;

      try {
        const msg = {
          to: recipientEmail,
          from: "taoxiansheng805@gmail.com",
          subject: emailSubject,
          text: emailMessage,
          attachments: [
            {
              content: attachment.content,
              filename: attachment.filename,
              type: attachment.type,
              disposition: "attachment",
            },
          ],
        };

        await sgMail.send(msg);
        return {success: true, message: "Email sent successfully"};
      } catch (error) {
        console.error("Error sending email:", error);
        throw new functions.https.HttpsError(
            "internal",
            "Failed to send email",
            error.message,
        );
      }
    },
);
