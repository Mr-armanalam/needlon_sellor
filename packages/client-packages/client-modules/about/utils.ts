'use server'
import nodemailer from 'nodemailer';
import { adminTemplate } from './components/admin-template';
import { clientTemplate } from './components/client-template';

export async function sendEmails(formData: { name: string; email: string; phone?: string; subject: string; message: string }) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: formData.email,
    to: 'armanalam91174@gmail.com',
    subject: `NEW INQUIRY: ${formData.subject}`,
    html: adminTemplate(formData), 
  });

  await transporter.sendMail({
    from: '"Needlon Bespoke" <armanalam91174@.com>',
    to: formData.email,
    subject: 'Thank you for contacting Needlon',
    html: clientTemplate(formData), 
  });
}