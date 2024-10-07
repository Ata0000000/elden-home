<template>
  <div class="admin-email-container">
    <h1>Admin Email Panel</h1>
    <div v-if="isAdmin">
      <h2>Send Email to Users with Attachments</h2>

      <form @submit.prevent="sendEmail">
        <div class="mb-3">
          <label for="recipient" class="form-label">Recipient Email:</label>
          <input
            type="email"
            id="recipient"
            v-model="recipientEmail"
            class="form-control"
            placeholder="Enter recipient email"
            required
          />
        </div>

        <div class="mb-3">
          <label for="subject" class="form-label">Subject:</label>
          <input
            type="text"
            id="subject"
            v-model="emailSubject"
            class="form-control"
            placeholder="Enter the subject"
            required
          />
        </div>

        <div class="mb-3">
          <label for="message" class="form-label">Message:</label>
          <textarea
            id="message"
            v-model="emailMessage"
            class="form-control"
            placeholder="Enter your message"
            rows="5"
            required
          ></textarea>
        </div>

        <div class="mb-3">
          <label for="attachment" class="form-label">Attachment:</label>
          <input
            type="file"
            id="attachment"
            class="form-control"
            @change="handleFileUpload"
          />
        </div>

        <button type="submit" class="btn btn-primary">Send Email</button>
      </form>

      <div
        v-if="emailStatus"
        class="alert mt-3"
        :class="{
          'alert-success': emailStatus === 'success',
          'alert-danger': emailStatus === 'error',
        }"
      >
        {{ emailMessageFeedback }}
      </div>
    </div>
    <div v-else>
      <p>Access Denied. Only admins can send emails.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; // 确保已安装 axios

const router = useRouter();

// Admin and email-related states
const isAdmin = ref(localStorage.getItem('isAdmin') === 'true');
const recipientEmail = ref('');
const emailSubject = ref('');
const emailMessage = ref('');
const emailAttachment = ref(null); // Ref to store the selected file
const emailStatus = ref(null);
const emailMessageFeedback = ref('');

// Handle file upload
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  emailAttachment.value = file;
  console.log(`File selected: ${file.name}`);
};

// Function to convert file to Base64
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result.split(',')[1]; // 去除前缀
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });

// Function to send email via backend server
const sendEmail = async () => {
  try {
    // Validate inputs before sending
    if (recipientEmail.value && emailSubject.value && emailMessage.value) {
      let attachmentData = null;

      if (emailAttachment.value) {
        const base64 = await toBase64(emailAttachment.value);
        attachmentData = {
          content: base64,
          filename: emailAttachment.value.name,
          type: emailAttachment.value.type,
        };
      }

      // 后端服务器的 URL
      const sendEmailUrl = 'https://elden-home.cloudfunctions.net/sendEmail'; // 如果后端部署在其他地方，请更改此URL

      // 发送 POST 请求到后端服务器
      const response = await axios.post(sendEmailUrl, {
        recipientEmail: recipientEmail.value,
        emailSubject: emailSubject.value,
        emailMessage: emailMessage.value,
        attachment: attachmentData,
      });

      if (response.data.message) {
        emailStatus.value = 'success';
        emailMessageFeedback.value = response.data.message;
        // 清空表单
        recipientEmail.value = '';
        emailSubject.value = '';
        emailMessage.value = '';
        emailAttachment.value = null;
      } else {
        throw new Error('Unexpected response');
      }
    } else {
      throw new Error('Please fill in all required fields.');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    emailStatus.value = 'error';
    emailMessageFeedback.value =
      error.response?.data?.error || error.message || 'Failed to send email.';
  }
};

// Check admin authentication on load
onMounted(() => {
  if (!isAdmin.value) {
    router.push('/access-denied');
  }
});
</script>

<style scoped>
.admin-email-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}
</style>
