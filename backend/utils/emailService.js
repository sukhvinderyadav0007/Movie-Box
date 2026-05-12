// Mock email service
const sendEmail = async (to, subject, text) => {
  console.log(`Email sent to ${to}: ${subject}`);
  console.log(`Body: ${text}`);
  return true;
};

module.exports = { sendEmail };
