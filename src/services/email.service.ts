import * as sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmailNotification(to: string, content: string) {
  await sgMail.send({
    to,
    from: 'your-email@example.com',
    subject: 'New Update in Google Sheets',
    text: content,
  });
}
