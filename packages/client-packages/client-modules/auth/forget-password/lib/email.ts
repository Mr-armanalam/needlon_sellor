import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT) || 587,
  secure: true,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
});

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
): Promise<void> {
  await transporter
    .sendMail({
      from: `"Needlon" <${process.env.EMAIL_SERVER_USER}>`,
      to: email,
      subject: "Reset your password",
      html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2>Reset your password</h2>
        <p>Click the button below to reset your password. 
           This link expires in <strong>1 hour</strong>.</p>
        <a href="${resetUrl}" 
           style="display:inline-block;padding:12px 24px;background:#4f46e5;
                  color:#fff;border-radius:6px;text-decoration:none;font-weight:600">
          Reset Password
        </a>
        <p style="color:#6b7280;font-size:13px;margin-top:24px">
          If you didn't request this, you can safely ignore this email.
        </p>
      </div>
    `,
    })
    .catch((error) => {
      if (error.message) {
        throw new Error("Otp is not sent");
      }
    });
}
