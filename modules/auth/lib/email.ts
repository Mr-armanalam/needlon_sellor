
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);
const FROM = process.env.NODE_ENV === "production"
  ? "noreply@yourdomain.com"
  : "onboarding@resend.dev";

export async function sendOtpEmail(email: string, code: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Your login code",
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:0 auto">
        <h2>Your login code</h2>
        <p>Enter this code to sign in. It expires in 10 minutes.</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;padding:24px 0">
          ${code}
        </div>
        <p style="color:#666;font-size:14px">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}

export async function sendResetEmail(email: string, code: string) {
  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:0 auto">
        <h2>Reset your password</h2>
        <p>Enter this code to reset your password. It expires in 15 minutes.</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;padding:24px 0">
          ${code}
        </div>
        <p style="color:#666;font-size:14px">If you didn't request this, ignore this email.</p>
      </div>
    `,
  });
}